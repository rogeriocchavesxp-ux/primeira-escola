import { createServerSupabaseClient, createServiceClient } from './supabase-server'

export type FamiliaMembro = {
  id: string
  user_id: string
  nome: string
  tipo: 'pessoa' | 'veiculo' | 'imovel' | 'pet' | 'outro'
  relacao: string | null
  emoji: string
  nascimento: string | null
  notas: string | null
  ativo: boolean
  created_at: string
}

export type FamiliaRegistro = {
  id: string
  user_id: string
  membro_id: string | null
  categoria: 'medico' | 'veiculo' | 'escola' | 'visita' | 'casa' | 'financeiro' | 'outro'
  titulo: string
  descricao: string | null
  data_evento: string
  data_proximo: string | null
  status: 'realizado' | 'agendado' | 'cancelado'
  local: string | null
  profissional: string | null
  valor: number | null
  tags: string[]
  created_at: string
  updated_at: string
  membro?: Pick<FamiliaMembro, 'id' | 'nome' | 'emoji'> | null
}

export const CATEGORIAS = [
  { id: 'medico',     label: 'Médico',      emoji: '🏥', cor: '#dc2626' },
  { id: 'veiculo',    label: 'Veículo',     emoji: '🚗', cor: '#d97706' },
  { id: 'escola',     label: 'Escola',      emoji: '📚', cor: '#2563eb' },
  { id: 'visita',     label: 'Visita',      emoji: '🤝', cor: '#7c3aed' },
  { id: 'casa',       label: 'Casa',        emoji: '🏠', cor: '#059669' },
  { id: 'financeiro', label: 'Financeiro',  emoji: '💰', cor: '#0891b2' },
  { id: 'outro',      label: 'Outro',       emoji: '📝', cor: '#6b7280' },
] as const

export const TIPO_MEMBRO = [
  { id: 'pessoa',  label: 'Pessoa',   emoji: '👤' },
  { id: 'veiculo', label: 'Veículo',  emoji: '🚗' },
  { id: 'imovel',  label: 'Imóvel',   emoji: '🏠' },
  { id: 'pet',     label: 'Pet',      emoji: '🐾' },
  { id: 'outro',   label: 'Outro',    emoji: '📦' },
] as const

export function getCategoriaConfig(id: string) {
  return CATEGORIAS.find(c => c.id === id) ?? CATEGORIAS[CATEGORIAS.length - 1]
}

// ── Autenticação ───────────────────────────────────────────────────────────────

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Membros ────────────────────────────────────────────────────────────────────

export async function getMembros(userId: string): Promise<FamiliaMembro[]> {
  const db = createServiceClient()
  const { data } = await db
    .from('familia_membros')
    .select('*')
    .eq('user_id', userId)
    .eq('ativo', true)
    .order('created_at')
  return (data ?? []) as FamiliaMembro[]
}

export async function getMembroById(id: string, userId: string): Promise<FamiliaMembro | null> {
  const db = createServiceClient()
  const { data } = await db
    .from('familia_membros')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  return data as FamiliaMembro | null
}

// ── Registros ──────────────────────────────────────────────────────────────────

export async function getRegistrosRecentes(userId: string, limit = 10): Promise<FamiliaRegistro[]> {
  const db = createServiceClient()
  const { data } = await db
    .from('familia_registros')
    .select('*, membro:familia_membros(id, nome, emoji)')
    .eq('user_id', userId)
    .order('data_evento', { ascending: false })
    .limit(limit)
  return (data ?? []) as FamiliaRegistro[]
}

export async function getProximosEventos(userId: string): Promise<FamiliaRegistro[]> {
  const db = createServiceClient()
  const hoje = new Date().toISOString().split('T')[0]
  const em60dias = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data } = await db
    .from('familia_registros')
    .select('*, membro:familia_membros(id, nome, emoji)')
    .eq('user_id', userId)
    .neq('status', 'cancelado')
    .gte('data_proximo', hoje)
    .lte('data_proximo', em60dias)
    .order('data_proximo', { ascending: true })
    .limit(10)
  return (data ?? []) as FamiliaRegistro[]
}

export async function getRegistrosByMembro(membroId: string, userId: string): Promise<FamiliaRegistro[]> {
  const db = createServiceClient()
  const { data } = await db
    .from('familia_registros')
    .select('*, membro:familia_membros(id, nome, emoji)')
    .eq('user_id', userId)
    .eq('membro_id', membroId)
    .order('data_evento', { ascending: false })
  return (data ?? []) as FamiliaRegistro[]
}

export async function getRegistroById(id: string, userId: string): Promise<FamiliaRegistro | null> {
  const db = createServiceClient()
  const { data } = await db
    .from('familia_registros')
    .select('*, membro:familia_membros(id, nome, emoji)')
    .eq('id', id)
    .eq('user_id', userId)
    .single()
  return data as FamiliaRegistro | null
}

export function formatarData(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date(year, month - 1, day))
}

export function diasAteProximo(dateStr: string): number {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  const alvo = new Date(y, m - 1, d)
  return Math.round((alvo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
}
