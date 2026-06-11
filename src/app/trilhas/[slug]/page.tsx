import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTrilhaBySlug, getTrilhasSlugs } from '@/lib/db'

export const dynamicParams = true
export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

type Aula = {
  id: string; ordem: number; titulo_override: string | null
  artigo: { id: string; slug: string; titulo: string; resumo: string | null; tempo_leitura: number | null; publicado: boolean } | null
}

export async function generateStaticParams() {
  try {
    const slugs = await getTrilhasSlugs()
    return slugs.map(slug => ({ slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const trilha = await getTrilhaBySlug(slug)
  if (!trilha) return { title: 'Trilha não encontrada' }
  return { title: trilha.titulo, description: trilha.descricao ?? undefined }
}

export default async function TrilhaPage({ params }: Props) {
  const { slug } = await params
  const trilha = await getTrilhaBySlug(slug)
  if (!trilha) notFound()

  const aulas = (trilha.aulas ?? []) as Aula[]
  const aulasPublicadas = aulas.filter(a => a.artigo?.publicado)

  return (
    <main style={{ maxWidth: 'var(--max-w)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <Link href="/trilhas" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif', textDecoration: 'none' }}>
        ← Trilhas
      </Link>

      <header style={{ margin: '1.25rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.6rem' }}>
          {trilha.titulo}
        </h1>
        {trilha.descricao && (
          <p style={{ color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
            {trilha.descricao}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
            Para: {trilha.para_quem}
          </p>
          {trilha.duracao_semanas && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
              {trilha.duracao_semanas} semanas
            </p>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
            {aulasPublicadas.length} {aulasPublicadas.length === 1 ? 'aula' : 'aulas'}
          </p>
        </div>
      </header>

      {Array.isArray(trilha.passagens_biblicas) && trilha.passagens_biblicas.length > 0 && (
        <div style={{
          background: 'var(--brand-surface)', borderLeft: '3px solid var(--accent)',
          borderRadius: '0 8px 8px 0', padding: '0.75rem 1.25rem', marginBottom: '2rem',
        }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.2rem' }}>
            Base bíblica
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--brand)', fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
            {trilha.passagens_biblicas.join(' · ')}
          </p>
        </div>
      )}

      {trilha.objetivo && (
        <p style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid var(--border)', paddingLeft: '1rem' }}>
          {trilha.objetivo}
        </p>
      )}

      <div>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand)', fontFamily: 'system-ui, sans-serif', marginBottom: '1rem' }}>
          Conteúdo da trilha
        </p>

        {aulasPublicadas.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Aulas em breve.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {aulasPublicadas.map((aula, idx) => (
              <Link key={aula.id} href={`/artigos/${aula.artigo!.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                }}>
                  <span style={{
                    width: 28, height: 28, background: 'var(--brand-surface)',
                    borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 800, color: 'var(--brand)',
                    fontFamily: 'system-ui, sans-serif', flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                      {aula.titulo_override ?? aula.artigo!.titulo}
                    </p>
                    {aula.artigo!.resumo && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
                        {aula.artigo!.resumo.slice(0, 100)}…
                      </p>
                    )}
                  </div>
                  {aula.artigo!.tempo_leitura && (
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', flexShrink: 0 }}>
                      {aula.artigo!.tempo_leitura} min
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
