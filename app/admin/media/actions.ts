'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET = 'site-media'

const ALLOWED_PAGES = [
  'home',
  'team',
  'referenzen',
  'news',
] as const

type Page = (typeof ALLOWED_PAGES)[number]

function isValidPage(
  page: string
): page is Page {
  return ALLOWED_PAGES.includes(
    page as Page
  )
}

/*
=========================================================
UPLOAD / REPLACE
=========================================================
*/

export async function uploadPageMedia(
  formData: FormData
) {
  const supabase = await createClient()

  const pageValue =
    formData.get('page')

  const file =
    formData.get('file')

  const altText =
    String(
      formData.get('alt_text') || ''
    ).trim()

  const opacityValue =
    Number(
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

  if (!(file instanceof File)) {
    return {
      success: false,
      error: 'Kein Bild ausgewählt.',
    }
  }

  if (file.size === 0) {
    return {
      success: false,
      error: 'Die Datei ist leer.',
    }
  }

  /*
  ---------------------------------------------------------
  DATEITYP PRÜFEN
  ---------------------------------------------------------
  */

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error:
        'Nur JPG, PNG, WebP oder AVIF sind erlaubt.',
    }
  }

  /*
  ---------------------------------------------------------
  DATEIGRÖSSE
  ---------------------------------------------------------
  */

  const maxSize =
    10 * 1024 * 1024

  if (file.size > maxSize) {
    return {
      success: false,
      error:
        'Das Bild darf maximal 10 MB gross sein.',
    }
  }

  /*
  ---------------------------------------------------------
  OPACITY
  ---------------------------------------------------------
  */

  const opacity = Math.min(
    1,
    Math.max(
      0,
      Number.isFinite(opacityValue)
        ? opacityValue
        : 0.18
    )
  )

  /*
  ---------------------------------------------------------
  ALTE DATEI AUS DB HOLEN
  ---------------------------------------------------------
  */

  const {
    data: oldMedia,
    error: oldMediaError,
  } = await supabase
    .from('page_media')
    .select(`
      id,
      storage_path,
      public_url
    `)
    .eq('page', pageValue)
    .eq('media_type', 'hero')
    .maybeSingle()

  if (oldMediaError) {
    console.error(
      oldMediaError
    )

    return {
      success: false,
      error:
        'Das bestehende Bild konnte nicht geladen werden.',
    }
  }

  /*
  ---------------------------------------------------------
  DATEINAME ERSTELLEN
  ---------------------------------------------------------
  */

  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() || 'jpg'

  const safeExtension =
    ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(
      extension
    )
      ? extension
      : 'jpg'

  const fileName =
    `${pageValue}-${Date.now()}.${safeExtension}`

  const storagePath =
    `hero/${fileName}`

  /*
  ---------------------------------------------------------
  FILE BUFFER
  ---------------------------------------------------------
  */

  const arrayBuffer =
    await file.arrayBuffer()

  const buffer =
    Buffer.from(arrayBuffer)

  /*
  ---------------------------------------------------------
  UPLOAD
  ---------------------------------------------------------
  */

  const {
    error: uploadError,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      storagePath,
      buffer,
      {
        contentType: file.type,
        upsert: false,
      }
    )

  if (uploadError) {
    console.error(
      uploadError
    )

    return {
      success: false,
      error:
        'Das Bild konnte nicht hochgeladen werden.',
    }
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
      .from(BUCKET)
      .getPublicUrl(
        storagePath
      )

  const publicUrl =
    publicUrlData.publicUrl

  /*
  ---------------------------------------------------------
  PAGE_MEDIA AKTUALISIEREN
  ---------------------------------------------------------
  */

  const {
    error: dbError,
  } = await supabase
    .from('page_media')
    .upsert(
      {
        page: pageValue,
        media_type: 'hero',
        storage_path:
          storagePath,
        public_url:
          publicUrl,
        alt_text:
          altText || null,
        opacity,
        visible: true,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: 'page',
      }
    )

  /*
  ---------------------------------------------------------
  FALLS DB UPDATE FEHLER:
  NEUE DATEI WIEDER LÖSCHEN
  ---------------------------------------------------------
  */

  if (dbError) {
    console.error(
      dbError
    )

    await supabase.storage
      .from(BUCKET)
      .remove([
        storagePath,
      ])

    return {
      success: false,
      error:
        'Das Bild wurde hochgeladen, konnte aber nicht in page_media gespeichert werden.',
    }
  }

  /*
  ---------------------------------------------------------
  ALTE DATEI LÖSCHEN
  ---------------------------------------------------------
  */

  if (
    oldMedia?.storage_path &&
    oldMedia.storage_path !== storagePath
  ) {
    const {
      error:
        deleteOldError,
    } =
      await supabase.storage
        .from(BUCKET)
        .remove([
          oldMedia.storage_path,
        ])

    if (deleteOldError) {
      console.warn(
        'Altes Bild konnte nicht gelöscht werden:',
        deleteOldError
      )
    }
  }

  /*
  ---------------------------------------------------------
  CACHE LEEREN
  ---------------------------------------------------------
  */

  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  revalidatePath(
    `/admin`
  )

  return {
    success: true,
    url: publicUrl,
  }
}

/*
=========================================================
TRANSPARENZ SPEICHERN
=========================================================
*/

export async function updatePageMediaSettings(
  formData: FormData
) {
  const supabase = await createClient()

  const pageValue =
    formData.get('page')

  const altText =
    String(
      formData.get('alt_text') || ''
    ).trim()

  const opacityValue =
    Number(
      formData.get('opacity')
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

  const opacity =
    Math.min(
      1,
      Math.max(
        0,
        Number.isFinite(opacityValue)
          ? opacityValue
          : 0.18
      )
    )

  const {
    error,
  } = await supabase
    .from('page_media')
    .update({
      alt_text:
        altText || null,
      opacity,
      updated_at:
        new Date().toISOString(),
    })
    .eq('page', pageValue)
    .eq('media_type', 'hero')

  if (error) {
    console.error(
      error
    )

    return {
      success: false,
      error:
        'Die Einstellungen konnten nicht gespeichert werden.',
    }
  }

  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  return {
    success: true,
  }
}

/*
=========================================================
BILD LÖSCHEN
=========================================================
*/

export async function deletePageMedia(
  formData: FormData
) {
  const supabase = await createClient()

  const pageValue =
    formData.get('page')

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
  AKTUELLEN DATENSATZ HOLEN
  ---------------------------------------------------------
  */

  const {
    data: media,
    error: mediaError,
  } = await supabase
    .from('page_media')
    .select(`
      id,
      storage_path
    `)
    .eq('page', pageValue)
    .eq('media_type', 'hero')
    .maybeSingle()

  if (mediaError) {
    console.error(
      mediaError
    )

    return {
      success: false,
      error:
        'Das Bild konnte nicht geladen werden.',
    }
  }

  if (!media) {
    return {
      success: false,
      error:
        'Für diese Seite existiert kein Bild.',
    }
  }

  /*
  ---------------------------------------------------------
  STORAGE LÖSCHEN
  ---------------------------------------------------------
  */

  if (media.storage_path) {
    const {
      error:
        storageError,
    } =
      await supabase.storage
        .from(BUCKET)
        .remove([
          media.storage_path,
        ])

    if (storageError) {
      console.error(
        storageError
      )

      return {
        success: false,
        error:
          'Die Bilddatei konnte nicht aus dem Storage gelöscht werden.',
      }
    }
  }

  /*
  ---------------------------------------------------------
  DB DATENSATZ LÖSCHEN
  ---------------------------------------------------------
  */

  const {
    error: deleteError,
  } = await supabase
    .from('page_media')
    .delete()
    .eq('page', pageValue)
    .eq('media_type', 'hero')

  if (deleteError) {
    console.error(
      deleteError
    )

    return {
      success: false,
      error:
        'Der Media-Datensatz konnte nicht gelöscht werden.',
    }
  }

  /*
  ---------------------------------------------------------
  CACHE
  ---------------------------------------------------------
  */

  revalidatePath('/')
  revalidatePath('/team')
  revalidatePath('/referenzen')
  revalidatePath('/news')

  return {
    success: true,
  }
}