import Link from 'next/link'

const NAV = [
  { href: '/#comece-aqui', label: 'Comece Aqui' },
  { href: '/trilhas',      label: 'Trilhas' },
  { href: '/artigos',      label: 'Artigos' },
  { href: '/biblioteca',   label: 'Biblioteca' },
]

export default function Header() {
  return (
    <header style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: 'var(--max-w-wide)', margin: '0 auto', padding: '0 1.5rem',
        height: 64, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '2rem',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, background: 'var(--brand)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '1rem', fontFamily: 'Georgia, serif', lineHeight: 1 }}>1</span>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand)', fontFamily: 'Georgia, serif', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              PRIMEIRA
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.65rem', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.18em', lineHeight: 1 }}>
              ESCOLA
            </p>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: '0.15rem' }}>
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '0.4rem 0.9rem', borderRadius: 6, fontSize: '0.875rem',
              color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif',
              fontWeight: 500, textDecoration: 'none',
            }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
