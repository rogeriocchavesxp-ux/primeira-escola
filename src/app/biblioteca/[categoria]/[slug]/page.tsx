import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { marked } from 'marked'
import { getBibliotecaItemBySlug } from '@/lib/db'

export const dynamicParams = true
export const revalidate = 3600

type Props = { params: Promise<{ categoria: string; slug: string }> }

export async function generateStaticParams() { return [] }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getBibliotecaItemBySlug(slug)
  if (!item) return { title: 'Item não encontrado' }
  return { title: item.titulo, description: item.descricao ?? undefined }
}

type QA = { number: number; number_label?: string; question: string; answer: string; bible_references?: string[] }

export default async function BibliotecaItemPage({ params }: Props) {
  const { slug } = await params
  const item = await getBibliotecaItemBySlug(slug)
  if (!item) notFound()

  const cat = item.categoria as { slug: string; nome: string } | null
  const isCatecismo = item.tipo === 'catecismo'
  const questoes: QA[] = isCatecismo ? ((item.conteudo_json as QA[]) ?? []) : []
  const bodyHtml = item.conteudo ? await marked(item.conteudo) : ''

  return (
    <main style={{ maxWidth: 'var(--max-w)', margin: '3rem auto', padding: '0 1.5rem' }}>
      <Link href="/biblioteca" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif', textDecoration: 'none' }}>
        ← Biblioteca
      </Link>

      <header style={{ margin: '1.25rem 0 2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {cat && (
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.5rem' }}>
            {cat.nome}
          </p>
        )}
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, lineHeight: 1.25, marginBottom: '0.5rem' }}>
          {item.titulo}
        </h1>
        {item.descricao && (
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>{item.descricao}</p>
        )}
        {item.arquivo_url && (
          <a href={item.arquivo_url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem',
            background: 'var(--accent)', color: '#fff', padding: '0.5rem 1.1rem',
            borderRadius: 7, fontSize: '0.82rem', fontWeight: 700,
            fontFamily: 'system-ui, sans-serif', textDecoration: 'none',
          }}>
            Baixar PDF
          </a>
        )}
      </header>

      {isCatecismo && questoes.length > 0 ? (
        <div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif', marginBottom: '1.5rem' }}>
            {questoes.length} {questoes.length === 1 ? 'pergunta' : 'perguntas'}
          </p>
          {questoes.map(q => (
            <div key={q.number} className="qa-item">
              <p className="qa-number">Pergunta {q.number_label ?? q.number}</p>
              <p className="qa-question">{q.question}</p>
              <p className="qa-answer">{q.answer}</p>
              {q.bible_references && q.bible_references.length > 0 && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
                  {q.bible_references.join(' · ')}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : bodyHtml ? (
        <div className="prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      ) : (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>Conteúdo em breve.</p>
      )}
    </main>
  )
}
