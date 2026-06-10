import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFeed, getContent, resolveSlug, resolveTitle, resolveSummary } from '@/lib/lampas'
import { marked } from 'marked'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { items } = await getFeed({ contentType: 'boletim', limit: 50 })
    return items.map(item => ({ slug: resolveSlug(item) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { items } = await getFeed({ contentType: 'boletim', limit: 50 })
  const item = items.find(i => resolveSlug(i) === slug)
  if (!item) return { title: 'Artigo não encontrado' }

  const title   = item.title_override ?? resolveTitle(item)
  const description = item.seo_description ?? resolveSummary(item)
  const image   = item.og_image_url ?? (item.content?.og_image_url as string) ?? undefined

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title,
      description: description.slice(0, 160),
      images: image ? [image] : [],
      url: item.canonical_url ?? undefined,
    },
    alternates: item.canonical_url ? { canonical: item.canonical_url } : undefined,
  }
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params

  // Busca no feed para encontrar content_id pelo slug
  const { items } = await getFeed({ contentType: 'boletim', limit: 50 })
  const feedItem = items.find(i => resolveSlug(i) === slug)
  if (!feedItem) notFound()

  // Busca conteúdo completo com metadados de publicação
  const data = await getContent('boletim', feedItem.content_id)
  if (!data) notFound()

  const { content, publication } = data
  const title    = publication.title_override ?? content.title ?? ''
  const bodyMd   = (content.content as string) ?? ''
  const bodyHtml = await marked(bodyMd)

  const date = publication.published_at
    ? new Date(publication.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const tags: string[] = (content.tags as string[]) ?? []

  return (
    <main style={{ maxWidth: 'var(--max-w)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <article>
        <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {tags.map(t => (
                <span key={t} style={{
                  background: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 4,
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>
            {title}
          </h1>

          {date && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
              {date}
            </p>
          )}
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    </main>
  )
}
