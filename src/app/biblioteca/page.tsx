import type { Metadata } from 'next'
import Link from 'next/link'
import { getBibliotecaCategorias, getBibliotecaItens } from '@/lib/db'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Biblioteca',
  description: 'Catecismos, confissões, guias práticos e recursos para a família cristã.',
}

export default async function BibliotecaPage() {
  const [categorias, itens] = await Promise.all([
    getBibliotecaCategorias(),
    getBibliotecaItens(),
  ])

  const itensPorCategoria = categorias.map(cat => ({
    ...cat,
    itens: (itens as Array<Record<string, unknown>>).filter(i => {
      const c = i.categoria as Record<string, string> | null
      return c?.slug === cat.slug
    }),
  })).filter(cat => cat.itens.length > 0)

  return (
    <main style={{ maxWidth: 'var(--max-w-wide)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ maxWidth: 640, marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Biblioteca</h1>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
          Acervo permanente de recursos para a formação familiar. Catecismos históricos, confissões de fé, guias práticos e mais — todos gratuitos.
        </p>
      </header>

      {itensPorCategoria.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Recursos em breve.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {itensPorCategoria.map(cat => (
            <section key={cat.id}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif', marginBottom: '1rem' }}>
                {cat.nome}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {cat.itens.map(item => (
                  <Link key={item.id as string} href={`/biblioteca/${cat.slug}/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '1.1rem 1.25rem',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem',
                    }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                          {item.titulo as string}
                        </p>
                        {!!item.descricao && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                            {(item.descricao as string).slice(0, 80)}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          {!!item.arquivo_url && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
                              PDF ↓
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ color: 'var(--accent)', fontSize: '1rem', flexShrink: 0 }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
