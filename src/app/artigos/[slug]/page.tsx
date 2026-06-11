import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import { getArtigoBySlug, getArtigosSlugs } from '@/lib/db'

export const dynamicParams = true
export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    const slugs = await getArtigosSlugs()
    return slugs.map(slug => ({ slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artigo = await getArtigoBySlug(slug)
  if (!artigo) return { title: 'Artigo não encontrado' }
  return {
    title: artigo.seo_titulo ?? artigo.titulo,
    description: artigo.seo_descricao ?? artigo.resumo ?? undefined,
    openGraph: { title: artigo.titulo, images: artigo.og_image_url ? [artigo.og_image_url] : [] },
  }
}

export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params
  const artigo = await getArtigoBySlug(slug)
  if (!artigo) notFound()

  const area = artigo.area as Record<string, string> | null
  const bodyHtml = artigo.conteudo ? await marked(artigo.conteudo) : ''
  const date = artigo.publicado_em
    ? new Date(artigo.publicado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <main style={{ maxWidth: 'var(--max-w)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <article>
        <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          {area && (
            <Link href={`/artigos?area=${area.slug}`} style={{
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent)',
              fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
              display: 'inline-block', marginBottom: '0.75rem',
            }}>
              {area.nome}
            </Link>
          )}
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.6rem' }}>
            {artigo.titulo}
          </h1>
          {artigo.subtitulo && (
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {artigo.subtitulo}
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
            {artigo.autor}{date ? ` · ${date}` : ''}{artigo.tempo_leitura ? ` · ${artigo.tempo_leitura} min` : ''}
          </p>
        </header>

        {artigo.passagens_biblicas?.length > 0 && (
          <div style={{
            background: 'var(--brand-surface)', border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent)', borderRadius: '0 8px 8px 0',
            padding: '0.75rem 1.25rem', marginBottom: '2rem',
          }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.25rem' }}>
              Base bíblica
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>
              {artigo.passagens_biblicas.join(' · ')}
            </p>
          </div>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

        {artigo.tags?.length > 0 && (
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {artigo.tags.map((t: string) => (
              <span key={t} style={{
                background: 'var(--border-subtle)', color: 'var(--text-muted)',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', padding: '0.2rem 0.6rem',
                borderRadius: 4, fontFamily: 'system-ui, sans-serif',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </article>

      <div style={{ marginTop: '2.5rem' }}>
        <Link href="/artigos" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
          ← Todos os artigos
        </Link>
      </div>
    </main>
  )
}
