
'use server'

import { Readable } from 'node:stream'
import cloudinary from '@/lib/cloudinary'
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary'
import { getAdminUser } from '@/lib/auth-admin'
import { sql } from '@/lib/neon'
import { revalidatePath } from 'next/cache'

const ALLOWED_PAGES = [
  'home',
  'team',
  'referenzen',
  'news',
] as const

type Page = (typeof ALLOWED_PAGES)[number]

type ExistingMedia = {
  id: string
  storage_path: string | null
  public_url: string | null
}

function isValidPage(page: string): page is Page {
  return ALLOWED_PAGES.includes(page as Page)
}

async function requireAdmin() {
  const user = await getAdminUser()

  if (!user) {
    return null
  }

  return user
}

function refreshMediaPages() {
  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')
  revalidatePath('/admin')
  revalidatePath('/admin/media')
  revalidatePath('/admin/website-inhalte')
}

/*
=========================================================
CLOUDINARY – BILD HOCHLADEN
=========================================================
*/

async function uploadToCloudinary(
  buffer: Buffer,
  page: Page
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const publicId = `${page}-${crypto.randomUUID()}`

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mysan/page-media',
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(new Error('Cloudinary hat kein Upload-Ergebnis geliefert.'))
          return
        }

        resolve(result)
      }
    )

    Readable.from(buffer).pipe(uploadStream)
  })
}

/*
=========================================================
CLOUDINARY – PUBLIC ID AUS URL ERMITTELN
=========================================================
*/

function getCloudinaryPublicId(
  storagePath: string | null,
  publicUrl: string | null
): string | null {
  if (
    storagePath &&
    storagePath.startsWith('mysan/page-media/')
  ) {
    return storagePath
  }

  if (!publicUrl) {
    return null
  }

  try {
    const url = new URL(publicUrl)

    if (url.hostname !== 'res.cloudinary.com') {
      return null
    }

    const marker = '/image/upload/'
    const markerIndex = url.pathname.indexOf(marker)

    if (markerIndex === -1) {
      return null
    }

    let publicId = url.pathname.slice(
      markerIndex + marker.length
    )

    publicId = publicId.replace(/^v\d+\//, '')
    publicId = decodeURIComponent(publicId)
    publicId = publicId.replace(/\.[^/.]+$/, '')

    if (!publicId.startsWith('mysan/page-media/')) {
      return null
    }

    return publicId
  } catch {
    return null
  }
}

/*
=========================================================
CLOUDINARY – BILD LÖSCHEN
=========================================================
*/

async function deleteCloudinaryImage(
  publicId: string | null
) {
  if (!publicId) {
    return
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    })

    if (
      result.result !== 'ok' &&
      result.result !== 'not found'
    ) {
      console.warn(
        'CLOUDINARY DELETE WARNING:',
        result
      )
    }
  } catch (error) {
    console.error('CLOUDINARY DELETE ERROR:', error)
  }
}

/*
=========================================================
HERO-BILD HOCHLADEN / ERSETZEN
NEON: DATENBANK
CLOUDINARY: STORAGE
=========================================================
*/

export async function uploadPageMedia(formData: FormData) {
  const user = await requireAdmin()

  if (!user) {
    return {
      success: false,
      error: 'Keine Adminberechtigung. Bitte erneut anmelden.',
    }
  }

  const pageValue = formData.get('page')
  const file = formData.get('file')

  const altText = String(
    formData.get('alt_text') || ''
  ).trim()

  const opacityValue = Number(
    formData.get('opacity') ?? 0.18
  )

  if (
    typeof pageValue !== 'string' ||
    !isValidPage(pageValue)
  ) {
    return {
      success: false,
      error: 'Ungültige Seite.',
    }
  }

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      error: 'Kein gültiges Bild ausgewählt.',
    }
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Nur JPG, PNG, WebP oder AVIF sind erlaubt.',
    }
  }

  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      error: 'Das Bild darf maximal 10 MB gross sein.',
    }
  }

  const opacity = Math.min(
    1,
    Math.max(
      0,
      Number.isFinite(opacityValue) ? opacityValue : 0.18
    )
  )

  /*
  ---------------------------------------------------------
  BISHERIGEN DATENSATZ AUS NEON LADEN
  ---------------------------------------------------------
  */

  let oldMedia: ExistingMedia | null = null

  try {
    const rows = await sql`
      SELECT id, storage_path, public_url
      FROM public.page_media
      WHERE page = ${pageValue}
        AND media_type = 'hero'
      LIMIT 1
    `

    oldMedia = (rows[0] as ExistingMedia | undefined) ?? null
  } catch (error) {
    console.error('NEON LOAD PAGE MEDIA ERROR:', error)

    return {
      success: false,
      error: 'Das bestehende Bild konnte nicht geladen werden.',
    }
  }

  /*
  ---------------------------------------------------------
  BILD ZU CLOUDINARY HOCHLADEN
  ---------------------------------------------------------
  */

  const buffer = Buffer.from(await file.arrayBuffer())

  let uploaded: UploadApiResponse

  try {
    uploaded = await uploadToCloudinary(buffer, pageValue)
  } catch (error) {
    console.error('CLOUDINARY PAGE MEDIA UPLOAD ERROR:', error)

    return {
      success: false,
      error: 'Das Bild konnte nicht zu Cloudinary hochgeladen werden.',
    }
  }

  const publicUrl = uploaded.secure_url
  const publicId = uploaded.public_id

  /*
  ---------------------------------------------------------
  METADATEN IN NEON SPEICHERN
  ---------------------------------------------------------
  */

  try {
    await sql`
      INSERT INTO public.page_media (
        page,
        media_type,
        storage_path,
        public_url,
        alt_text,
        opacity,
        visible,
        updated_at
      )
      VALUES (
        ${pageValue},
        'hero',
        ${publicId},
        ${publicUrl},
        ${altText || null},
        ${opacity},
        TRUE,
        NOW()
      )
      ON CONFLICT (page)
      DO UPDATE SET
        media_type = EXCLUDED.media_type,
        storage_path = EXCLUDED.storage_path,
        public_url = EXCLUDED.public_url,
        alt_text = EXCLUDED.alt_text,
        opacity = EXCLUDED.opacity,
        visible = TRUE,
        updated_at = NOW()
    `
  } catch (error) {
    console.error('NEON SAVE PAGE MEDIA ERROR:', error)

    await deleteCloudinaryImage(publicId)

    return {
      success: false,
      error:
        'Das Bild wurde hochgeladen, konnte aber nicht in Neon gespeichert werden.',
    }
  }

  /*
  ---------------------------------------------------------
  ALTES BILD AUS CLOUDINARY ENTFERNEN
  ---------------------------------------------------------
  */

  if (oldMedia) {
    const oldPublicId = getCloudinaryPublicId(
      oldMedia.storage_path,
      oldMedia.public_url
    )

    if (oldPublicId && oldPublicId !== publicId) {
      await deleteCloudinaryImage(oldPublicId)
    }
  }

  refreshMediaPages()

  return {
    success: true,
    url: publicUrl,
  }
}

/*
=========================================================
TRANSPARENZ UND ALT-TEXT SPEICHERN
NEON: DATENBANK
=========================================================
*/

export async function updatePageMediaSettings(
  formData: FormData
) {
  const user = await requireAdmin()

  if (!user) {
    return {
      success: false,
      error: 'Keine Adminberechtigung. Bitte erneut anmelden.',
    }
  }

  const pageValue = formData.get('page')

  const altText = String(
    formData.get('alt_text') || ''
  ).trim()

  const opacityValue = Number(formData.get('opacity'))

  if (
    typeof pageValue !== 'string' ||
    !isValidPage(pageValue)
  ) {
    return {
      success: false,
      error: 'Ungültige Seite.',
    }
  }

  const opacity = Math.min(
    1,
    Math.max(
      0,
      Number.isFinite(opacityValue) ? opacityValue : 0.18
    )
  )

  try {
    const rows = await sql`
      UPDATE public.page_media
      SET
        alt_text = ${altText || null},
        opacity = ${opacity},
        updated_at = NOW()
      WHERE page = ${pageValue}
        AND media_type = 'hero'
      RETURNING id
    `

    if (rows.length === 0) {
      return {
        success: false,
        error: 'Für diese Seite wurde kein Hero-Bild gefunden.',
      }
    }
  } catch (error) {
    console.error('NEON UPDATE PAGE MEDIA ERROR:', error)

    return {
      success: false,
      error: 'Die Einstellungen konnten nicht gespeichert werden.',
    }
  }

  refreshMediaPages()

  return {
    success: true,
  }
}

/*
=========================================================
HERO-BILD LÖSCHEN
NEON: DATENBANK
CLOUDINARY: STORAGE
=========================================================
*/

export async function deletePageMedia(formData: FormData) {
  const user = await requireAdmin()

  if (!user) {
    return {
      success: false,
      error: 'Keine Adminberechtigung. Bitte erneut anmelden.',
    }
  }

  const pageValue = formData.get('page')

  if (
    typeof pageValue !== 'string' ||
    !isValidPage(pageValue)
  ) {
    return {
      success: false,
      error: 'Ungültige Seite.',
    }
  }

  /*
  ---------------------------------------------------------
  DATENSATZ IN NEON LÖSCHEN
  ---------------------------------------------------------
  */

  let deletedMedia: ExistingMedia | null = null

  try {
    const rows = await sql`
      DELETE FROM public.page_media
      WHERE page = ${pageValue}
        AND media_type = 'hero'
      RETURNING id, storage_path, public_url
    `

    deletedMedia =
      (rows[0] as ExistingMedia | undefined) ?? null
  } catch (error) {
    console.error('NEON DELETE PAGE MEDIA ERROR:', error)

    return {
      success: false,
      error: 'Der Media-Datensatz konnte nicht gelöscht werden.',
    }
  }

  if (!deletedMedia) {
    return {
      success: false,
      error: 'Für diese Seite existiert kein Hero-Bild.',
    }
  }

  /*
  ---------------------------------------------------------
  DATEI AUS CLOUDINARY LÖSCHEN
  ---------------------------------------------------------
  */

  const publicId = getCloudinaryPublicId(
    deletedMedia.storage_path,
    deletedMedia.public_url
  )

  if (publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      })

      if (
        result.result !== 'ok' &&
        result.result !== 'not found'
      ) {
        console.warn(
          'CLOUDINARY DELETE WARNING:',
          result
        )

        refreshMediaPages()

        return {
          success: true,
          warning:
            'Der Datenbankeintrag wurde gelöscht. Die Bilddatei konnte jedoch nicht aus Cloudinary entfernt werden.',
        }
      }
    } catch (error) {
      console.error('CLOUDINARY DELETE ERROR:', error)

      refreshMediaPages()

      return {
        success: true,
        warning:
          'Der Datenbankeintrag wurde gelöscht. Die Bilddatei konnte jedoch nicht aus Cloudinary entfernt werden.',
      }
    }
  }

  refreshMediaPages()

  return {
    success: true,
  }
}
