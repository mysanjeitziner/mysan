
import { NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/auth-admin'
import cloudinary from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: Request) {
  try {
    // Admin-Berechtigung prüfen
    const admin = await getAdminUser()

    if (!admin) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    // Datei aus dem Formular lesen
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Keine gültige Datei übermittelt' },
        { status: 400 }
      )
    }

    // Dateityp prüfen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Nur Bilddateien sind erlaubt' },
        { status: 400 }
      )
    }

    // Dateigrösse prüfen
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Das Bild darf maximal 10 MB gross sein' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Bild zu Cloudinary hochladen
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'mysan',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload fehlgeschlagen'))
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (error) {
    console.error('Cloudinary Upload Fehler:', error)

    return NextResponse.json(
      { error: 'Bild konnte nicht hochgeladen werden' },
      { status: 500 }
    )
  }
}
