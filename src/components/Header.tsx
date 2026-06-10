import Link from 'next/link'

const NAV = [
  { href: '/artigos',    label: 'Artigos' },
  { href: '/catecismos', label: 'Catecismos' },
  { href: '/estudos',    label: 'Estudos' },
]

export default function Header() {
  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{
        maxWidth: 'var(--max-w-wide)',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{
            width: 32,
            height: 32,
            background: 'var(--brand)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 800,
            fontFamily: 'Georgia, serif',
            flexShrink: 0,
          }}>PE</span>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', fontFamily: 'Georgia, serif' }}>
            Primeira Escola
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '0.25rem' }}>
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                fontSize: '0.875rem',
                color: 'var(--text-2)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
