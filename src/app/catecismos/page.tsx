import type { Metadata } from 'next'
import Link from 'next/link'
import { getFeed, resolveSlug, resolveTitle } from '@/lib/lampas'

export const metadata: Metadata = {
  title: 'Catecismos',
  description: 'Catecismos reformados para o ensino da família cristã.',
}

export default async function CatecismosPage() {
  const { items } = await getFeed({ contentType: 'confessional_document', limit: 20 }).catch(() => ({ items: [], total: 0, has_next: false, page: 1, channel: null }))

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>Catecismos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
          Documentos confessionais reformados
        </p>
      </header>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Nenhum catecismo publicado ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => {
            const title = resolveTitle(item)
            const slug  = resolveSlug(item)
            const kind  = (item.content?.kind as string) ?? ''
            const questions = (item.content as Record<string, unknown>)
            return (
              <Link key={item.id} href={`/catecismos/${slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{title}</p>
                    {kind && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'capitalize', fontFamily: 'system-ui, sans-serif' }}>
                        {kind.replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                  <span style={{ color: 'var(--brand)', fontSize: '1.25rem' }}>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
