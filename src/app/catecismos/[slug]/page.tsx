import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFeed, getContent, resolveSlug, resolveTitle } from '@/lib/lampas'

type Props = { params: Promise<{ slug: string }> }

type QA = {
  number: number
  number_label: string
  question: string
  answer: string
  bible_references: string[]
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { items } = await getFeed({ contentType: 'confessional_document', limit: 20 })
    return items.map(item => ({ slug: resolveSlug(item) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { items } = await getFeed({ contentType: 'confessional_document', limit: 20 })
  const item = items.find(i => resolveSlug(i) === slug)
  if (!item) return { title: 'Catecismo não encontrado' }
  return { title: resolveTitle(item) }
}

export default async function CatecismoPage({ params }: Props) {
  const { slug } = await params

  const { items } = await getFeed({ contentType: 'confessional_document', limit: 20 })
  const feedItem = items.find(i => resolveSlug(i) === slug)
  if (!feedItem) notFound()

  const data = await getContent('confessional_document', feedItem.content_id)
  if (!data) notFound()

  const { content } = data
  const questions: QA[] = (content.questions as QA[]) ?? []
  const title = feedItem.title_override ?? resolveTitle(feedItem)

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', padding: '0 1.5rem' }}>
      <header style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.35rem' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
          {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}
        </p>
      </header>

      <div>
        {questions.map(q => (
          <div key={q.number} className="qa-item">
            <p className="qa-number">Pergunta {q.number_label ?? q.number}</p>
            <p className="qa-question">{q.question}</p>
            <p className="qa-answer">{q.answer}</p>
            {q.bible_references?.length > 0 && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'system-ui, sans-serif',
              }}>
                {q.bible_references.join(' · ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
