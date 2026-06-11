import type { Metadata } from 'next'
import Link from 'next/link'
import { getArtigosPublicados, getTrilhasPublicadas } from '@/lib/db'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Primeira Escola — Formação familiar cristã',
  description: 'Recursos bíblicos e reformados para a família cristã. Trilhas de formação, artigos, catecismos e guias.',
}

export default async function HomePage() {
  const [destaques, recentes, trilhas] = await Promise.all([
    getArtigosPublicados({ destaque: true, limit: 3 }),
    getArtigosPublicados({ limit: 6 }),
    getTrilhasPublicadas(),
  ])

  const destaquesIds = new Set(destaques.map(a => a.id))
  const naoDestaques = recentes.filter(a => !destaquesIds.has(a.id)).slice(0, 6)

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'var(--brand)', color: '#fff', padding: '4rem 1.5rem 3.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
            A família é a primeira escola instituída por Deus
          </h1>
          <p style={{ fontSize: '1.0625rem', opacity: 0.85, lineHeight: 1.7, fontFamily: 'system-ui, sans-serif', marginBottom: '1.75rem' }}>
            Encontre caminhos de formação bíblica para cada fase da sua família.
          </p>
          <Link href="/trilhas" style={{
            display: 'inline-block', background: 'var(--accent)', color: '#fff',
            padding: '0.75rem 2rem', borderRadius: 8, fontWeight: 700,
            fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', textDecoration: 'none',
          }}>
            Encontre sua trilha
          </Link>
        </div>
      </section>

      {/* Trilhas */}
      {trilhas.length > 0 && (
        <section style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <p style={sectionLabel}>Trilhas de formação</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {trilhas.slice(0, 6).map((t: Record<string, unknown>) => (
              <Link key={t.id as string} href={`/trilhas/${t.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.1rem 1.25rem', height: '100%' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--brand)' }}>
                    {t.titulo as string}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                    {t.para_quem as string}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {trilhas.length > 6 && (
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <Link href="/trilhas" style={{ color: 'var(--brand)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
                Ver todas as trilhas →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Destaques */}
      {destaques.length > 0 && (
        <section style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <p style={sectionLabel}>Destaques</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {destaques.map(a => <ArtigoCard key={a.id} artigo={a} featured />)}
          </div>
        </section>
      )}

      {/* Recentes */}
      {naoDestaques.length > 0 && (
        <section style={{ maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <p style={sectionLabel}>Publicações recentes</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {naoDestaques.map(a => <ArtigoCard key={a.id} artigo={a} />)}
          </div>
        </section>
      )}

      {destaques.length === 0 && naoDestaques.length === 0 && (
        <section style={{ maxWidth: 'var(--max-w-wide)', margin: '5rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Conteúdo em breve.</p>
        </section>
      )}
    </main>
  )
}

function ArtigoCard({ artigo, featured }: { artigo: Record<string, unknown>; featured?: boolean }) {
  const area = artigo.area as Record<string, string> | null
  const date = artigo.publicado_em
    ? new Date(artigo.publicado_em as string).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <Link href={`/artigos/${artigo.slug}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: featured ? '1.5rem' : '1.1rem 1.25rem',
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        {area && (
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.5rem' }}>
            {area.nome}
          </p>
        )}
        <p style={{ fontWeight: 700, fontSize: featured ? '1.05rem' : '0.9rem', lineHeight: 1.35, marginBottom: '0.5rem', color: 'var(--text)' }}>
          {artigo.titulo as string}
        </p>
        {!!artigo.resumo && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif', flex: 1 }}>
            {(artigo.resumo as string).slice(0, 120)}{(artigo.resumo as string).length > 120 ? '…' : ''}
          </p>
        )}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem' }}>
          {date}{artigo.tempo_leitura ? ` · ${artigo.tempo_leitura} min` : ''}
        </p>
      </div>
    </Link>
  )
}

const sectionLabel: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--brand)',
  fontFamily: 'system-ui, sans-serif', marginBottom: '1rem',
}
