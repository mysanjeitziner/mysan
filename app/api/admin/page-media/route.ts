
import { NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import { getAdminUser } from '@/lib/auth-admin'
import cloudinary from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_PAGES = [
  'home',
  'dienstleistungen',
  'team',
  'referenzen',
  'news',
  'kontakt',
]

const ALLOWED_TYPES = [
  'hero',
  'team',
  'references',
  'news',
  'contact',
  'services',
]

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

type MediaRecord = Record<string, any> & {
  opacity?: number | string | null
}

type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
}

/* =========================================================
   ADMIN-AUTHENTIFIZIERUNG
========================================================= */

async function authorizeAdmin() {
  const admin = await getAdminUser()

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Du bist nicht angemeldet oder hast keine Admin-Berechtigung.',
      },
      { status: 401 }
    )
  }

  return null
}

/* =========================================================
   HILFSFUNKTIONEN
========================================================= */

function normalizeMedia<T extends Record<string, any>>(
  media: T
): Omit<T, 'opacity'> & {
  opacity: number | null
} {
  const opacityValue = media.opacity

  return {
    ...media,
    opacity:
      opacityValue === null || opacityValue === undefined
        ? null
        : Number(opacityValue),
  }
}

// Unsere neuen Cloudinary-Bilder liegen alle unter mysan/.
function isCloudinaryPublicId(
  storagePath: string | null | undefined
): boolean {
  return Boolean(storagePath?.startsWith('mysan/'))
}

// Cloudinary-Bild löschen.
async function deleteCloudinaryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  })
}

// Bild zu Cloudinary hochladen.
async function uploadToCloudinary(
  buffer: Buffer,
  page: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `mysan/${page}`,
        resource_type: 'image',
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(
            new Error('Cloudinary hat kein Ergebnis zurückgegeben.')
          )
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        })
      }
    )

    uploadStream.end(buffer)
  })
}

/* =========================================================
   POST
   BILD HOCHLADEN ODER ERSETZEN
========================================================= */

export async function POST(request: Request) {
  let uploadedPublicId: string | null = null

  try {
    const authResponse = await authorizeAdmin()

    if (authResponse) {
      return authResponse
    }

    const formData = await request.formData()

    const file = formData.get('file')
    const page = String(formData.get('page') || '').trim()
    const mediaType = String(
      formData.get('mediaType') || ''
    ).trim()

    const altText = String(
      formData.get('altText') || ''
    ).trim()

    const opacityValue = Number(
      formData.get('opacity') ?? 0.18
    )

    const visibleValue = String(
      formData.get('visible') ?? 'true'
    )

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Keine Bilddatei erhalten.',
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_PAGES.includes(page)) {
      return NextResponse.json(
        {
          success: false,
          error: `Ungültige Seite: ${page}`,
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(mediaType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Ungültiger Bildtyp: ${mediaType}`,
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nur JPG, PNG, WebP und AVIF sind erlaubt.',
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Das Bild darf maximal 10 MB gross sein.',
        },
        { status: 400 }
      )
    }

    const opacity = Number.isFinite(opacityValue)
      ? Math.max(0, Math.min(1, opacityValue))
      : 0.18

    const visible = visibleValue !== 'false'

    // Vorhandenen Datensatz aus Neon laden.
    const existingRows = await sql`
      SELECT
        id,
        page,
        media_type,
        storage_path,
        public_url,
        alt_text,
        opacity,
        visible
      FROM public.page_media
      WHERE page = ${page}
        AND media_type = ${mediaType}
      LIMIT 1
    `

    const existing = existingRows[0] ?? null

    // Datei vorbereiten.
    const buffer = Buffer.from(
      await file.arrayBuffer()
    )

    // Neues Bild zu Cloudinary hochladen.
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      page
    )

    uploadedPublicId = cloudinaryResult.public_id

    const publicUrl = cloudinaryResult.secure_url
    const storagePath = cloudinaryResult.public_id

    if (!publicUrl || !storagePath) {
      throw new Error(
        'Cloudinary hat keine gültige Bildadresse geliefert.'
      )
    }

    // Bildinformationen in Neon speichern.
    const mediaRows = await sql`
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
        ${page},
        ${mediaType},
        ${storagePath},
        ${publicUrl},
        ${altText || null},
        ${opacity},
        ${visible},
        NOW()
      )
      ON CONFLICT (page, media_type)
      DO UPDATE SET
        storage_path = EXCLUDED.storage_path,
        public_url = EXCLUDED.public_url,
        alt_text = EXCLUDED.alt_text,
        opacity = EXCLUDED.opacity,
        visible = EXCLUDED.visible,
        updated_at = NOW()
      RETURNING *
    `

    const media = mediaRows[0] as
      | MediaRecord
      | undefined

    if (!media) {
      throw new Error(
        'Der Medien-Datensatz konnte nicht gespeichert werden.'
      )
    }

    // Neues Bild ist erfolgreich gespeichert.
    uploadedPublicId = null

    // Altes Cloudinary-Bild erst nach erfolgreichem
    // Datenbank-Update löschen.
    // Alte Supabase-Bilder bleiben vorerst unangetastet.
    if (
      existing?.storage_path &&
      existing.storage_path !== storagePath &&
      isCloudinaryPublicId(String(existing.storage_path))
    ) {
      try {
        await deleteCloudinaryImage(
          String(existing.storage_path)
        )
      } catch (deleteError) {
        console.warn(
          'ALTES CLOUDINARY-BILD KONNTE NICHT GELÖSCHT WERDEN:',
          deleteError
        )
      }
    }

    return NextResponse.json(
      {
        success: true,
        media: normalizeMedia(media),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PAGE MEDIA POST ERROR:', error)

    // Neues Bild bei einem Fehler wieder entfernen.
    if (uploadedPublicId) {
      try {
        await deleteCloudinaryImage(uploadedPublicId)
      } catch (cleanupError) {
        console.error(
          'CLOUDINARY CLEANUP ERROR:',
          cleanupError
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unbekannter Fehler beim Hochladen.',
      },
      { status: 500 }
    )
  }
}

/* =========================================================
   PATCH
   ALT-TEXT, TRANSPARENZ UND SICHTBARKEIT ÄNDERN
========================================================= */

export async function PATCH(request: Request) {
  try {
    const authResponse = await authorizeAdmin()

    if (authResponse) {
      return authResponse
    }

    const body = await request.json()

    const id = String(body?.id || '').trim()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Keine Medien-ID angegeben.',
        },
        { status: 400 }
      )
    }

    const opacityValue = Number(
      body?.opacity ?? 0.18
    )

    const opacity = Number.isFinite(opacityValue)
      ? Math.max(0, Math.min(1, opacityValue))
      : 0.18

    const visible = body?.visible !== false

    const altText =
      body?.alt_text === null ||
      body?.alt_text === undefined
        ? null
        : String(body.alt_text).trim() || null

    const rows = await sql`
      UPDATE public.page_media
      SET
        alt_text = ${altText},
        opacity = ${opacity},
        visible = ${visible},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    const media = rows[0] as
      | MediaRecord
      | undefined

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          error: 'Der Medieneintrag wurde nicht gefunden.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        media: normalizeMedia(media),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PAGE MEDIA PATCH ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Speichern fehlgeschlagen.',
      },
      { status: 500 }
    )
  }
}

/* =========================================================
   DELETE
   BILD UND DATENSATZ LÖSCHEN
========================================================= */

export async function DELETE(request: Request) {
  try {
    const authResponse = await authorizeAdmin()

    if (authResponse) {
      return authResponse
    }

    const url = new URL(request.url)

    let id = url.searchParams.get('id')

    if (!id) {
      try {
        const body = await request.json()
        id = body?.id ? String(body.id) : null
      } catch {
        // Kein JSON-Body vorhanden.
      }
    }

    id = id?.trim() || ''

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Keine Medien-ID angegeben.',
        },
        { status: 400 }
      )
    }

    // Datensatz aus Neon laden.
    const rows = await sql`
      SELECT
        id,
        page,
        media_type,
        storage_path
      FROM public.page_media
      WHERE id = ${id}
      LIMIT 1
    `

    const media = rows[0]

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          error: 'Der Medieneintrag wurde nicht gefunden.',
        },
        { status: 404 }
      )
    }

    // Datensatz aus Neon löschen.
    const deletedRows = await sql`
      DELETE FROM public.page_media
      WHERE id = ${id}
      RETURNING id
    `

    if (deletedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Der Medieneintrag konnte nicht gelöscht werden.',
        },
        { status: 404 }
      )
    }

    // Nur Cloudinary-Bilder löschen.
    // Alte Supabase-Bilder bleiben vorerst unangetastet.
    if (
      media.storage_path &&
      isCloudinaryPublicId(String(media.storage_path))
    ) {
      try {
        await deleteCloudinaryImage(
          String(media.storage_path)
        )
      } catch (deleteError) {
        console.error(
          'CLOUDINARY IMAGE DELETE ERROR:',
          deleteError
        )
      }
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('PAGE MEDIA DELETE ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Löschen fehlgeschlagen.',
      },
      { status: 500 }
    )
  }
}
