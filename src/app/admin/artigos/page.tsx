import { listArtigosAdmin } from '../actions'

export default async function ArtigosAdminPage() {
  const artigos = await listArtigosAdmin()

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Artigos</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
            {artigos.length} {artigos.length === 1 ? 'artigo' : 'artigos'}
          </p>
        </div>
        <a href="/admin/artigos/novo" style={{
          background: 'var(--brand)', color: '#fff', padding: '0.6rem 1.25rem',
          borderRadius: 7, fontWeight: 700, fontSize: '0.875rem',
          fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
        }}>
          + Novo artigo
        </a>
      </div>

      {artigos.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Nenhum artigo ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {artigos.map((a: Record<string, unknown>) => {
            const area = a.area as Record<string, string> | null
            return (
              <a key={a.id as string} href={`/admin/artigos/${a.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '0.9rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.titulo as string}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'system-ui, sans-serif' }}>
                      {area?.nome ?? '—'} · /{a.slug as string}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.7rem',
                    fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'system-ui, sans-serif',
                    background: a.publicado ? '#e6f4ea' : '#f5f5f5',
                    color: a.publicado ? '#2d7a3a' : '#888',
                  }}>
                    {a.publicado ? 'Publicado' : 'Rascunho'}
                  </span>
                  {!!a.destaque && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: '#fff8e6', color: '#a07010', fontFamily: 'system-ui, sans-serif' }}>
                      Destaque
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
