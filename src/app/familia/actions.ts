'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase-server'

async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return user
}

// ── Membros ──────────────────────────────────────────────────────────────────

export async function criarMembro(formData: FormData) {
  const user = await getUser()
  const db = createServiceClient()

  const payload = {
    user_id:    user.id,
    nome:       String(formData.get('nome') ?? '').trim(),
    tipo:       String(formData.get('tipo') ?? 'pessoa'),
    relacao:    String(formData.get('relacao') ?? '').trim() || null,
    emoji:      String(formData.get('emoji') ?? '👤'),
    nascimento: String(formData.get('nascimento') ?? '').trim() || null,
    notas:      String(formData.get('notas') ?? '').trim() || null,
  }

  if (!payload.nome) return

  const { error } = await db.from('familia_membros').insert(payload)
  if (error) throw new Error(error.message)

  redirect('/familia/membros')
}

export async function atualizarMembro(formData: FormData) {
  const user = await getUser()
  const db = createServiceClient()

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const payload = {
    nome:       String(formData.get('nome') ?? '').trim(),
    tipo:       String(formData.get('tipo') ?? 'pessoa'),
    relacao:    String(formData.get('relacao') ?? '').trim() || null,
    emoji:      String(formData.get('emoji') ?? '👤'),
    nascimento: String(formData.get('nascimento') ?? '').trim() || null,
    notas:      String(formData.get('notas') ?? '').trim() || null,
  }

  if (!payload.nome) return

  const { error } = await db
    .from('familia_membros')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  redirect('/familia/membros')
}

export async function arquivarMembro(id: string) {
  const user = await getUser()
  const db = createServiceClient()

  await db
    .from('familia_membros')
    .update({ ativo: false })
    .eq('id', id)
    .eq('user_id', user.id)

  redirect('/familia/membros')
}

// ── Registros ─────────────────────────────────────────────────────────────────

export async function criarRegistro(formData: FormData) {
  const user = await getUser()
  const db = createServiceClient()

  const membroId = String(formData.get('membro_id') ?? '').trim() || null
  const valorRaw = String(formData.get('valor') ?? '').trim()

  const payload = {
    user_id:      user.id,
    membro_id:    membroId,
    categoria:    String(formData.get('categoria') ?? 'outro'),
    titulo:       String(formData.get('titulo') ?? '').trim(),
    descricao:    String(formData.get('descricao') ?? '').trim() || null,
    data_evento:  String(formData.get('data_evento') ?? ''),
    data_proximo: String(formData.get('data_proximo') ?? '').trim() || null,
    status:       String(formData.get('status') ?? 'realizado'),
    local:        String(formData.get('local') ?? '').trim() || null,
    profissional: String(formData.get('profissional') ?? '').trim() || null,
    valor:        valorRaw ? parseFloat(valorRaw.replace(',', '.')) : null,
  }

  if (!payload.titulo || !payload.data_evento) return

  const { error } = await db.from('familia_registros').insert(payload)
  if (error) throw new Error(error.message)

  redirect('/familia')
}

export async function atualizarRegistro(formData: FormData) {
  const user = await getUser()
  const db = createServiceClient()

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const membroId = String(formData.get('membro_id') ?? '').trim() || null
  const valorRaw = String(formData.get('valor') ?? '').trim()

  const payload = {
    membro_id:    membroId,
    categoria:    String(formData.get('categoria') ?? 'outro'),
    titulo:       String(formData.get('titulo') ?? '').trim(),
    descricao:    String(formData.get('descricao') ?? '').trim() || null,
    data_evento:  String(formData.get('data_evento') ?? ''),
    data_proximo: String(formData.get('data_proximo') ?? '').trim() || null,
    status:       String(formData.get('status') ?? 'realizado'),
    local:        String(formData.get('local') ?? '').trim() || null,
    profissional: String(formData.get('profissional') ?? '').trim() || null,
    valor:        valorRaw ? parseFloat(valorRaw.replace(',', '.')) : null,
    updated_at:   new Date().toISOString(),
  }

  if (!payload.titulo || !payload.data_evento) return

  const { error } = await db
    .from('familia_registros')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  redirect('/familia')
}

export async function excluirRegistro(id: string) {
  const user = await getUser()
  const db = createServiceClient()

  await db
    .from('familia_registros')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  redirect('/familia')
}
