import type { Metadata } from 'next'
import Link from 'next/link'
import { getTrilhasPublicadas } from '@/lib/db'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Trilhas de Formação',
  description: 'Caminhos estruturados de formação bíblica para cada fase da sua família.',
}

type Trilha = {
  id: string; slug: string; titulo: string; descricao: string | null
  para_quem: string | null; duracao_semanas: number | null; cover_url: string | null
  passagens_biblicas: string[] | null
}

export default async function TrilhasPage() {
  const trilhas = (await getTrilhasPublicadas()) as Trilha[]

  return (
    <main style={{ maxWidth: 'var(--max-w-wide)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ maxWidth: 680, marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Trilhas de formação</h1>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
          A Primeira Escola não é apenas um repositório de artigos — ela oferece caminhos.
          Escolha a trilha que corresponde à fase da sua família.
        </p>
      </header>

      {trilhas.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Trilhas em breve.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {trilhas.map(t => (
            <Link key={t.id} href={`/trilhas/${t.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '1.5rem', height: '100%',
                display: 'flex', flexDirection: 'column',
              }}>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--brand)' }}>
                  {t.titulo}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  Para: {t.para_quem}
                </p>
                {t.descricao && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>
                    {t.descricao}
                  </p>
                )}
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {t.duracao_semanas ? (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
                      {t.duracao_semanas} semanas
                    </p>
                  ) : <span />}
                  <span style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 700 }}>Iniciar →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
