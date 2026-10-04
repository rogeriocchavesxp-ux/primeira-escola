import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getAuthenticatedUser, getMembroById, getRegistrosByMembro, getCategoriaConfig, formatarData } from '@/lib/familia'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Histórico · Log Familiar' }

export default async function MembroHistoricoPage({ params }: Props) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const [membro, registros] = await Promise.all([
    getMembroById(id, user.id),
    getRegistrosByMembro(id, user.id),
  ])

  if (!membro) notFound()

  const proximosRegistros = registros.filter(r => r.data_proximo && r.status !== 'cancelado')
    .sort((a, b) => (a.data_proximo! > b.data_proximo! ? 1 : -1))

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header do membro */}
      <div style={{ marginBottom: '1.75rem' }}>
        <Link href="/familia/membros" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
          ← Membros
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
          <div style={{
            width: 56, height: 56, background: 'var(--brand-surface)',
            border: '1px solid var(--border)', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', lineHeight: 1,
          }}>
            {membro.emoji}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2 }}>{membro.nome}</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
              {membro.tipo}
              {membro.relacao ? ` · ${membro.relacao}` : ''}
              {membro.nascimento ? ` · Nasc. ${formatarData(membro.nascimento)}` : ''}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link href={`/familia/membros/${membro.id}/editar`} style={btnSecondary}>Editar</Link>
          </div>
        </div>
        {membro.notas && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem', fontStyle: 'italic' }}>
            {membro.notas}
          </p>
        )}
      </div>

      {/* Próximos agendamentos deste membro */}
      {proximosRegistros.length > 0 && (
        <div style={{ background: '#fef9ec', border: '1px solid #f59e0b', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b45309', fontFamily: 'system-ui, sans-serif', marginBottom: '0.6rem' }}>
            Próximos eventos
          </p>
          {proximosRegistros.slice(0, 3).map(r => (
            <Link key={r.id} href={`/familia/registro/${r.id}`} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              textDecoration: 'none', color: 'inherit',
              padding: '0.3rem 0', borderBottom: '1px solid #fde68a',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{r.titulo}</span>
              <span style={{ fontSize: '0.8rem', color: '#b45309', fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>
                {formatarData(r.data_proximo!)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Ação rápida */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={sectionTitle}>Histórico ({registros.length})</h2>
        <Link href={`/familia/novo`} style={btnPrimary}>+ Novo registro</Link>
      </div>

      {registros.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
            Nenhum registro para {membro.nome} ainda.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {registros.map(r => {
            const cat = getCategoriaConfig(r.categoria)
            return (
              <Link key={r.id} href={`/familia/registro/${r.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 9, padding: '0.75rem 1rem',
                textDecoration: 'none', color: 'inherit',
              }}>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{cat.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.titulo}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.1rem' }}>
                    {cat.label}{r.profissional ? ` · ${r.profissional}` : ''}{r.local ? ` · ${r.local}` : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif' }}>
                    {formatarData(r.data_evento)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

const sectionTitle: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--text-muted)',
  fontFamily: 'system-ui, sans-serif',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff',
  padding: '0.45rem 0.9rem', borderRadius: 7,
  fontWeight: 700, fontSize: '0.8rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--surface)', color: 'var(--text-2)',
  border: '1px solid var(--border)',
  padding: '0.4rem 0.85rem', borderRadius: 7,
  fontWeight: 600, fontSize: '0.8rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
}
