import { createServiceClient } from './supabase-server'

// ── Áreas ─────────────────────────────────────────────────────────

export async function getAreas() {
  const db = createServiceClient()
  const { data } = await db.from('areas').select('id, slug, nome, descricao').order('ordem')
  return data ?? []
}

// ── Artigos ───────────────────────────────────────────────────────

export async function getArtigosPublicados(options?: {
  areaSlug?: string
  destaque?: boolean
  limit?: number
  offset?: number
}) {
  const db = createServiceClient()
  let q = db
    .from('artigos')
    .select('id, slug, titulo, subtitulo, resumo, autor, publicado_em, tempo_leitura, tags, cover_url, destaque, area:areas(slug, nome)')
    .eq('publicado', true)
    .order('publicado_em', { ascending: false })

  if (options?.areaSlug) {
    const { data: area } = await db.from('areas').select('id').eq('slug', options.areaSlug).single()
    if (area) q = q.eq('area_id', area.id)
  }
  if (options?.destaque) q = q.eq('destaque', true)
  if (options?.limit)    q = q.limit(options.limit)
  if (options?.offset)   q = q.range(options.offset, options.offset + (options.limit ?? 10) - 1)

  const { data } = await q
  return data ?? []
}

export async function getArtigoBySlug(slug: string) {
  const db = createServiceClient()
  const { data } = await db
    .from('artigos')
    .select('*, area:areas(slug, nome)')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()
  return data
}

export async function getArtigosSlugs() {
  const db = createServiceClient()
  const { data } = await db.from('artigos').select('slug').eq('publicado', true)
  return (data ?? []).map(r => r.slug as string)
}

export async function getArtigosComecePorAqui(persona?: string) {
  const db = createServiceClient()
  const { data: area } = await db.from('areas').select('id').eq('slug', 'comece-por-aqui').single()
  if (!area) return []

  const base = db
    .from('artigos')
    .select('id, slug, titulo, subtitulo, tempo_leitura, tags')
    .eq('publicado', true)
    .eq('area_id', area.id)
    .order('publicado_em', { ascending: true })

  const { data } = persona
    ? await base.contains('tags', [persona])
    : await base

  return data ?? []
}

// ── Trilhas ───────────────────────────────────────────────────────

export async function getTrilhasPublicadas() {
  const db = createServiceClient()
  const { data } = await db
    .from('trilhas')
    .select('id, slug, titulo, descricao, para_quem, duracao_semanas, passagens_biblicas, cover_url')
    .eq('publicada', true)
    .order('ordem')
  return data ?? []
}

export async function getTrilhaBySlug(slug: string) {
  const db = createServiceClient()
  const { data: trilha } = await db
    .from('trilhas')
    .select('*')
    .eq('slug', slug)
    .eq('publicada', true)
    .single()
  if (!trilha) return null

  const { data: aulas } = await db
    .from('aulas')
    .select('id, ordem, titulo_override, artigo:artigos(id, slug, titulo, resumo, tempo_leitura, publicado)')
    .eq('trilha_id', trilha.id)
    .order('ordem')

  return { ...trilha, aulas: aulas ?? [] }
}

export async function getTrilhasSlugs() {
  const db = createServiceClient()
  const { data } = await db.from('trilhas').select('slug').eq('publicada', true)
  return (data ?? []).map(r => r.slug as string)
}

// ── Biblioteca ────────────────────────────────────────────────────

export async function getBibliotecaCategorias() {
  const db = createServiceClient()
  const { data } = await db.from('biblioteca_categorias').select('id, slug, nome, descricao').order('ordem')
  return data ?? []
}

export async function getBibliotecaItens(options?: { categoriaSlug?: string; tipo?: string }) {
  const db = createServiceClient()
  let q = db
    .from('biblioteca_itens')
    .select('id, slug, titulo, descricao, tipo, arquivo_url, destaque, categoria:biblioteca_categorias(slug, nome)')
    .eq('publicado', true)
    .order('ordem')

  if (options?.categoriaSlug) {
    const { data: cat } = await db.from('biblioteca_categorias').select('id').eq('slug', options.categoriaSlug).single()
    if (cat) q = q.eq('categoria_id', cat.id)
  }
  if (options?.tipo) q = q.eq('tipo', options.tipo)

  const { data } = await q
  return data ?? []
}

export async function getBibliotecaItemBySlug(slug: string) {
  const db = createServiceClient()
  const { data } = await db
    .from('biblioteca_itens')
    .select('*, categoria:biblioteca_categorias(slug, nome)')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()
  return data
}
