
import { neon } from '@neondatabase/serverless'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'node:stream'

const APPLY = process.argv.includes('--apply')

function requiredEnv(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Umgebungsvariable ${name} fehlt.`)
  }

  return value
}

const databaseUrl = requiredEnv('DATABASE_URL')
const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL')
const supabaseKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY')

cloudinary.config({
  cloud_name: requiredEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: requiredEnv('CLOUDINARY_API_KEY'),
  api_secret: requiredEnv('CLOUDINARY_API_SECRET'),
  secure: true,
})

const sql = neon(databaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

function getBucketAndPath(publicUrl) {
  const url = new URL(publicUrl)
  const prefix = '/storage/v1/object/public/'

  if (!url.pathname.startsWith(prefix)) {
    throw new Error(`Unbekanntes Supabase-URL-Format: ${publicUrl}`)
  }

  const storagePath = decodeURIComponent(
    url.pathname.slice(prefix.length)
  )

  const separator = storagePath.indexOf('/')

  if (separator === -1) {
    throw new Error(`Ungültiger Storage-Pfad: ${storagePath}`)
  }

  return {
    bucket: storagePath.slice(0, separator),
    path: storagePath.slice(separator + 1),
  }
}

async function downloadImage(bucket, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path)

  if (error) {
    throw new Error(
      `Download fehlgeschlagen (${bucket}/${path}): ${error.message}`
    )
  }

  if (!data) {
    throw new Error(`Keine Bilddaten erhalten: ${bucket}/${path}`)
  }

  return Buffer.from(await data.arrayBuffer())
}

function uploadToCloudinary(buffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        if (!result?.secure_url) {
          reject(new Error('Cloudinary hat keine Bild-URL zurückgegeben.'))
          return
        }

        resolve(result)
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}

async function migratePageMedia() {
  const rows = await sql`
    SELECT id, storage_path, public_url
    FROM page_media
    WHERE public_url LIKE '%supabase.co%'
  `

  for (const row of rows) {
    await migrateImage({
      table: 'page_media',
      id: row.id,
      bucket: 'page-media',
      path: row.storage_path,
      folder: 'mysan/page-media',
      update: async (url) => {
        await sql`
          UPDATE page_media
          SET public_url = ${url}, updated_at = NOW()
          WHERE id = ${row.id}
        `
      },
    })
  }
}

async function migrateReferenceImages() {
  const rows = await sql`
    SELECT id, image_url
    FROM reference_images
    WHERE image_url LIKE '%supabase.co%'
  `

  for (const row of rows) {
    const { bucket, path } = getBucketAndPath(row.image_url)

    await migrateImage({
      table: 'reference_images',
      id: row.id,
      bucket,
      path,
      folder: 'mysan/reference-images',
      update: async (url) => {
        await sql`
          UPDATE reference_images
          SET image_url = ${url}
          WHERE id = ${row.id}
        `
      },
    })
  }
}

async function migrateNewsImages() {
  const rows = await sql`
    SELECT id, image_url
    FROM news
    WHERE image_url LIKE '%supabase.co%'
  `

  for (const row of rows) {
    const { bucket, path } = getBucketAndPath(row.image_url)

    await migrateImage({
      table: 'news',
      id: row.id,
      bucket,
      path,
      folder: 'mysan/news',
      update: async (url) => {
        await sql`
          UPDATE news
          SET image_url = ${url}, updated_at = NOW()
          WHERE id = ${row.id}
        `
      },
    })
  }
}

let successful = 0
let failed = 0

async function migrateImage({
  table,
  id,
  bucket,
  path,
  folder,
  update,
}) {
  try {
    console.log(`\n[${table}] ${id}`)
    console.log(`Quelle: ${bucket}/${path}`)

    const buffer = await downloadImage(bucket, path)

    console.log(`Download OK: ${buffer.length} Bytes`)

    if (!APPLY) {
      console.log('TESTLAUF: Keine Übertragung und keine Datenbankänderung.')
      successful++
      return
    }

    const result = await uploadToCloudinary(
      buffer,
      folder,
      id
    )

    await update(result.secure_url)

    console.log(`Cloudinary: ${result.secure_url}`)
    console.log('Neon aktualisiert.')
    successful++
  } catch (error) {
    failed++
    console.error(`FEHLER bei ${table}/${id}:`, error.message)
  }
}

async function main() {
  console.log('====================================')
  console.log('mySan Bildmigration zu Cloudinary')
  console.log('====================================')

  if (APPLY) {
    console.log('MODUS: ECHTE MIGRATION')
  } else {
    console.log('MODUS: TESTLAUF (keine Änderungen)')
  }

  await migratePageMedia()
  await migrateReferenceImages()
  await migrateNewsImages()

  console.log('\n====================================')
  console.log('ERGEBNIS')
  console.log('====================================')
  console.log(`Erfolgreich: ${successful}`)
  console.log(`Fehler:      ${failed}`)

  if (!APPLY) {
    console.log('\nDies war nur ein Testlauf.')
    console.log('Für die echte Migration später --apply verwenden.')
  }

  if (failed > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('\nMigration abgebrochen:', error)
  process.exitCode = 1
})
