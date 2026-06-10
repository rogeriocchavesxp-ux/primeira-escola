import type { Metadata } from 'next'
import { getFeed } from '@/lib/lampas'
import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Início',
  description: 'Recursos bíblicos e reformados para a família cristã.',
}

export default async function HomePage() {
  const empty = { items: [], total: 0, has_next: false, page: 1, channel: null }
  const [featured, recent] = await Promise.all([
    getFeed({ featuredOnly: true, limit: 3 }).catch(() => empty),
    getFeed({ limit: 9 }).catch(() => empty),
  ])

  const featuredIds = new Set(featured.items.map(i => i.id))
  const nonFeatured = recent.items.filter(i => !featuredIds.has(i.id)).slice(0, 9)

  const section: React.CSSProperties = {
    maxWidth: 'var(--max-w-wide)',
    margin: '0 auto',
    padding: '0 1.5rem',
  }

  const heading: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--brand)',
    fontFamily: 'system-ui, sans-serif',
    marginBottom: '1.25rem',
  }

  return (
    <main>
      {/* Hero */}
      <div style={{
        background: 'var(--brand)',
        color: '#fff',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.75rem' }}>
            Primeira Escola
          </h1>
          <p style={{ fontSize: '1.0625rem', opacity: 0.88, lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
            Recursos bíblicos e reformados para a família cristã — devocionais, catecismos, estudos e mais.
          </p>
        </div>
      </div>

      {/* Destaques */}
      {featured.items.length > 0 && (
        <section style={{ ...section, marginTop: '3rem' }}>
          <p style={heading}>Destaques</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {featured.items.map(item => (
              <ArticleCard key={item.id} item={item} featured />
            ))}
          </div>
        </section>
      )}

      {/* Recentes */}
      {nonFeatured.length > 0 && (
        <section style={{ ...section, marginTop: '3rem' }}>
          <p style={heading}>Publicações recentes</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {nonFeatured.map(item => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Estado vazio */}
      {featured.items.length === 0 && recent.items.length === 0 && (
        <section style={{ ...section, marginTop: '5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontFamily: 'system-ui, sans-serif' }}>
            Conteúdo em breve.
          </p>
        </section>
      )}
    </main>
  )
}
