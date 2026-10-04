import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getAuthenticatedUser, getRegistroById, getMembros, getCategoriaConfig, formatarData, CATEGORIAS } from '@/lib/familia'
import { atualizarRegistro, excluirRegistro } from '../../actions'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Registro · Log Familiar' }

export default async function RegistroPage({ params }: Props) {
  const { id } = await params
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const [registro, membros] = await Promise.all([
    getRegistroById(id, user.id),
    getMembros(user.id),
  ])

  if (!registro) notFound()

  const cat = getCategoriaConfig(registro.categoria)

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '2rem 1.5rem' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/familia" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
          ← Log Familiar
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.6rem' }}>{cat.emoji}</span>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.2 }}>{registro.titulo}</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
              {cat.label} · {formatarData(registro.data_evento)}
              {registro.membro && ` · ${registro.membro.emoji} ${registro.membro.nome}`}
            </p>
          </div>
        </div>
      </div>

      {/* Info atual */}
      {registro.descricao && (
        <div style={{ background: 'var(--brand-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>{registro.descricao}</p>
        </div>
      )}

      {/* Detalhes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
        {registro.profissional && <InfoCard label="Profissional" value={registro.profissional} />}
        {registro.local        && <InfoCard label="Local"        value={registro.local} />}
        {registro.data_proximo && <InfoCard label="Próximo"      value={formatarData(registro.data_proximo)} highlight />}
        {registro.valor != null && <InfoCard label="Valor" value={`R$ ${registro.valor.toFixed(2).replace('.', ',')}`} />}
        <InfoCard label="Status" value={registro.status === 'realizado' ? 'Realizado' : registro.status === 'agendado' ? 'Agendado' : 'Cancelado'} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '2rem' }} />

      {/* Formulário de edição */}
      <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.25rem' }}>
        Editar registro
      </h2>

      <form action={atualizarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <input type="hidden" name="id" value={registro.id} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select name="categoria" style={inputStyle} defaultValue={registro.categoria}>
              {CATEGORIAS.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" style={inputStyle} defaultValue={registro.status}>
              <option value="realizado">Realizado</option>
              <option value="agendado">Agendado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Título *</label>
          <input name="titulo" type="text" required defaultValue={registro.titulo} style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Membro / bem</label>
          <select name="membro_id" style={inputStyle} defaultValue={registro.membro_id ?? ''}>
            <option value="">— Geral —</option>
            {membros.map(m => (
              <option key={m.id} value={m.id}>{m.emoji} {m.nome}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Data do evento *</label>
            <input name="data_evento" type="date" required defaultValue={registro.data_evento} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Próximo em</label>
            <input name="data_proximo" type="date" defaultValue={registro.data_proximo ?? ''} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Profissional</label>
            <input name="profissional" type="text" defaultValue={registro.profissional ?? ''} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Local</label>
            <input name="local" type="text" defaultValue={registro.local ?? ''} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Valor (R$)</label>
          <input name="valor" type="text" inputMode="decimal"
            defaultValue={registro.valor != null ? String(registro.valor).replace('.', ',') : ''}
            style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Observações</label>
          <textarea name="descricao" rows={3} defaultValue={registro.descricao ?? ''} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button type="submit" style={btnPrimary}>Salvar</button>
          <Link href="/familia" style={btnSecondary}>Cancelar</Link>
        </div>
      </form>

      {/* Excluir */}
      <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <form action={excluirRegistro.bind(null, registro.id)}>
          <button type="submit" style={{
            background: 'transparent', border: '1px solid #dc2626',
            color: '#dc2626', padding: '0.5rem 1rem', borderRadius: 7,
            fontSize: '0.8rem', fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer', fontWeight: 600,
          }}
            onClick={() => confirm('Excluir este registro?') || undefined}
          >
            Excluir registro
          </button>
        </form>
      </div>

    </div>
  )
}

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      background: highlight ? '#fef9ec' : 'var(--surface)',
      border: `1px solid ${highlight ? '#f59e0b' : 'var(--border)'}`,
      borderRadius: 8, padding: '0.75rem 1rem',
    }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.2rem' }}>
        {label}
      </p>
      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: highlight ? '#b45309' : 'var(--text)' }}>
        {value}
      </p>
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
