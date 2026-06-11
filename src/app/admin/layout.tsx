import { assertAdmin, signOut } from './actions'

const navItems = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/artigos',  label: 'Artigos' },
  { href: '/admin/trilhas',  label: 'Trilhas' },
  { href: '/admin/biblioteca', label: 'Biblioteca' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await assertAdmin()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--brand)', color: '#fff',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'system-ui, sans-serif', marginBottom: '0.2rem' }}>
            Primeira Escola
          </p>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, fontFamily: 'system-ui, sans-serif' }}>Admin</p>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(item => (
            <a key={item.href} href={item.href} style={{
              display: 'block', padding: '0.65rem 1.25rem',
              color: '#fff', textDecoration: 'none', fontSize: '0.88rem',
              fontFamily: 'system-ui, sans-serif', opacity: 0.85,
              transition: 'opacity 0.15s',
            }}>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <form action={signOut}>
            <button style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff', borderRadius: 6, padding: '0.45rem 0.85rem',
              fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
            }}>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
