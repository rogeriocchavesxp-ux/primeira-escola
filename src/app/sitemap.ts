import type { MetadataRoute } from 'next'
import { getArtigosSlugs, getTrilhasSlugs } from '@/lib/db'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.primeiraescola.com.br'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let artigoSlugs: string[] = []
  let trilhaSlugs: string[] = []

  try { artigoSlugs = await getArtigosSlugs() } catch {}
  try { trilhaSlugs = await getTrilhasSlugs() } catch {}

  const static_: MetadataRoute.Sitemap = [
    { url: SITE,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1   },
    { url: `${SITE}/trilhas`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/artigos`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE}/biblioteca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  const artigos: MetadataRoute.Sitemap = artigoSlugs.map(slug => ({
    url: `${SITE}/artigos/${slug}`, changeFrequency: 'weekly' as const, priority: 0.7,
  }))

  const trilhas: MetadataRoute.Sitemap = trilhaSlugs.map(slug => ({
    url: `${SITE}/trilhas/${slug}`, changeFrequency: 'weekly' as const, priority: 0.8,
  }))

  return [...static_, ...trilhas, ...artigos]
}
