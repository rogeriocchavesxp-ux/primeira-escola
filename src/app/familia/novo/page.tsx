import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getMembros, CATEGORIAS } from '@/lib/familia'
import { criarRegistro } from '../actions'

export const metadata: Metadata = { title: 'Novo Registro · Log Familiar' }

export default async function NovoRegistroPage() {
  const user = await getAuthenticatedUser()
  if (!user) redirect('/login')

  const membros = await getMembros(user.id)

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <Link href="/familia" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
          ← Log Familiar
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>Novo registro</h1>
      </div>

      <form action={criarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Categoria */}
        <div>
          <label style={labelStyle}>Categoria *</label>
          <select name="categoria" required style={inputStyle}>
            {CATEGORIAS.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label style={labelStyle}>Título *</label>
          <input name="titulo" type="text" required placeholder="Ex: Consulta Dr. Carlos, Revisão 30k km" style={inputStyle} />
        </div>

        {/* Membro */}
        <div>
          <label style={labelStyle}>Membro / bem</label>
          <select name="membro_id" style={inputStyle}>
            <option value="">— Geral (sem vínculo) —</option>
            {membros.map(m => (
              <option key={m.id} value={m.id}>{m.emoji} {m.nome}{m.relacao ? ` (${m.relacao})` : ''}</option>
            ))}
          </select>
          {membros.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.35rem' }}>
              <Link href="/familia/membros/novo" style={{ color: 'var(--brand)' }}>Cadastrar membros</Link> para vincular os registros.
            </p>
          )}
        </div>

        {/* Datas lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Data do evento *</label>
            <input name="data_evento" type="date" required style={inputStyle}
              defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label style={labelStyle}>Próximo em</label>
            <input name="data_proximo" type="date" style={inputStyle} />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.25rem' }}>
              Retorno, revisão, etc.
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" style={inputStyle}>
            <option value="realizado">Realizado</option>
            <option value="agendado">Agendado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Profissional / local lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Profissional / responsável</label>
            <input name="profissional" type="text" placeholder="Ex: Dr. Carlos, Auto Ramos" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Local</label>
            <input name="local" type="text" placeholder="Ex: Hospital Central, Oficina" style={inputStyle} />
          </div>
        </div>

        {/* Valor */}
        <div>
          <label style={labelStyle}>Valor (R$)</label>
          <input name="valor" type="text" inputMode="decimal" placeholder="0,00" style={inputStyle} />
        </div>

        {/* Descrição */}
        <div>
          <label style={labelStyle}>Observações</label>
          <textarea name="descricao" rows={3} placeholder="Diagnóstico, serviços realizados, orientações..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <button type="submit" style={btnPrimary}>Salvar registro</button>
          <Link href="/familia" style={btnSecondary}>Cancelar</Link>
        </div>

      </form>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700,
  color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif',
  marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem',
  border: '1px solid var(--border)', borderRadius: 7,
  fontSize: '0.9rem', fontFamily: 'system-ui, sans-serif',
  color: 'var(--text)', background: 'var(--surface)', outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff',
  border: 'none', padding: '0.65rem 1.5rem', borderRadius: 7,
  fontWeight: 700, fontSize: '0.9rem',
  fontFamily: 'system-ui, sans-serif', cursor: 'pointer',
}

const btnSecondary: React.CSSProperties = {
  background: 'var(--surface)', color: 'var(--text-2)',
  border: '1px solid var(--border)',
  padding: '0.65rem 1.25rem', borderRadius: 7,
  fontWeight: 600, fontSize: '0.9rem',
  fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center',
}
