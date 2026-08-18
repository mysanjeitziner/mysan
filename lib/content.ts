import { getSiteContent } from './site-content'

export async function getContent(
  page: string
) {
  const items = await getSiteContent(page)

  const content: Record<string, string> = {}

  for (const item of items) {
    content[
      `${item.section}.${item.content_key}`
    ] = item.content
  }

  return content
}