'use server'

import { revalidatePath } from 'next/cache'
import { AwsClient } from 'aws4fetch'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/auth-admin'
import { sql } from '@/lib/neon'

const ALLOWED_PAGES = [
  'home',
  'team',
  'referenzen',
  'news',
] as const

type PageName = (typeof ALLOWED_PAGES)[number]

type ExistingMedia = {
  id: string
  storage_path: string | null
  public_url: string | null
}

type HeroSettingsResult = {
  id: string
  opacity: number | string | null
}

const NEON_BUCKET = 'mysan-media'

/*
=========================================================
NEON OBJECT STORAGE
=========================================================
*/

function getNeonStorageConfig() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/+$/, '')
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Neon Object Storage ist nicht vollständig konfiguriert. ' +
        'Bitte AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID und ' +
        'AWS_SECRET_ACCESS_KEY in .env.local prüfen.',
    )
  }

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: 's3',
    region: 'us-east-2',
  })

  return { endpoint, client }
}

function getNeonObjectUrl(storagePath: string) {
  const { endpoint } = getNeonStorageConfig()

  const encodedPath = storagePath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')

  return `${endpoint}/${NEON_BUCKET}/${encodedPath}`
}

function isNeonObjectUrl(publicUrl: string | null) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/+$/, '')

  return Boolean(
    endpoint &&
      publicUrl?.startsWith(`${endpoint}/${NEON_BUCKET}/`),
  )
}

async function uploadToNeon(storagePath: string, file: File) {
  const { client } = getNeonStorageConfig()
  const url = getNeonObjectUrl(storagePath)
  const bytes = new Uint8Array(await file.arrayBuffer())

  const response = await client.fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': file.type || 'application/octet-stream',
    },
    body: bytes,
  })

  if (!response.ok) {
    console.error(
      'Neon-Upload fehlgeschlagen:',
      response.status,
      await response.text(),
    )

    throw new Error('Das Bild konnte nicht zu Neon hochgeladen werden.')
  }

  return url
}

async function deleteFromNeon(storagePath: string) {
  const { client } = getNeonStorageConfig()
  const url = getNeonObjectUrl(storagePath)

  const response = await client.fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok && response.status !== 404) {
    console.error(
      'Neon-Datei konnte nicht gelöscht werden:',
      response.status,
      await response.text(),
    )

    throw new Error('Die Datei konnte nicht aus Neon gelöscht werden.')
  }
}

/*
=========================================================
BESTEHENDE DATEIEN LÖSCHEN
=========================================================
*/

async function removeStoredMedia(media: ExistingMedia) {
  if (!media.storage_path) {
    return
  }

  if (isNeonObjectUrl(media.public_url)) {
    await deleteFromNeon(media.storage_path)
    return
  }

  // Alte Dateien liegen gegebenenfalls noch in Supabase.
  const supabase = await createClient()

  const { error } = await supabase.storage
    .from('page-media')
    .remove([media.storage_path])

  if (error) {
    console.error(
      'Alte Supabase-Datei konnte nicht gelöscht werden:',
      error,
    )
  }
}

/*
=========================================================
ADMIN PRÜFEN – BETTER AUTH
=========================================================
*/

async function requireAdmin() {
  const user = await getAdminUser()

  if (!user) {
    throw new Error(
      'Nicht angemeldet oder keine Administratorrechte.',
    )
  }

  return user
}

/*
=========================================================
SEITE VALIDIEREN
=========================================================
*/

function getPage(formData: FormData): PageName {
  const page = String(formData.get('page') || '')

  if (!ALLOWED_PAGES.includes(page as PageName)) {
    throw new Error('Ungültige Seite.')
  }

  return page as PageName
}

/*
=========================================================
DATEI-EXTENSION
=========================================================
*/

function getExtension(file: File) {
  const name = file.name.toLowerCase()
  const extension = name.split('.').pop()

  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif']

  if (!extension || !allowed.includes(extension)) {
    throw new Error(
      'Nur JPG, PNG, WEBP oder AVIF sind erlaubt.',
    )
  }

  return extension
}

/*
=========================================================
CACHE AKTUALISIEREN
=========================================================
*/

function revalidateHeroPaths() {
  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')
  revalidatePath('/admin/content')
  revalidatePath('/admin/website-inhalte')
}

/*
=========================================================
HERO HOCHLADEN / ERSETZEN
=========================================================
*/

export async function saveHeroImage(formData: FormData) {
  await requireAdmin()

  const page = getPage(formData)
  const file = formData.get('file')

  if (!(file instanceof File)) {
    throw new Error('Keine Datei ausgewählt.')
  }

  if (file.size === 0) {
    throw new Error('Die Datei ist leer.')
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Das Bild darf maximal 10 MB gross sein.')
  }

  const extension = getExtension(file)

  /*
  ---------------------------------------------------------
  VORHANDENES MEDIUM AUS NEON LESEN
  ---------------------------------------------------------
  */

  const oldMediaResult = (await sql`
    SELECT id, storage_path, public_url
    FROM public.page_media
    WHERE page = ${page}
      AND media_type = ${'hero'}
    LIMIT 1
  `) as ExistingMedia[]

  const oldMedia = oldMediaResult[0] ?? null

  /*
  ---------------------------------------------------------
  NEUEN STORAGE-PFAD ERSTELLEN
  ---------------------------------------------------------
  */

  const storagePath =
    `hero/${page}/${crypto.randomUUID()}.${extension}`

  /*
  ---------------------------------------------------------
  BILD IN NEON OBJECT STORAGE HOCHLADEN
  ---------------------------------------------------------
  */

  const publicUrl = await uploadToNeon(storagePath, file)

  /*
  ---------------------------------------------------------
  DATENSATZ IN NEON POSTGRES SPEICHERN
  ---------------------------------------------------------
  */

  try {
    if (oldMedia) {
      await sql`
        UPDATE public.page_media
        SET
          storage_path = ${storagePath},
          public_url = ${publicUrl},
          alt_text = ${`${page} Hero`},
          visible = ${true},
          updated_at = NOW()
        WHERE id = ${oldMedia.id}
      `
    } else {
      await sql`
        INSERT INTO public.page_media (
          page,
          media_type,
          storage_path,
          public_url,
          alt_text,
          visible,
          opacity,
          created_at,
          updated_at
        )
        VALUES (
          ${page},
          ${'hero'},
          ${storagePath},
          ${publicUrl},
          ${`${page} Hero`},
          ${true},
          ${0.18},
          NOW(),
          NOW()
        )
      `
    }
  } catch (error) {
    // Upload aufräumen, falls das Speichern der Metadaten scheitert.
    try {
      await deleteFromNeon(storagePath)
    } catch (cleanupError) {
      console.error(
        'Neon-Upload konnte nach Datenbankfehler nicht aufgeräumt werden:',
        cleanupError,
      )
    }

    console.error('Neon-Speichern fehlgeschlagen:', error)

    throw new Error(
      'Das Bild konnte nicht in der Datenbank gespeichert werden.',
    )
  }

  /*
  ---------------------------------------------------------
  ALTES BILD ENTFERNEN
  ---------------------------------------------------------
  */

  if (
    oldMedia?.storage_path &&
    oldMedia.storage_path !== storagePath
  ) {
    try {
      await removeStoredMedia(oldMedia)
    } catch (error) {
      console.error(
        'Das alte Hero-Bild konnte nicht entfernt werden:',
        error,
      )
    }
  }

  revalidateHeroPaths()

  return {
    success: true,
    url: publicUrl,
  }
}

/*
=========================================================
HERO LÖSCHEN
=========================================================
*/

export async function deleteHeroImage(formData: FormData) {
  await requireAdmin()

  const page = getPage(formData)

  const mediaResult = (await sql`
    SELECT id, storage_path, public_url
    FROM public.page_media
    WHERE page = ${page}
      AND media_type = ${'hero'}
    LIMIT 1
  `) as ExistingMedia[]

  const media = mediaResult[0] ?? null

  if (!media) {
    return { success: true }
  }

  /*
  ---------------------------------------------------------
  DATENSATZ IN NEON LÖSCHEN
  ---------------------------------------------------------
  */

  await sql`
    DELETE FROM public.page_media
    WHERE id = ${media.id}
  `

  /*
  ---------------------------------------------------------
  DATEI AUS DEM PASSENDEN STORAGE ENTFERNEN
  ---------------------------------------------------------
  */

  try {
    await removeStoredMedia(media)
  } catch (error) {
    console.error(
      'Hero-Datei konnte nicht aus dem Storage entfernt werden:',
      error,
    )
  }

  revalidateHeroPaths()

  return { success: true }
}

/*
=========================================================
HERO-EINSTELLUNGEN AKTUALISIEREN
=========================================================
*/

export async function updateHeroSettings(formData: FormData) {
  await requireAdmin()

  const page = getPage(formData)
  const opacityValue = formData.get('opacity')
  const opacity = Number(opacityValue)
  const visible = formData.get('visible') === 'true'

  if (
    opacityValue === null ||
    String(opacityValue).trim() === '' ||
    !Number.isFinite(opacity) ||
    opacity < 0 ||
    opacity > 1
  ) {
    throw new Error('Ungültige Bildtransparenz.')
  }

  const result = (await sql`
    UPDATE public.page_media
    SET
      opacity = ${opacity},
      visible = ${visible},
      updated_at = NOW()
    WHERE page = ${page}
      AND media_type = ${'hero'}
    RETURNING id, opacity
  `) as HeroSettingsResult[]

  if (result.length === 0) {
    throw new Error('Für diese Seite wurde kein Hero-Bild gefunden.')
  }

  revalidateHeroPaths()

  return { success: true }
}
