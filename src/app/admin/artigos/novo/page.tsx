import ArtigoForm from '@/components/ArtigoForm'
import { getAreasAdmin, createArtigo } from '../../actions'

export default async function NovoArtigoPage() {
  const areas = await getAreasAdmin()

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/admin/artigos" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif', textDecoration: 'none' }}>
          ← Artigos
        </a>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.4rem' }}>Novo artigo</h1>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.75rem' }}>
        <ArtigoForm areas={areas} action={createArtigo} submitLabel="Criar artigo" />
      </div>
    </div>
  )
}
