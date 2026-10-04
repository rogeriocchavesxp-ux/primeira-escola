import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, TIPO_MEMBRO } from '@/lib/familia'
import { criarMembro } from '../../actions'

export const metadata: Metadata = { title: 'Novo Membro · Log Familiar' }

const EMOJIS_PESSOA  = ['👤','👦','👧','👨','👩','👴','👵','🧑','🧒']
const EMOJIS_VEICULO = ['🚗','🚙','🏍️','🚐','🚛','🚜','🛵','🚲']
const EMOJIS_OUTROS  = ['🏠','🐕','🐈','🏡','📦','💼']

export default async function NovoMembroPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <Link href="/familia/membros" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
          ← Membros
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>Novo membro</h1>
      </div>

      <form action={criarMembro} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Tipo *</label>
            <select name="tipo" required style={inputStyle}>
              {TIPO_MEMBRO.map(t => (
                <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nome *</label>
            <input name="nome" type="text" required placeholder="Ex: João, Carro Honda" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Relação / descrição</label>
          <input name="relacao" type="text" placeholder="Ex: filho, cônjuge, Civic 2022" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Emoji</label>
          <input name="emoji" type="text" defaultValue="👤" maxLength={4} style={{ ...inputStyle, width: 80 }} />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.4rem' }}>
            Sugestões — Pessoa: {EMOJIS_PESSOA.join(' ')}
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.2rem' }}>
            Veículo: {EMOJIS_VEICULO.join(' ')} · Outros: {EMOJIS_OUTROS.join(' ')}
          </p>
        </div>

        <div>
          <label style={labelStyle}>Data de nascimento / ano do veículo</label>
          <input name="nascimento" type="date" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Notas</label>
          <textarea name="notas" rows={2} placeholder="Informações adicionais, plano de saúde, placa..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button type="submit" style={btnPrimary}>Salvar</button>
          <Link href="/familia/membros" style={btnSecondary}>Cancelar</Link>
        </div>

      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif',
  marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem',
  border: '1px solid var(--border)', borderRadius: 7,
  fontSize: '0.9rem', fontFamily: 'system-ui, sans-serif',
  color: 'var(--text)', background: 'var(--surface)', outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff', border: 'none',
  padding: '0.6rem 1.4rem', borderRadius: 7,
  fontWeight: 700, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', cursor: 'pointer',
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--surface)', color: 'var(--text-2)',
  border: '1px solid var(--border)',
  padding: '0.6rem 1.1rem', borderRadius: 7,
  fontWeight: 600, fontSize: '0.875rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center',
}
