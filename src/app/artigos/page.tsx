import type { Metadata } from 'next'
import { getFeed } from '@/lib/lampas'
import ArticleCard from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Artigos',
  description: 'Artigos e reflexões bíblicas para a família cristã.',
}

export default async function ArtigosPage() {
  const { items, total, has_next } = await getFeed({ contentType: 'boletim', limit: 20 }).catch(() => ({ items: [], total: 0, has_next: false, page: 1, channel: null }))

  return (
    <main style={{ maxWidth: 'var(--max-w-wide)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>Artigos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
          {total} {total === 1 ? 'publicação' : 'publicações'}
        </p>
      </header>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Nenhum artigo publicado ainda.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {items.map(item => <ArticleCard key={item.id} item={item} />)}
        </div>
      )}

      {has_next && (
        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
          Carregue mais artigos via paginação (implementar conforme necessário).
        </p>
      )}
    </main>
  )
}
