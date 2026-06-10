export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      marginTop: '5rem',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif' }}>
        © {new Date().getFullYear()} Primeira Escola · Recursos para a família cristã
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.35rem', fontFamily: 'system-ui, sans-serif' }}>
        Conteúdo produzido pelo{' '}
        <a href="https://lampas.com.br" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>
          Lampas
        </a>
      </p>
    </footer>
  )
}
