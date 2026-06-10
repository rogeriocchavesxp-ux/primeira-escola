import type { MetadataRoute } from 'next'
import { getSitemapEntries, typeToSegment } from '@/lib/lampas'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeiraescola.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let entries: Awaited<ReturnType<typeof getSitemapEntries>> = []
  try { entries = await getSitemapEntries() } catch { /* API offline durante o build */ }

  const pages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${SITE}/artigos`,    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/catecismos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const content: MetadataRoute.Sitemap = entries.map(entry => ({
    url:          `${SITE}/${typeToSegment(entry.content_type)}/${entry.slug}`,
    lastModified: new Date(entry.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...pages, ...content]
}
