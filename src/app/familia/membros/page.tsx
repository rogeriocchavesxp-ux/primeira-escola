import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getMembros, TIPO_MEMBRO } from '@/lib/familia'
import { arquivarMembro } from '../actions'

export const metadata: Metadata = { title: 'Membros · Log Familiar' }

export default async function MembrosPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const membros = await getMembros(user.id)

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '2rem 1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', gap: '1rem' }}>
        <div>
          <Link href="/familia" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
            ← Log Familiar
          </Link>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>Membros da família</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'system-ui, sans-serif', marginTop: '0.2rem' }}>
            Pessoas, veículos e outros bens que você acompanha.
          </p>
        </div>
        <Link href="/familia/membros/novo" style={btnPrimary}>+ Adicionar</Link>
      </div>

      {membros.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👨‍👩‍👧‍👦</p>
          <p style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Nenhum membro cadastrado</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', marginBottom: '1.5rem' }}>
            Cadastre os membros da família e seus bens para vincular os registros.
          </p>
          <Link href="/familia/membros/novo" style={btnPrimary}>+ Adicionar membro</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {membros.map(m => {
            const tipoConfig = TIPO_MEMBRO.find(t => t.id === m.tipo)
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '0.9rem 1.1rem',
              }}>
                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{m.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>{m.nome}</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.1rem' }}>
                    {tipoConfig?.label ?? m.tipo}
                    {m.relacao ? ` · ${m.relacao}` : ''}
                    {m.nascimento ? ` · ${m.nascimento.slice(0, 7).split('-').reverse().join('/')}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <Link href={`/familia/membros/${m.id}`} style={btnSmall}>
                    Histórico
                  </Link>
                  <Link href={`/familia/membros/${m.id}/editar`} style={btnSmall}>
                    Editar
                  </Link>
                  <form action={arquivarMembro.bind(null, m.id)}>
                    <button type="submit" style={{ ...btnSmall, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      Arquivar
                    </button>
                  </form>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff',
  padding: '0.55rem 1.1rem', borderRadius: 7,
  fontWeight: 700, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
  flexShrink: 0,
}

const btnSmall: React.CSSProperties = {
  background: 'var(--brand-surface)', color: 'var(--brand)',
  padding: '0.3rem 0.7rem', borderRadius: 6,
  fontWeight: 600, fontSize: '0.75rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
  border: 'none', display: 'inline-block',
}
