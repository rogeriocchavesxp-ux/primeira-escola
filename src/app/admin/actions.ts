'use server'

import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

// ── Auth ─────────────────────────────────────────────────────────

export async function assertAdmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/login')
  return user
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ── Helpers ───────────────────────────────────────────────────────

function toSlug(text: string) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Artigos ───────────────────────────────────────────────────────

export async function getAreasAdmin() {
  await assertAdmin()
  const db = createServiceClient()
  const { data } = await db.from('areas').select('id, nome').order('ordem')
  return data ?? []
}

export async function listArtigosAdmin() {
  await assertAdmin()
  const db = createServiceClient()
  const { data } = await db
    .from('artigos')
    .select('id, slug, titulo, publicado, destaque, publicado_em, area:areas(nome)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getArtigoAdmin(id: string) {
  await assertAdmin()
  const db = createServiceClient()
  const { data } = await db.from('artigos').select('*').eq('id', id).single()
  return data
}

export async function createArtigo(formData: FormData) {
  await assertAdmin()
  const db = createServiceClient()

  const titulo = formData.get('titulo') as string
  const payload = {
    titulo,
    slug:               formData.get('slug') as string || toSlug(titulo),
    subtitulo:          formData.get('subtitulo') as string || null,
    resumo:             formData.get('resumo') as string || null,
    conteudo:           formData.get('conteudo') as string || null,
    area_id:            formData.get('area_id') as string || null,
    autor:              formData.get('autor') as string || 'Primeira Escola',
    tempo_leitura:      Number(formData.get('tempo_leitura')) || null,
    passagens_biblicas: (formData.get('passagens_biblicas') as string || '').split(',').map(s => s.trim()).filter(Boolean),
    tags:               (formData.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
    cover_url:          formData.get('cover_url') as string || null,
    seo_titulo:         formData.get('seo_titulo') as string || null,
    seo_descricao:      formData.get('seo_descricao') as string || null,
    publicado:          formData.get('publicado') === 'on',
    destaque:           formData.get('destaque') === 'on',
    publicado_em:       formData.get('publicado') === 'on' ? new Date().toISOString() : null,
  }

  const { data, error } = await db.from('artigos').insert(payload).select('id').single()
  if (error) throw new Error(error.message)
  redirect(`/admin/artigos/${data.id}`)
}

export async function updateArtigo(id: string, formData: FormData) {
  await assertAdmin()
  const db = createServiceClient()

  const titulo = formData.get('titulo') as string
  const eraPublicado = formData.get('era_publicado') === 'true'
  const agoraPublicado = formData.get('publicado') === 'on'

  const payload = {
    titulo,
    slug:               formData.get('slug') as string || toSlug(titulo),
    subtitulo:          formData.get('subtitulo') as string || null,
    resumo:             formData.get('resumo') as string || null,
    conteudo:           formData.get('conteudo') as string || null,
    area_id:            formData.get('area_id') as string || null,
    autor:              formData.get('autor') as string || 'Primeira Escola',
    tempo_leitura:      Number(formData.get('tempo_leitura')) || null,
    passagens_biblicas: (formData.get('passagens_biblicas') as string || '').split(',').map(s => s.trim()).filter(Boolean),
    tags:               (formData.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
    cover_url:          formData.get('cover_url') as string || null,
    seo_titulo:         formData.get('seo_titulo') as string || null,
    seo_descricao:      formData.get('seo_descricao') as string || null,
    publicado:          agoraPublicado,
    destaque:           formData.get('destaque') === 'on',
    publicado_em:       !eraPublicado && agoraPublicado ? new Date().toISOString() : undefined,
  }

  const { error } = await db.from('artigos').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  redirect(`/admin/artigos/${id}`)
}

export async function deleteArtigo(id: string) {
  await assertAdmin()
  const db = createServiceClient()
  await db.from('artigos').delete().eq('id', id)
  redirect('/admin/artigos')
}
