
import { NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import cloudinary from '@/lib/cloudinary'
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary'
import { sql } from '@/lib/neon'
import { getAdminUser } from '@/lib/auth-admin'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uploadToCloudinary(
  buffer: Buffer,
  publicId: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mysan/news',
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        invalidate: true,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error)
          return
        }

        if (!result?.secure_url || !result.public_id) {
          reject(
            new Error('Cloudinary hat keine gültige Bild-URL geliefert.')
          )
          return
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        })
      }
    )

    Readable.from(buffer).pipe(uploadStream)
  })
}

export async function POST(request: Request) {
  let uploadedPublicId: string | null = null

  try {
    /* ADMIN-BERECHTIGUNG PRÜFEN */

    const admin = await getAdminUser()

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nicht angemeldet oder keine Admin-Berechtigung.',
        },
        { status: 401 }
      )
    }

    /* FORMULAR LESEN */

    const formData = await request.formData()

    const title = String(formData.get('title') ?? '').trim()
    const excerpt = String(formData.get('excerpt') ?? '').trim()
    const content = String(formData.get('content') ?? '').trim()

    const published = formData.get('published') === 'true'
    const featured = formData.get('featured') === 'true'

    const fileValue = formData.get('file')
    const file =
      fileValue instanceof File && fileValue.size > 0
        ? fileValue
        : null

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bitte einen Titel eingeben.',
        },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Aus dem Titel konnte kein gültiger Slug erstellt werden.',
        },
        { status: 400 }
      )
    }

    if (file && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nur JPG, PNG und WebP sind erlaubt.',
        },
        { status: 400 }
      )
    }

    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Das Bild darf maximal 10 MB gross sein.',
        },
        { status: 400 }
      )
    }

    /* ID UND BILD-URL VORBEREITEN */

    const id = crypto.randomUUID()
    let imageUrl: string | null = null

    /* BILD ZU CLOUDINARY HOCHLADEN */

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())

      const result = await uploadToCloudinary(buffer, id)

      imageUrl = result.secure_url
      uploadedPublicId = result.public_id

      console.log('NEWS IMAGE UPLOADED:', imageUrl)
    }

    /* NEWS IN NEON SPEICHERN */

    const rows = await sql`
      INSERT INTO public.news (
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        published,
        featured,
        created_at,
        updated_at
      )
      VALUES (
        ${id},
        ${title},
        ${slug},
        ${excerpt || null},
        ${content || null},
        ${imageUrl},
        ${published},
        ${featured},
        NOW(),
        NOW()
      )
      RETURNING id, slug
    `

    if (rows.length === 0) {
      throw new Error(
        'Die News konnte nicht in Neon gespeichert werden.'
      )
    }

    /* UPLOAD ERFOLGREICH ABGESCHLOSSEN */

    uploadedPublicId = null

    return NextResponse.json(
      {
        success: true,
        id: rows[0].id,
        slug: rows[0].slug,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('ADMIN NEWS CREATE ERROR:', error)

    /* BILD ENTFERNEN, WENN DAS SPEICHERN FEHLSCHLÄGT */

    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId, {
          resource_type: 'image',
          invalidate: true,
        })
      } catch (cleanupError) {
        console.error('NEWS IMAGE CLEANUP ERROR:', cleanupError)
      }
    }

    const message =
      error instanceof Error
        ? error.message
        : 'Die News konnte nicht gespeichert werden.'

    const isDuplicate =
      /duplicate key|unique constraint/i.test(message)

    return NextResponse.json(
      {
        success: false,
        error: isDuplicate
          ? 'Dieser News-Slug existiert bereits. Bitte ändere den Titel.'
          : message,
      },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}
