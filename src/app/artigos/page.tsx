import type { Metadata } from 'next'
import Link from 'next/link'
import { getArtigosPublicados, getAreas } from '@/lib/db'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Artigos',
  description: 'Artigos e reflexões bíblicas para a família cristã.',
}

type Props = { searchParams: Promise<{ area?: string }> }

export default async function ArtigosPage({ searchParams }: Props) {
  const { area } = await searchParams
  const [artigos, areas] = await Promise.all([
    getArtigosPublicados({ areaSlug: area, limit: 24 }),
    getAreas(),
  ])

  return (
    <main style={{ maxWidth: 'var(--max-w-wide)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Artigos</h1>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/artigos" style={filterBtn(!area)}>Todos</Link>
          {areas.map(a => (
            <Link key={a.id} href={`/artigos?area=${a.slug}`} style={filterBtn(area === a.slug)}>
              {a.nome}
            </Link>
          ))}
        </div>
      </header>

      {artigos.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Nenhum artigo publicado ainda.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {artigos.map((a: Record<string, unknown>) => {
            const areaObj = a.area as Record<string, string> | null
            const date = a.publicado_em
              ? new Date(a.publicado_em as string).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
              : null
            return (
              <Link key={a.id as string} href={`/artigos/${a.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.1rem 1.25rem', height: '100%' }}>
                  {areaObj && (
                    <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.4rem' }}>
                      {areaObj.nome}
                    </p>
                  )}
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.35, marginBottom: '0.4rem' }}>
                    {a.titulo as string}
                  </p>
                  {!!a.resumo && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>
                      {(a.resumo as string).slice(0, 100)}…
                    </p>
                  )}
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.6rem' }}>
                    {date}{a.tempo_leitura ? ` · ${a.tempo_leitura} min` : ''}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}

function filterBtn(active: boolean): React.CSSProperties {
  return {
    padding: '0.3rem 0.85rem', borderRadius: 20, fontSize: '0.78rem',
    fontWeight: active ? 700 : 500, fontFamily: 'system-ui, sans-serif',
    textDecoration: 'none', border: '1px solid var(--border)',
    background: active ? 'var(--brand)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--text-2)',
  }
}
