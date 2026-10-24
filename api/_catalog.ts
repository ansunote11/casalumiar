import type { Product } from '../src/types'

// Leitura pública do catálogo no Supabase (mesma chave publicável do site; só lê produtos ativos).
const URL = process.env.VITE_SUPABASE_URL || 'https://upfxtwbyhbyzyhbplght.supabase.co'
const KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZYuEREkayXieGUJFBGRaxw_GLDY2iDs'

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${URL}/rest/v1/${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } })
  if (!r.ok) throw new Error(`Supabase ${r.status}`)
  return (await r.json()) as T
}

export const activeProducts = async () =>
  (await get<Product[]>('products?select=*&active=eq.true')).map((p) => ({ ...p, sizes: p.sizes ?? [], notes: p.notes ?? [], inspiration: p.inspiration ?? '', pyramid: p.pyramid ?? null }))

export const categoryNames = async () => Object.fromEntries((await get<{ id: string; name: string }[]>('categories?select=id,name')).map((c) => [c.id, c.name]))

export const CACHE = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
