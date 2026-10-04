import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  getAuthenticatedUser,
  getMembros,
  getRegistrosRecentes,
  getProximosEventos,
  getCategoriaConfig,
  formatarData,
  diasAteProximo,
} from '@/lib/familia'

export const metadata: Metadata = { title: 'Log Familiar — Primeira Escola' }

export default async function FamiliaPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const [membros, recentes, proximos] = await Promise.all([
    getMembros(user.id),
    getRegistrosRecentes(user.id, 8),
    getProximosEventos(user.id),
  ])

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2 }}>Log Familiar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', marginTop: '0.25rem' }}>
            Histórico de consultas, veículo, escola e eventos da família
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/familia/membros" style={btnSecondary}>Membros</Link>
          <Link href="/familia/novo" style={btnPrimary}>+ Novo registro</Link>
        </div>
      </div>

      {/* Próximos eventos */}
      {proximos.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={sectionTitle}>Próximos eventos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {proximos.map(r => {
              const cat = getCategoriaConfig(r.categoria)
              const dias = diasAteProximo(r.data_proximo!)
              const urgente = dias <= 7
              return (
                <Link key={r.id} href={`/familia/registro/${r.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: urgente ? '#fef9ec' : 'var(--surface)',
                  border: `1px solid ${urgente ? '#f59e0b' : 'var(--border)'}`,
                  borderRadius: 10, padding: '0.85rem 1.1rem',
                  textDecoration: 'none', color: 'inherit',
                }}>
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{cat.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>{r.titulo}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.15rem' }}>
                      {r.membro?.emoji} {r.membro?.nome ?? 'Geral'} · {cat.label}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: urgente ? '#d97706' : 'var(--brand)', fontFamily: 'system-ui, sans-serif' }}>
                      {dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : `em ${dias} dias`}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
                      {formatarData(r.data_proximo!)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Membros */}
      {membros.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={sectionTitle}>Membros</h2>
            <Link href="/familia/membros" style={{ fontSize: '0.78rem', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif' }}>
              Gerenciar →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {membros.map(m => (
              <Link key={m.id} href={`/familia/membros/${m.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 999, padding: '0.4rem 0.85rem',
                textDecoration: 'none', color: 'inherit', fontSize: '0.875rem',
                fontFamily: 'system-ui, sans-serif', fontWeight: 500,
              }}>
                <span>{m.emoji}</span>
                <span>{m.nome}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Últimos registros */}
      <section>
        <h2 style={sectionTitle}>Histórico recente</h2>
        {recentes.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</p>
            <p style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Nenhum registro ainda</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', marginBottom: '1.5rem' }}>
              Registre consultas, revisões do carro, visitas e outros eventos da família.
            </p>
            <Link href="/familia/novo" style={btnPrimary}>+ Novo registro</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {recentes.map(r => {
              const cat = getCategoriaConfig(r.categoria)
              return (
                <Link key={r.id} href={`/familia/registro/${r.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '0.8rem 1.1rem',
                  textDecoration: 'none', color: 'inherit',
                }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{cat.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}>{r.titulo}</p>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.1rem' }}>
                      {r.membro?.emoji} {r.membro?.nome ?? 'Geral'} · {cat.label}
                      {r.profissional ? ` · ${r.profissional}` : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif' }}>
                      {formatarData(r.data_evento)}
                    </p>
                    <span style={{
                      display: 'inline-block', marginTop: '0.2rem',
                      fontSize: '0.7rem', fontFamily: 'system-ui, sans-serif',
                      padding: '0.1rem 0.5rem', borderRadius: 999,
                      background: r.status === 'agendado' ? '#dbeafe' : r.status === 'cancelado' ? '#fee2e2' : '#dcfce7',
                      color: r.status === 'agendado' ? '#1d4ed8' : r.status === 'cancelado' ? '#dc2626' : '#166534',
                      fontWeight: 600,
                    }}>
                      {r.status === 'realizado' ? 'Realizado' : r.status === 'agendado' ? 'Agendado' : 'Cancelado'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}

const sectionTitle: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--text-muted)',
  fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff',
  padding: '0.55rem 1.1rem', borderRadius: 7,
  fontWeight: 700, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--surface)', color: 'var(--brand)',
  border: '1px solid var(--border)',
  padding: '0.55rem 1.1rem', borderRadius: 7,
  fontWeight: 600, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}
