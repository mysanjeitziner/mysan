import { createClient } from '@/lib/supabase/server'

export const SITE_MEDIA_BUCKET = 'site-media'

export const SITE_PAGES = [
  'home',
  'team',
  'referenzen',
  'news',
] as const

export type SitePage = (typeof SITE_PAGES)[number]

export type SiteContent = {
  id: string
  page: string
  section: string
  content_key: string
  content: string
  visible: boolean
  sort_order: number
}

export type PageMedia = {
  id: string
  page: SitePage
  media_type: string
  storage_path: string | null
  public_url: string | null
  alt_text: string | null
  opacity: number
  visible: boolean
  created_at: string
  updated_at: string
}

/*
=========================================================
WEBSITE-TEXTE
=========================================================
*/

export async function getSiteContent(
  page?: string
): Promise<SiteContent[]> {
  const supabase = await createClient()

  let query = supabase
    .from('site_content')
    .select(`
      id,
      page,
      section,
      content_key,
      content,
      visible,
      sort_order
    `)
    .order('sort_order', {
      ascending: true,
    })

  if (page) {
    query = query.eq('page', page)
  }

  const { data, error } = await query

  if (error) {
    console.error(
      'Fehler beim Laden der Website-Inhalte:',
      error
    )

    return []
  }

  return (data as SiteContent[]) || []
}

/*
=========================================================
EINZELNEN CONTENT HOLEN
=========================================================
*/

export function getContent(
  contents: SiteContent[],
  section: string,
  key: string,
  fallback = ''
): string {
  const item = contents.find(
    (content) =>
      content.section === section &&
      content.content_key === key
  )

  if (!item || !item.visible) {
    return fallback
  }

  return item.content.replace(/\\n/g, '\n')
}

/*
=========================================================
PAGE MEDIA
=========================================================
*/

export async function getPageMedia(
  page: SitePage,
  mediaType = 'hero'
): Promise<PageMedia | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('page_media')
    .select(`
      id,
      page,
      media_type,
      storage_path,
      public_url,
      alt_text,
      opacity,
      visible,
      created_at,
      updated_at
    `)
    .eq('page', page)
    .eq('media_type', mediaType)
    .maybeSingle()

  if (error) {
    console.error(
      `Fehler beim Laden von page_media (${page}):`,
      error
    )

    return null
  }

  return data as PageMedia | null
}

/*
=========================================================
STORAGE URL
=========================================================
*/

export function getStorageUrl(
  storagePath: string | null | undefined
): string | null {
  if (!storagePath) {
    return null
  }

  const path = storagePath.trim()

  if (!path) {
    return null
  }

  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path
  }

  if (path.startsWith('/')) {
    return path
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/${SITE_MEDIA_BUCKET}/${path}`
}

/*
=========================================================
MEDIA URL
=========================================================
*/

export function getMediaUrl(
  media: PageMedia | null
): string | null {
  if (!media || !media.visible) {
    return null
  }

  if (media.public_url) {
    return media.public_url
  }

  return getStorageUrl(
    media.storage_path
  )
}

/*
=========================================================
HERO
=========================================================
*/

export async function getHeroMedia(
  page: SitePage
): Promise<PageMedia | null> {
  return getPageMedia(
    page,
    'hero'
  )
}