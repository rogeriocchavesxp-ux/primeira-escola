'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '2.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.4rem' }}>
            Primeira Escola
          </p>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand)' }}>Acesso admin</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required style={inputStyle} placeholder="seu@email.com" />
          </div>
          <div>
            <label style={labelStyle}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required style={inputStyle} placeholder="••••••••" />
          </div>
          {error && <p style={{ color: '#c0392b', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>{error}</p>}
          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700,
  color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif',
  marginBottom: '0.35rem', letterSpacing: '0.03em',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem', border: '1px solid var(--border)',
  borderRadius: 7, fontSize: '0.9rem', background: 'var(--bg)',
  color: 'var(--text)', outline: 'none', fontFamily: 'system-ui, sans-serif',
  boxSizing: 'border-box',
}
const btnStyle: React.CSSProperties = {
  background: 'var(--brand)', color: '#fff', border: 'none',
  borderRadius: 7, padding: '0.7rem', fontSize: '0.9rem',
  fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
}
