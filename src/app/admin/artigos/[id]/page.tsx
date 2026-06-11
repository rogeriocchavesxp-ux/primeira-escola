import ArtigoForm from '@/components/ArtigoForm'
import { getAreasAdmin, getArtigoAdmin, updateArtigo, deleteArtigo } from '../../actions'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ id: string }> }

export default async function EditArtigoPage({ params }: Props) {
  const { id } = await params
  const [areas, artigo] = await Promise.all([getAreasAdmin(), getArtigoAdmin(id)])
  if (!artigo) notFound()

  async function update(formData: FormData) {
    'use server'
    await updateArtigo(id, formData)
  }

  async function remove() {
    'use server'
    await deleteArtigo(id)
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <a href="/admin/artigos" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif', textDecoration: 'none' }}>
            ← Artigos
          </a>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.4rem' }}>Editar artigo</h1>
        </div>
        {artigo.publicado && (
          <a href={`/artigos/${artigo.slug}`} target="_blank" style={{
            color: 'var(--brand)', fontSize: '0.82rem', fontFamily: 'system-ui, sans-serif',
            textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 6,
            padding: '0.4rem 0.85rem',
          }}>
            Ver publicado ↗
          </a>
        )}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.75rem', marginBottom: '1.5rem' }}>
        <ArtigoForm areas={areas} artigo={artigo} action={update} submitLabel="Salvar alterações" />
      </div>

      <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: 10, padding: '1.25rem 1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', color: '#c0392b' }}>Zona de perigo</p>
        <form action={remove}>
          <button type="submit"
            onClick={() => confirm('Excluir este artigo permanentemente?')}
            style={{
              background: '#c0392b', color: '#fff', border: 'none', borderRadius: 6,
              padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
            }}>
            Excluir artigo
          </button>
        </form>
      </div>
    </div>
  )
}
