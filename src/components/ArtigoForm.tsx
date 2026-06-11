'use client'

import { useRef } from 'react'

type Area = { id: string; nome: string }

type Artigo = {
  id?: string; titulo?: string; subtitulo?: string; slug?: string
  resumo?: string; conteudo?: string; area_id?: string; autor?: string
  tempo_leitura?: number; passagens_biblicas?: string[]; tags?: string[]
  cover_url?: string; seo_titulo?: string; seo_descricao?: string
  publicado?: boolean; destaque?: boolean
}

type Props = {
  areas: Area[]
  artigo?: Artigo
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
}

export default function ArtigoForm({ areas, artigo, action, submitLabel = 'Salvar' }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  function autoSlug(e: React.ChangeEvent<HTMLInputElement>) {
    const slugInput = formRef.current?.elements.namedItem('slug') as HTMLInputElement
    if (!slugInput || slugInput.dataset.edited === 'true') return
    slugInput.value = e.target.value.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  return (
    <form ref={formRef} action={action}>
      {artigo?.id && <input type="hidden" name="id" value={artigo.id} />}
      {artigo?.publicado !== undefined && (
        <input type="hidden" name="era_publicado" value={String(artigo.publicado)} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Título *</label>
          <input name="titulo" required defaultValue={artigo?.titulo} onChange={autoSlug}
            style={inp} placeholder="Título do artigo" />
        </div>

        <div>
          <label style={lbl}>Slug *</label>
          <input name="slug" required defaultValue={artigo?.slug}
            onInput={(e) => { (e.target as HTMLInputElement).dataset.edited = 'true' }}
            style={inp} placeholder="url-do-artigo" />
        </div>

        <div>
          <label style={lbl}>Área</label>
          <select name="area_id" defaultValue={artigo?.area_id ?? ''} style={inp}>
            <option value="">— Sem área —</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Subtítulo</label>
          <input name="subtitulo" defaultValue={artigo?.subtitulo ?? ''} style={inp} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Resumo (para cards)</label>
          <textarea name="resumo" defaultValue={artigo?.resumo ?? ''} rows={2} style={{ ...inp, resize: 'vertical' }} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Conteúdo (Markdown)</label>
          <textarea name="conteudo" defaultValue={artigo?.conteudo ?? ''} rows={18}
            style={{ ...inp, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem' }} />
        </div>

        <div>
          <label style={lbl}>Autor</label>
          <input name="autor" defaultValue={artigo?.autor ?? 'Primeira Escola'} style={inp} />
        </div>

        <div>
          <label style={lbl}>Tempo de leitura (min)</label>
          <input name="tempo_leitura" type="number" min={1} defaultValue={artigo?.tempo_leitura ?? ''} style={inp} />
        </div>

        <div>
          <label style={lbl}>Passagens bíblicas (separadas por vírgula)</label>
          <input name="passagens_biblicas" defaultValue={(artigo?.passagens_biblicas ?? []).join(', ')} style={inp}
            placeholder="Dt 6.4, Sl 78.1" />
        </div>

        <div>
          <label style={lbl}>Tags (separadas por vírgula)</label>
          <input name="tags" defaultValue={(artigo?.tags ?? []).join(', ')} style={inp}
            placeholder="casamento, família" />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>URL da imagem de capa</label>
          <input name="cover_url" defaultValue={artigo?.cover_url ?? ''} style={inp} />
        </div>

        <div>
          <label style={lbl}>SEO: título</label>
          <input name="seo_titulo" defaultValue={artigo?.seo_titulo ?? ''} style={inp} />
        </div>

        <div>
          <label style={lbl}>SEO: descrição</label>
          <input name="seo_descricao" defaultValue={artigo?.seo_descricao ?? ''} style={inp} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem' }}>
          <input type="checkbox" name="publicado" defaultChecked={artigo?.publicado} />
          Publicar
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem' }}>
          <input type="checkbox" name="destaque" defaultChecked={artigo?.destaque} />
          Destaque na home
        </label>
      </div>

      <button type="submit" style={{
        background: 'var(--brand)', color: '#fff', border: 'none',
        borderRadius: 7, padding: '0.7rem 1.75rem', fontSize: '0.9rem',
        fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
      }}>
        {submitLabel}
      </button>
    </form>
  )
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700,
  color: 'var(--text-2)', fontFamily: 'system-ui, sans-serif',
  marginBottom: '0.3rem', letterSpacing: '0.03em',
}
const inp: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.8rem', border: '1px solid var(--border)',
  borderRadius: 6, fontSize: '0.875rem', background: 'var(--surface)',
  color: 'var(--text)', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box',
}
