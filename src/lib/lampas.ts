const BASE  = process.env.LAMPAS_API_BASE_URL ?? 'https://lampas.com.br'
const CH    = process.env.LAMPAS_CHANNEL_SLUG ?? 'primeira-escola'
const API   = `${BASE}/api/pub/channels/${CH}`

export type FeedItem = {
  id: string
  content_type: string
  content_id: string
  published_at: string
  featured: boolean
  title_override: string | null
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  content: Record<string, unknown> | null
}

export type FeedResponse = {
  channel: { slug: string; name: string; domain: string | null }
  items: FeedItem[]
  total: number
  page: number
  has_next: boolean
}

export type SitemapEntry = {
  slug: string
  content_type: string
  content_id: string
  updated_at: string
}

export async function getFeed(opts: {
  limit?: number
  page?: number
  contentType?: string
  featuredOnly?: boolean
  revalidate?: number
} = {}): Promise<FeedResponse> {
  const q = new URLSearchParams()
  if (opts.limit)       q.set('limit', String(opts.limit))
  if (opts.page)        q.set('page', String(opts.page))
  if (opts.contentType) q.set('content_type', opts.contentType)
  if (opts.featuredOnly) q.set('featured_only', 'true')

  const res = await fetch(`${API}/feed?${q}`, {
    next: { revalidate: opts.revalidate ?? 300 },
  })
  if (!res.ok) return { channel: { slug: CH, name: 'Primeira Escola', domain: null }, items: [], total: 0, page: 1, has_next: false }
  return res.json()
}

export async function getContent(type: string, id: string) {
  const res = await fetch(`${API}/content/${type}/${id}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const res = await fetch(`${API}/sitemap`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []
  return res.json()
}

// Resolve o slug de um FeedItem
export function resolveSlug(item: FeedItem): string {
  if (item.content_type === 'boletim') {
    return (item.content?.slug as string) ?? item.content_id
  }
  if (item.content_type === 'confessional_document') {
    return (item.content?.slug as string) ?? item.content_id
  }
  return item.content_id
}

// Resolve o título de um FeedItem
export function resolveTitle(item: FeedItem): string {
  return item.title_override
    ?? (item.content?.title as string)
    ?? '(sem título)'
}

// Resolve o resumo de um FeedItem
export function resolveSummary(item: FeedItem): string {
  return (item.content?.seo_description as string)
    ?? (item.seo_description as string)
    ?? (item.content?.summary as string)
    ?? ''
}

// Mapeia content_type para segmento de URL
export function typeToSegment(type: string): string {
  const map: Record<string, string> = {
    boletim:               'artigos',
    confessional_document: 'catecismos',
    knowledge_item:        'estudos',
  }
  return map[type] ?? 'conteudo'
}
