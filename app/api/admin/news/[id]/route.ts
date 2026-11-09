
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Readable } from 'node:stream'
import cloudinary from '@/lib/cloudinary'
import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary'
import { sql } from '@/lib/neon'
import { getAdminUser } from '@/lib/auth-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{ id: string }>
}

type NewsImage = {
  slug: string
  image_url: string | null
}

function isValidId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function requireAdmin() {
  const admin = await getAdminUser()

  if (!admin) {
    return NextResponse.json(
      {
        error: 'Du bist nicht angemeldet oder hast keine Admin-Berechtigung.',
      },
      { status: 401 }
    )
  }

  return null
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

/* CLOUDINARY PUBLIC ID AUS EINER BILD-URL ERMITTELN */

function getCloudinaryPublicId(imageUrl: string | null) {
  if (!imageUrl) return null

  try {
    const url = new URL(imageUrl)

    if (url.hostname !== 'res.cloudinary.com') {
      return null
    }

    const marker = '/image/upload/'
    const markerIndex = url.pathname.indexOf(marker)

    if (markerIndex === -1) {
      return null
    }

    const path = url.pathname.slice(markerIndex + marker.length)
    const parts = path.split('/').filter(Boolean)

    if (parts[0]?.match(/^v\d+$/)) {
      parts.shift()
    }

    if (parts.length === 0) {
      return null
    }

    const lastPart = parts[parts.length - 1]
    parts[parts.length - 1] = lastPart.replace(/\.[^.]+$/, '')

    const publicId = parts.join('/')

    if (!publicId.startsWith('mysan/news/')) {
      return null
    }

    return publicId
  } catch {
    return null
  }
}

/* CLOUDINARY-BILD LÖSCHEN */

async function removeCloudinaryImage(imageUrl: string | null) {
  const publicId = getCloudinaryPublicId(imageUrl)

  if (!publicId) return

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  })

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(
      `Cloudinary-Bild konnte nicht gelöscht werden: ${result.result}`
    )
  }
}

function refreshNewsPages(oldSlug?: string, newSlug?: string) {
  revalidatePath('/')
  revalidatePath('/news')
  revalidatePath('/admin/news')

  if (oldSlug) revalidatePath(`/news/${oldSlug}`)
  if (newSlug) revalidatePath(`/news/${newSlug}`)
}

/* NEWS LADEN */

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const authError = await requireAdmin()

  if (authError) return authError

  const { id } = await params

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Ungültige News-ID.' },
      { status: 400 }
    )
  }

  try {
    const rows = await sql`
      SELECT
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
      FROM public.news
      WHERE id = ${id}::uuid
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'News nicht gefunden.' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0], {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('News laden fehlgeschlagen:', error)

    return NextResponse.json(
      { error: 'Die News konnte nicht geladen werden.' },
      { status: 500 }
    )
  }
}

/* NEWS BEARBEITEN */

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const authError = await requireAdmin()

  if (authError) return authError

  const { id } = await params

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Ungültige News-ID.' },
      { status: 400 }
    )
  }

  let uploadedPublicId: string | null = null

  try {
    const formData = await request.formData()

    const title = String(formData.get('title') ?? '').trim()
    const excerpt = String(formData.get('excerpt') ?? '').trim()
    const content = String(formData.get('content') ?? '').trim()

    const published = formData.get('published') === 'true'
    const featured = formData.get('featured') === 'true'

    const requestedImageUrl = String(
      formData.get('image_url') ?? ''
    ).trim()

    const fileEntry = formData.get('file')

    const file =
      fileEntry instanceof File && fileEntry.size > 0
        ? fileEntry
        : null

    if (!title) {
      return NextResponse.json(
        { error: 'Bitte einen Titel eingeben.' },
        { status: 400 }
      )
    }

    const slug = createSlug(title)

    if (!slug) {
      return NextResponse.json(
        {
          error:
            'Aus dem Titel konnte kein gültiger URL-Slug erstellt werden.',
        },
        { status: 400 }
      )
    }

    const oldRows = await sql`
      SELECT slug, image_url
      FROM public.news
      WHERE id = ${id}::uuid
      LIMIT 1
    `

    if (oldRows.length === 0) {
      return NextResponse.json(
        { error: 'News nicht gefunden.' },
        { status: 404 }
      )
    }

    const oldNews = oldRows[0] as NewsImage

    let finalImageUrl: string | null = requestedImageUrl || null

    /* BILD PRÜFEN */

    if (file) {
      if (
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      ) {
        return NextResponse.json(
          {
            error: 'Bitte ein JPG-, PNG- oder WEBP-Bild auswählen.',
          },
          { status: 400 }
        )
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Das Bild darf maximal 10 MB gross sein.' },
          { status: 400 }
        )
      }

      /* NEUES BILD ZU CLOUDINARY HOCHLADEN */

      const buffer = Buffer.from(await file.arrayBuffer())
      const uniquePublicId = `${id}-${crypto.randomUUID()}`

      const result = await uploadToCloudinary(
        buffer,
        uniquePublicId
      )

      finalImageUrl = result.secure_url
      uploadedPublicId = result.public_id

      console.log('NEWS IMAGE UPLOADED:', finalImageUrl)
    }

    /* NEWS IN NEON AKTUALISIEREN */

    const updatedRows = await sql`
      UPDATE public.news
      SET
        title = ${title},
        slug = ${slug},
        excerpt = ${excerpt || null},
        content = ${content || null},
        image_url = ${finalImageUrl},
        published = ${published},
        featured = ${featured},
        updated_at = NOW()
      WHERE id = ${id}::uuid
      RETURNING
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
    `

    if (updatedRows.length === 0) {
      throw new Error('Die News wurde nicht aktualisiert.')
    }

    /* ALTES CLOUDINARY-BILD ENTFERNEN */

    const imageChanged =
      Boolean(file) ||
      (oldNews.image_url ?? null) !== finalImageUrl

    if (imageChanged && oldNews.image_url) {
      try {
        await removeCloudinaryImage(oldNews.image_url)
      } catch (cleanupError) {
        console.error(
          'Altes News-Bild konnte nicht entfernt werden:',
          cleanupError
        )
      }
    }

    uploadedPublicId = null

    refreshNewsPages(oldNews.slug, slug)

    return NextResponse.json({
      success: true,
      news: updatedRows[0],
    })
  } catch (error) {
    /* NEUES BILD BEI FEHLER ENTFERNEN */

    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(uploadedPublicId, {
          resource_type: 'image',
          invalidate: true,
        })
      } catch (cleanupError) {
        console.error(
          'Neues Cloudinary-Bild konnte nicht bereinigt werden:',
          cleanupError
        )
      }
    }

    console.error('News aktualisieren fehlgeschlagen:', error)

    const message =
      error instanceof Error
        ? error.message
        : 'Die News konnte nicht gespeichert werden.'

    const status = /unique|duplicate/i.test(message) ? 409 : 500

    return NextResponse.json(
      {
        error:
          status === 409
            ? 'Dieser URL-Slug ist bereits vergeben. Bitte ändere den Titel.'
            : message,
      },
      { status }
    )
  }
}

/* NEWS LÖSCHEN */

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const authError = await requireAdmin()

  if (authError) return authError

  const { id } = await params

  if (!isValidId(id)) {
    return NextResponse.json(
      { error: 'Ungültige News-ID.' },
      { status: 400 }
    )
  }

  try {
    const rows = await sql`
      SELECT slug, image_url
      FROM public.news
      WHERE id = ${id}::uuid
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'News nicht gefunden.' },
        { status: 404 }
      )
    }

    await sql`
      DELETE FROM public.news
      WHERE id = ${id}::uuid
    `

    /* ZUGEHÖRIGES CLOUDINARY-BILD ENTFERNEN */

    try {
      await removeCloudinaryImage(rows[0].image_url)
    } catch (storageError) {
      console.error(
        'News gelöscht, aber Cloudinary-Bild konnte nicht entfernt werden:',
        storageError
      )
    }

    refreshNewsPages(String(rows[0].slug))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('News löschen fehlgeschlagen:', error)

    return NextResponse.json(
      { error: 'Die News konnte nicht gelöscht werden.' },
      { status: 500 }
    )
  }
}
