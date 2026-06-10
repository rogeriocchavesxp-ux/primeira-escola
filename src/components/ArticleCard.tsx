import Link from 'next/link'
import type { FeedItem } from '@/lib/lampas'
import { resolveSlug, resolveTitle, resolveSummary, typeToSegment } from '@/lib/lampas'

type Props = {
  item: FeedItem
  featured?: boolean
}

export default function ArticleCard({ item, featured }: Props) {
  const title   = resolveTitle(item)
  const summary = resolveSummary(item)
  const slug    = resolveSlug(item)
  const segment = typeToSegment(item.content_type)
  const href    = `/${segment}/${slug}`

  const date = item.published_at
    ? new Date(item.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  if (featured) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        <article style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '2rem',
          transition: 'border-color 0.15s',
        }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--brand)',
            color: '#fff',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.22rem 0.6rem',
            borderRadius: 4,
            marginBottom: '0.85rem',
            fontFamily: 'system-ui, sans-serif',
          }}>
            Destaque
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.65rem', color: 'var(--text)' }}>
            {title}
          </h2>
          {summary && (
            <p style={{ color: 'var(--text-2)', fontSize: '0.9375rem', lineHeight: 1.65, marginBottom: '1rem', fontFamily: 'system-ui, sans-serif' }}>
              {summary.slice(0, 200)}{summary.length > 200 ? '…' : ''}
            </p>
          )}
          {date && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'system-ui, sans-serif' }}>
              {date}
            </span>
          )}
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '1.4rem 1.6rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35, color: 'var(--text)' }}>
          {title}
        </h3>
        {summary && (
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' }}>
            {summary.slice(0, 140)}{summary.length > 140 ? '…' : ''}
          </p>
        )}
        {date && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'system-ui, sans-serif' }}>
            {date}
          </span>
        )}
      </article>
    </Link>
  )
}
