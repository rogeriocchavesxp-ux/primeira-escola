import { createServiceClient } from '@/lib/supabase-server'
import { assertAdmin } from './actions'

export default async function AdminDashboard() {
  await assertAdmin()
  const db = createServiceClient()

  const [
    { count: totalArtigos },
    { count: publicados },
    { count: trilhas },
    { count: biblioteca },
  ] = await Promise.all([
    db.from('artigos').select('*', { count: 'exact', head: true }),
    db.from('artigos').select('*', { count: 'exact', head: true }).eq('publicado', true),
    db.from('trilhas').select('*', { count: 'exact', head: true }),
    db.from('biblioteca_itens').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Artigos',    value: totalArtigos ?? 0, sub: `${publicados ?? 0} publicados` },
    { label: 'Trilhas',    value: trilhas ?? 0,       sub: 'de formação' },
    { label: 'Biblioteca', value: biblioteca ?? 0,    sub: 'itens' },
  ]

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', marginBottom: '2rem' }}>
        Visão geral da plataforma
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--brand)', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.35rem' }}>{s.label}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'system-ui, sans-serif' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a href="/admin/artigos/novo" style={actionBtn}>+ Novo artigo</a>
        <a href="/admin/artigos"      style={actionBtnSecondary}>Ver artigos</a>
        <a href="/admin/trilhas"      style={actionBtnSecondary}>Gerenciar trilhas</a>
        <a href="/admin/biblioteca"   style={actionBtnSecondary}>Gerenciar biblioteca</a>
      </div>
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff', padding: '0.6rem 1.25rem',
  borderRadius: 7, fontWeight: 700, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}
const actionBtnSecondary: React.CSSProperties = {
  background: 'var(--surface)', color: 'var(--brand)', padding: '0.6rem 1.25rem',
  border: '1px solid var(--border)', borderRadius: 7, fontWeight: 600,
  fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}
