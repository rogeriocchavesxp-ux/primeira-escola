import type { Metadata } from 'next'
import Link from 'next/link'
import { getTrilhasPublicadas } from '@/lib/db'

export const revalidate = 300

const COMING_SOON = [
  { titulo: 'Fundamentos do Casamento',     para_quem: 'Casais em qualquer fase',      descricao: 'Base bíblica do casamento, papéis, comunicação e fidelidade segundo as Escrituras.' },
  { titulo: 'Pais de Filhos Pequenos',      para_quem: 'Pais com filhos de 0 a 7 anos', descricao: 'Instrução bíblica na primeira infância: fé, oração, disciplina e formação do coração.' },
  { titulo: 'Culto Doméstico na Prática',   para_quem: 'Toda a família',               descricao: 'Como iniciar e manter o culto doméstico semanal com liturgia, canto e Bíblia.' },
  { titulo: 'Cosmovisão Cristã',            para_quem: 'Pais e educadores',            descricao: 'Ensinar filhos a ver o mundo pela lente das Escrituras em todas as áreas da vida.' },
  { titulo: 'Pais de Adolescentes',         para_quem: 'Pais com filhos de 12 a 18 anos', descricao: 'Fé, identidade, cultura e diálogo com adolescentes que questionam a fé.' },
  { titulo: 'Discernimento Cultural',       para_quem: 'Famílias com filhos',          descricao: 'Como analisar telas, mídias e narrativas culturais à luz de uma cosmovisão bíblica.' },
  { titulo: 'Transmissão Geracional da Fé', para_quem: 'Pais, avós e educadores',     descricao: 'Salmo 78 como fundamento: como fé, história e memória são passadas de geração em geração.' },
  { titulo: 'Novo Convertido em Família',   para_quem: 'Famílias com recém-convertidos', descricao: 'Fundamentos da fé cristã para quem está começando a viver o evangelho em família.' },
]

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
        <div>
          <div style={{
            background: 'var(--brand-surface)', borderRadius: 12, padding: '1.5rem 2rem',
            border: '1px dashed var(--border)', marginBottom: '2rem',
            display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <p style={{ fontWeight: 700, color: 'var(--brand)', marginBottom: '0.35rem' }}>
                Trilhas em preparação.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
                Estamos finalizando o conteúdo. Veja o que está chegando abaixo.
              </p>
            </div>
            <a href="/#newsletter" style={{
              background: 'var(--brand)', color: '#fff', padding: '0.55rem 1.25rem',
              borderRadius: 7, fontSize: '0.82rem', fontWeight: 700,
              fontFamily: 'system-ui, sans-serif', textDecoration: 'none', flexShrink: 0,
            }}>
              Avisar no lançamento
            </a>
          </div>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif', marginBottom: '1rem' }}>
            Em preparação
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {COMING_SOON.map(t => (
              <div key={t.titulo} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '1.5rem', opacity: 0.7,
              }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', color: 'var(--brand)' }}>
                  {t.titulo}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem' }}>
                  Para: {t.para_quem}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>
                  {t.descricao}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginTop: '0.75rem' }}>
                  Em breve
                </p>
              </div>
            ))}
          </div>
        </div>
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
