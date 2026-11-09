
import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL fehlt.')
}

const url = new URL(databaseUrl)

console.log('Neon-Host:', url.hostname)
console.log('Datenbank:', url.pathname.slice(1))

const sql = neon(databaseUrl)

const connection = await sql`
  SELECT
    current_database() AS database,
    current_user AS db_user
`

console.log('Verbindung:', connection)

const tables = await sql`
  SELECT
    to_regclass('public.news') AS news,
    to_regclass('public.page_media') AS page_media,
    to_regclass('public.reference_images') AS reference_images,
    to_regclass('public.site_content') AS site_content,
    to_regclass('public.references') AS references,
    to_regclass('public.categories') AS categories
`

console.log('Tabellen:', tables)
