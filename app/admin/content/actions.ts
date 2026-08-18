'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'


const ALLOWED_PAGES = [
  'home',
  'team',
  'referenzen',
  'news',
] as const


type PageName =
  (typeof ALLOWED_PAGES)[number]


/*
=========================================================
ADMIN PRÜFEN
=========================================================
*/

async function requireAdmin() {

  const supabase = await createClient()

  const {
    data: {
      user,
    },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(
      'Nicht angemeldet.'
    )
  }

  const role =
    user.app_metadata?.role

  if (role !== 'admin') {
    throw new Error(
      'Keine Administratorrechte.'
    )
  }

  return supabase
}


/*
=========================================================
DATEI-EXTENSION
=========================================================
*/

function getExtension(
  file: File
) {

  const name =
    file.name.toLowerCase()

  const extension =
    name.split('.').pop()

  const allowed = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'avif',
  ]

  if (
    !extension ||
    !allowed.includes(extension)
  ) {
    throw new Error(
      'Nur JPG, PNG, WEBP oder AVIF sind erlaubt.'
    )
  }

  return extension
}


/*
=========================================================
UPLOAD / REPLACE HERO
=========================================================
*/

export async function saveHeroImage(
  formData: FormData
) {

  const supabase =
    await requireAdmin()

  const page =
    String(
      formData.get('page') || ''
    ) as PageName

  const file =
    formData.get('file')


  if (
    !ALLOWED_PAGES.includes(page)
  ) {
    throw new Error(
      'Ungültige Seite.'
    )
  }


  if (!(file instanceof File)) {
    throw new Error(
      'Keine Datei ausgewählt.'
    )
  }


  if (file.size === 0) {
    throw new Error(
      'Die Datei ist leer.'
    )
  }


  if (
    file.size >
    10 * 1024 * 1024
  ) {
    throw new Error(
      'Das Bild darf maximal 10 MB gross sein.'
    )
  }


  const extension =
    getExtension(file)


  /*
  ---------------------------------------------------------
  ALTES BILD AUS DB
  ---------------------------------------------------------
  */

  const {
    data: oldMedia,
  } = await supabase
    .from('page_media')
    .select(`
      id,
      storage_path
    `)
    .eq('page', page)
    .eq('media_type', 'hero')
    .maybeSingle()


  /*
  ---------------------------------------------------------
  NEUER PFAD
  ---------------------------------------------------------
  */

  const storagePath =
    `hero/${page}/${crypto.randomUUID()}.${extension}`


  /*
  ---------------------------------------------------------
  UPLOAD
  ---------------------------------------------------------
  */

  const {
    error: uploadError,
  } = await supabase.storage
    .from('page-media')
    .upload(
      storagePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType:
          file.type || undefined,
      }
    )


  if (uploadError) {

    console.error(
      uploadError
    )

    throw new Error(
      'Das Bild konnte nicht hochgeladen werden.'
    )
  }


  /*
  ---------------------------------------------------------
  PUBLIC URL
  ---------------------------------------------------------
  */

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from('page-media')
      .getPublicUrl(
        storagePath
      )


  const publicUrl =
    publicUrlData.publicUrl


  /*
  ---------------------------------------------------------
  DB SPEICHERN
  ---------------------------------------------------------
  */

  const {
    error: databaseError,
  } = await supabase
    .from('page_media')
    .upsert(
      {
        page,
        media_type: 'hero',
        storage_path:
          storagePath,
        public_url:
          publicUrl,
        alt_text:
          `${page} Hero`,
        visible: true,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: 'page',
      }
    )


  if (databaseError) {

    /*
    Falls DB-Update fehlschlägt,
    neues Bild wieder löschen.
    */

    await supabase.storage
      .from('page-media')
      .remove([
        storagePath,
      ])

    console.error(
      databaseError
    )

    throw new Error(
      'Das Bild konnte nicht in der Datenbank gespeichert werden.'
    )
  }


  /*
  ---------------------------------------------------------
  ALTES STORAGE-BILD LÖSCHEN
  ---------------------------------------------------------
  */

  if (
    oldMedia?.storage_path &&
    oldMedia.storage_path !== storagePath
  ) {

    await supabase.storage
      .from('page-media')
      .remove([
        oldMedia.storage_path,
      ])
  }


  /*
  ---------------------------------------------------------
  CACHE AKTUALISIEREN
  ---------------------------------------------------------
  */

  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  revalidatePath(
    '/admin/content'
  )

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

export async function deleteHeroImage(
  formData: FormData
) {

  const supabase =
    await requireAdmin()

  const page =
    String(
      formData.get('page') || ''
    ) as PageName


  if (
    !ALLOWED_PAGES.includes(page)
  ) {
    throw new Error(
      'Ungültige Seite.'
    )
  }


  const {
    data: media,
  } = await supabase
    .from('page_media')
    .select(`
      id,
      storage_path
    `)
    .eq('page', page)
    .eq('media_type', 'hero')
    .maybeSingle()


  if (!media) {
    return {
      success: true,
    }
  }


  /*
  Storage löschen
  */

  if (media.storage_path) {

    await supabase.storage
      .from('page-media')
      .remove([
        media.storage_path,
      ])
  }


  /*
  DB löschen
  */

  const {
    error,
  } = await supabase
    .from('page_media')
    .delete()
    .eq('id', media.id)


  if (error) {
    throw new Error(
      'Das Hero-Bild konnte nicht gelöscht werden.'
    )
  }


  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  revalidatePath(
    '/admin/content'
  )

  return {
    success: true,
  }
}


/*
=========================================================
HERO EIN-/AUSBLENDEN
=========================================================
*/

export async function updateHeroSettings(
  formData: FormData
) {

  const supabase =
    await requireAdmin()

  const page =
    String(
      formData.get('page') || ''
    )

  const opacity =
    Number(
      formData.get('opacity')
    )

  const visible =
    formData.get('visible') === 'true'


  if (
    !ALLOWED_PAGES.includes(
      page as PageName
    )
  ) {
    throw new Error(
      'Ungültige Seite.'
    )
  }


  if (
    Number.isNaN(opacity) ||
    opacity < 0 ||
    opacity > 1
  ) {
    throw new Error(
      'Ungültige Bildtransparenz.'
    )
  }


  const {
    error,
  } = await supabase
    .from('page_media')
    .update({
      opacity,
      visible,
    })
    .eq('page', page)
    .eq('media_type', 'hero')


  if (error) {

    console.error(
      error
    )

    throw new Error(
      'Die Einstellungen konnten nicht gespeichert werden.'
    )
  }


  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  revalidatePath(
    '/admin/content'
  )

  return {
    success: true,
  }
}