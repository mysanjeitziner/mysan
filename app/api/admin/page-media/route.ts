import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'page-media'

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


/* =========================================================
   HILFSFUNKTIONEN
========================================================= */

function getExtension(
  fileName: string,
  mimeType: string
): string {
  const originalExtension =
    fileName
      .split('.')
      .pop()
      ?.toLowerCase()

  if (
    originalExtension &&
    ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(
      originalExtension
    )
  ) {
    return originalExtension
  }

  switch (mimeType) {
    case 'image/png':
      return 'png'

    case 'image/webp':
      return 'webp'

    case 'image/avif':
      return 'avif'

    case 'image/jpeg':
    default:
      return 'jpg'
  }
}


/* =========================================================
   POST
   NEUES BILD HOCHLADEN / BILD ERSETZEN
========================================================= */

export async function POST(
  request: Request
) {
  let uploadedStoragePath: string | null = null

  try {
    const supabase =
      await createClient()

    /* =====================================================
       FORM DATA
    ===================================================== */

    const formData =
      await request.formData()

    const file =
      formData.get('file')

    const page =
      String(
        formData.get('page') || ''
      ).trim()

    const mediaType =
      String(
        formData.get('mediaType') || ''
      ).trim()

    const altText =
      String(
        formData.get('altText') || ''
      ).trim()

    const opacityValue =
      Number(
        formData.get('opacity') ?? 0.18
      )

    const visibleValue =
      String(
        formData.get('visible') ?? 'true'
      )

    /* =====================================================
       DATEI PRÜFEN
    ===================================================== */

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Keine Bilddatei erhalten.',
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       SEITE PRÜFEN
    ===================================================== */

    if (
      !ALLOWED_PAGES.includes(page)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Ungültige Seite: ${page}`,
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       MEDIA TYPE PRÜFEN
    ===================================================== */

    if (
      !ALLOWED_TYPES.includes(
        mediaType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Ungültiger Bildtyp: ${mediaType}`,
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       MIME TYPE PRÜFEN
    ===================================================== */

    if (
      !ALLOWED_MIME_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Nur JPG, PNG, WebP und AVIF sind erlaubt.',
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       DATEIGRÖSSE
    ===================================================== */

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Das Bild darf maximal 10 MB gross sein.',
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       TRANSPARENZ
    ===================================================== */

    const opacity =
      Number.isFinite(
        opacityValue
      )
        ? Math.max(
            0,
            Math.min(
              1,
              opacityValue
            )
          )
        : 0.18

    /* =====================================================
       SICHTBARKEIT
    ===================================================== */

    const visible =
      visibleValue !== 'false'

    /* =====================================================
       VORHANDENES BILD LADEN

       WICHTIG:
       page + media_type

       NICHT nur page!
    ===================================================== */

    const {
      data: existing,
      error: existingError,
    } =
      await supabase
        .from('page_media')
        .select(`
          id,
          page,
          media_type,
          storage_path,
          public_url,
          alt_text,
          opacity,
          visible
        `)
        .eq(
          'page',
          page
        )
        .eq(
          'media_type',
          mediaType
        )
        .maybeSingle()

    if (existingError) {
      console.error(
        'EXISTING MEDIA ERROR:',
        existingError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            existingError.message,
        },
        {
          status: 500,
        }
      )
    }

    /* =====================================================
       NEUEN DATEINAMEN ERSTELLEN
    ===================================================== */

    const extension =
      getExtension(
        file.name,
        file.type
      )

    const fileName =
      `${page}-${mediaType}-${crypto.randomUUID()}.${extension}`

    const storagePath =
      `${page}/${fileName}`

    /* =====================================================
       DATEI IN BUFFER
    ===================================================== */

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      )

    /* =====================================================
       STORAGE UPLOAD
    ===================================================== */

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          storagePath,
          buffer,
          {
            contentType:
              file.type,
            upsert: false,
            cacheControl:
              '3600',
          }
        )

    if (uploadError) {
      console.error(
        'STORAGE UPLOAD ERROR:',
        uploadError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            `Upload fehlgeschlagen: ${uploadError.message}`,
        },
        {
          status: 500,
        }
      )
    }

    uploadedStoragePath =
      storagePath

    /* =====================================================
       PUBLIC URL
    ===================================================== */

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

    if (!publicUrl) {
      await supabase.storage
        .from(BUCKET)
        .remove([
          storagePath,
        ])

      return NextResponse.json(
        {
          success: false,
          error:
            'Die öffentliche URL für das Bild konnte nicht erstellt werden.',
        },
        {
          status: 500,
        }
      )
    }

    /* =====================================================
       DATEN FÜR DATABASE
    ===================================================== */

    const mediaData = {
      page,
      media_type:
        mediaType,
      storage_path:
        storagePath,
      public_url:
        publicUrl,
      alt_text:
        altText || null,
      opacity,
      visible,
      updated_at:
        new Date().toISOString(),
    }

    /* =====================================================
       DATABASE UPSERT

       DEINE TABELLE HAT:
       UNIQUE (page, media_type)

       Deshalb:
       onConflict = page,media_type
    ===================================================== */

    const {
      data: media,
      error: databaseError,
    } =
      await supabase
        .from('page_media')
        .upsert(
          mediaData,
          {
            onConflict:
              'page,media_type',
          }
        )
        .select()
        .single()

    /* =====================================================
       DATABASE FEHLER
    ===================================================== */

    if (databaseError) {
      console.error(
        'DATABASE UPSERT ERROR:',
        databaseError
      )

      /* Neu hochgeladenes Bild wieder löschen */

      await supabase.storage
        .from(BUCKET)
        .remove([
          storagePath,
        ])

      uploadedStoragePath =
        null

      return NextResponse.json(
        {
          success: false,
          error:
            `Bild wurde hochgeladen, konnte aber nicht in der Datenbank gespeichert werden: ${databaseError.message}`,
        },
        {
          status: 500,
        }
      )
    }

    /* =====================================================
       ALTES BILD LÖSCHEN

       Erst nachdem das neue Bild erfolgreich
       in der DB gespeichert wurde.
    ===================================================== */

    if (
      existing?.storage_path &&
      existing.storage_path !==
        storagePath
    ) {
      const {
        error:
          oldStorageError,
      } =
        await supabase.storage
          .from(BUCKET)
          .remove([
            existing.storage_path,
          ])

      if (oldStorageError) {
        console.warn(
          'ALTES STORAGE-BILD KONNTE NICHT GELÖSCHT WERDEN:',
          oldStorageError
        )

        /*
         * Kein Upload-Fehler mehr.
         *
         * Das neue Bild ist bereits korrekt
         * gespeichert.
         */
      }
    }

    /* =====================================================
       ERFOLG
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        media,
      },
      {
        status: 200,
      }
    )

  } catch (error) {

    console.error(
      'PAGE MEDIA POST ERROR:',
      error
    )

    /* =====================================================
       FALLS STORAGE UPLOAD ERFOLGREICH WAR,
       ABER SPÄTER EIN FEHLER AUFTRITT
    ===================================================== */

    if (
      uploadedStoragePath
    ) {
      try {
        const supabase =
          await createClient()

        await supabase.storage
          .from(BUCKET)
          .remove([
            uploadedStoragePath,
          ])
      } catch (
        cleanupError
      ) {
        console.error(
          'CLEANUP ERROR:',
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
      {
        status: 500,
      }
    )
  }
}


/* =========================================================
   PATCH
   ALT-TEXT / TRANSPARENZ / SICHTBARKEIT
========================================================= */

export async function PATCH(
  request: Request
) {
  try {
    const supabase =
      await createClient()

    const body =
      await request.json()

    const id =
      String(
        body?.id || ''
      ).trim()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Keine Medien-ID angegeben.',
        },
        {
          status: 400,
        }
      )
    }

    const opacityValue =
      Number(
        body?.opacity ?? 0.18
      )

    const opacity =
      Number.isFinite(
        opacityValue
      )
        ? Math.max(
            0,
            Math.min(
              1,
              opacityValue
            )
          )
        : 0.18

    const visible =
      body?.visible !== false

    const altText =
      body?.alt_text === null ||
      body?.alt_text === undefined
        ? null
        : String(
            body.alt_text
          ).trim() || null

    /* =====================================================
       UPDATE
    ===================================================== */

    const {
      data: media,
      error,
    } =
      await supabase
        .from('page_media')
        .update({
          alt_text:
            altText,
          opacity,
          visible,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          id
        )
        .select()
        .single()

    if (error) {
      console.error(
        'PAGE MEDIA PATCH DATABASE ERROR:',
        error
      )

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        media,
      },
      {
        status: 200,
      }
    )

  } catch (error) {

    console.error(
      'PAGE MEDIA PATCH ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Speichern fehlgeschlagen.',
      },
      {
        status: 500,
      }
    )
  }
}


/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  request: Request
) {
  try {
    const supabase =
      await createClient()

    /* =====================================================
       ID AUS URL ODER BODY LESEN

       Dein PageMediaEditor verwendet aktuell:

       /api/admin/page-media?id=...

       Deshalb lesen wir zuerst die URL.
       Zusätzlich unterstützen wir JSON.
    ===================================================== */

    const url =
      new URL(
        request.url
      )

    let id =
      url.searchParams.get(
        'id'
      )

    /* =====================================================
       FALLBACK BODY
    ===================================================== */

    if (!id) {
      try {
        const body =
          await request.json()

        id =
          body?.id
            ? String(
                body.id
              )
            : null
      } catch {
        /* Kein JSON-Body vorhanden */
      }
    }

    id =
      id?.trim() || ''

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Keine Medien-ID angegeben.',
        },
        {
          status: 400,
        }
      )
    }

    /* =====================================================
       MEDIA LADEN
    ===================================================== */

    const {
      data: media,
      error: findError,
    } =
      await supabase
        .from('page_media')
        .select(`
          id,
          page,
          media_type,
          storage_path
        `)
        .eq(
          'id',
          id
        )
        .single()

    if (findError) {
      console.error(
        'PAGE MEDIA FIND ERROR:',
        findError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            findError.message,
        },
        {
          status: 404,
        }
      )
    }

    /* =====================================================
       STORAGE LÖSCHEN
    ===================================================== */

    if (
      media.storage_path
    ) {
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
          'PAGE MEDIA STORAGE DELETE ERROR:',
          storageError
        )

        return NextResponse.json(
          {
            success: false,
            error:
              `Das Bild konnte nicht aus dem Storage gelöscht werden: ${storageError.message}`,
          },
          {
            status: 500,
          }
        )
      }
    }

    /* =====================================================
       DATABASE LÖSCHEN
    ===================================================== */

    const {
      error: deleteError,
    } =
      await supabase
        .from('page_media')
        .delete()
        .eq(
          'id',
          id
        )

    if (deleteError) {
      console.error(
        'PAGE MEDIA DATABASE DELETE ERROR:',
        deleteError
      )

      return NextResponse.json(
        {
          success: false,
          error:
            deleteError.message,
        },
        {
          status: 500,
        }
      )
    }

    /* =====================================================
       ERFOLG
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    )

  } catch (error) {

    console.error(
      'PAGE MEDIA DELETE ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Löschen fehlgeschlagen.',
      },
      {
        status: 500,
      }
    )
  }
}