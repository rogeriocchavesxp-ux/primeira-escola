import type { Metadata } from 'next'
import Link from 'next/link'
import { getTrilhasPublicadas } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Trilhas de Formação',
  description: 'Caminhos estruturados de formação bíblica para cada fase da sua família.',
}

const COMING_SOON = [
  { titulo: 'Fundamentos do Casamento',     para_quem: 'Casais em qualquer fase',           tags: ['casal'] },
  { titulo: 'Pais de Filhos Pequenos',       para_quem: 'Pais com filhos de 0 a 7 anos',    tags: ['pai', 'mae'] },
  { titulo: 'Culto Doméstico na Prática',    para_quem: 'Toda a família',                    tags: ['pai', 'mae', 'casal', 'educador', 'pastor'] },
  { titulo: 'Cosmovisão Cristã',             para_quem: 'Pais e educadores',                 tags: ['pai', 'mae', 'educador'] },
  { titulo: 'Pais de Adolescentes',          para_quem: 'Pais com filhos de 12 a 18 anos',  tags: ['pai', 'mae'] },
  { titulo: 'Discernimento Cultural',        para_quem: 'Famílias com filhos',               tags: ['pai', 'mae', 'educador', 'pastor'] },
  { titulo: 'Transmissão Geracional da Fé',  para_quem: 'Pais, avós e educadores',           tags: ['pai', 'mae', 'educador', 'pastor'] },
  { titulo: 'Novo Convertido em Família',    para_quem: 'Famílias com recém-convertidos',    tags: ['pai', 'mae', 'casal', 'pastor'] },
]

const PERSONAS = [
  { key: 'pai',       label: 'Sou Pai',       desc: 'Lidere sua família com fé' },
  { key: 'mae',       label: 'Sou Mãe',       desc: 'Forme seus filhos na Palavra' },
  { key: 'casal',     label: 'Somos Casal',   desc: 'Construa um lar bíblico' },
  { key: 'educador',  label: 'Sou Educador',  desc: 'Ensine com fundamento' },
  { key: 'pastor',    label: 'Sou Pastor',    desc: 'Recursos para recomendar' },
]

type Trilha = {
  id: string; slug: string; titulo: string; descricao: string | null
  para_quem: string | null; duracao_semanas: number | null; cover_url: string | null
  passagens_biblicas: string[] | null
}

type Props = { searchParams: Promise<{ para?: string }> }

export default async function TrilhasPage({ searchParams }: Props) {
  const { para } = await searchParams
  const filtro = para ?? null

  const trilhasDB = (await getTrilhasPublicadas()) as Trilha[]

  const personaAtiva = PERSONAS.find(p => p.key === filtro)

  const trilhasFiltradas = filtro
    ? trilhasDB.filter(t => {
        const pq = (t.para_quem ?? '').toLowerCase()
        const mapa: Record<string, string[]> = {
          pai:      ['pai', 'pais'],
          mae:      ['mãe', 'mães'],
          casal:    ['casal', 'casais'],
          educador: ['educador', 'educadores'],
          pastor:   ['pastor', 'pastores'],
        }
        return (mapa[filtro] ?? []).some(term => pq.includes(term))
      })
    : trilhasDB

  const comingSoonFiltrado = filtro
    ? COMING_SOON.filter(t => t.tags.includes(filtro))
    : COMING_SOON

  return (
    <main style={{ maxWidth: 'var(--max-w-wide)', margin: '3rem auto', padding: '0 1.5rem' }}>

      <header style={{ maxWidth: 680, marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {personaAtiva ? personaAtiva.label : 'Trilhas de formação'}
        </h1>
        <p style={{ color: 'var(--text-2)', lineHeight: 1.65, fontFamily: 'system-ui, sans-serif' }}>
          {personaAtiva
            ? personaAtiva.desc + ' — trilhas selecionadas para o seu momento.'
            : 'A Primeira Escola não é apenas um repositório de artigos — ela oferece caminhos. Escolha a trilha que corresponde à fase da sua família.'}
        </p>
      </header>

      {/* Filtros de persona */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <Link
          href="/trilhas"
          style={{
            padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
            fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
            background: !filtro ? 'var(--brand)' : 'var(--surface)',
            color: !filtro ? '#fff' : 'var(--text-2)',
            border: `1px solid ${!filtro ? 'var(--brand)' : 'var(--border)'}`,
          }}
        >
          Todas
        </Link>
        {PERSONAS.map(p => (
          <Link
            key={p.key}
            href={`/trilhas?para=${p.key}`}
            style={{
              padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
              fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
              background: filtro === p.key ? 'var(--brand)' : 'var(--surface)',
              color: filtro === p.key ? '#fff' : 'var(--text-2)',
              border: `1px solid ${filtro === p.key ? 'var(--brand)' : 'var(--border)'}`,
            }}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {trilhasFiltradas.length === 0 && comingSoonFiltrado.length === 0 ? (
        <div style={{
          background: 'var(--brand-surface)', borderRadius: 12, padding: '2.5rem',
          textAlign: 'center', border: '1px dashed var(--border)',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--brand)', marginBottom: '0.5rem' }}>
            Nenhuma trilha encontrada para este filtro.
          </p>
          <Link href="/trilhas" style={{ fontSize: '0.875rem', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif' }}>
            Ver todas as trilhas →
          </Link>
        </div>
      ) : (
        <>
          {/* Trilhas publicadas */}
          {trilhasFiltradas.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {trilhasFiltradas.map(t => (
                <Link key={t.id} href={`/trilhas/${t.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '1.5rem', height: '100%',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--brand)' }}>
                      {t.titulo}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.75rem' }}>
                      Para: {t.para_quem}
                    </p>
                    {t.descricao && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6, flex: 1, fontFamily: 'system-ui, sans-serif' }}>
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

          {/* Em preparação */}
          {comingSoonFiltrado.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif' }}>
                  {trilhasFiltradas.length > 0 ? 'Mais em preparação' : 'Em preparação'}
                </p>
                <a href="/#newsletter" style={{ fontSize: '0.82rem', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', textDecoration: 'none', fontWeight: 600 }}>
                  Avisar no lançamento →
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {comingSoonFiltrado.map(t => (
                  <div key={t.titulo} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '1.5rem', opacity: 0.65,
                  }}>
                    <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem', color: 'var(--brand)' }}>
                      {t.titulo}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.5rem' }}>
                      Para: {t.para_quem}
                    </p>
                    <span style={{
                      display: 'inline-block', fontSize: '0.68rem', fontWeight: 700,
                      color: 'var(--accent)', fontFamily: 'system-ui, sans-serif',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      Em breve
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
