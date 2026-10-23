import { createClient } from '@supabase/supabase-js'
import type { Category, NewOrder, Order, OrderItem, OrderStatus, OrderUpdate, Product, Ratings } from '../types'
import { SEED_VERSION, seedCategories, seedProducts } from './seed'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && key ? createClient(url, key) : null
export const demoMode = !supabase

const held = (s: OrderStatus | null) => s === 'confirmado' || s === 'entregue'
/** +1 = baixar estoque, -1 = devolver, 0 = nada */
export const stockEffect = (prev: OrderStatus | null, next: OrderStatus) => Number(held(next)) - Number(held(prev))

const uid = () => crypto.randomUUID()
export const orderTotal = (items: OrderItem[]) => Math.round(items.reduce((s, i) => s + i.price * i.qty, 0) * 100) / 100
const orderCode = () => 'LUM-' + Math.random().toString(36).slice(2, 7).toUpperCase()

// ---------- backend local (demonstração, salva no navegador) ----------
const ls = {
  get<T>(k: string, fallback: T): T {
    try {
      const v = localStorage.getItem('lumiar:' + k)
      return v ? (JSON.parse(v) as T) : fallback
    } catch {
      return fallback
    }
  },
  set(k: string, v: unknown) {
    localStorage.setItem('lumiar:' + k, JSON.stringify(v))
  },
}

// Garante os campos novos (tamanhos, inspiração, pirâmide) em dados antigos ou sem migração.
const normalize = (p: Product): Product => ({ ...p, sizes: p.sizes ?? [], inspiration: p.inspiration ?? '', pyramid: p.pyramid ?? null })

// Modo demonstração: se a lista inicial mudou, recomeça os produtos salvos no navegador.
try {
  if (localStorage.getItem('lumiar:seed') !== String(SEED_VERSION)) {
    localStorage.removeItem('lumiar:products')
    localStorage.setItem('lumiar:seed', String(SEED_VERSION))
  }
} catch {
  /* navegador sem armazenamento: usa a lista inicial */
}

const applyLocalStock = (items: OrderItem[], sign: number) => {
  const prods = ls.get<Product[]>('products', seedProducts)
  for (const it of items) {
    const p = prods.find((x) => x.id === it.id)
    if (p) p.stock = Math.max(0, p.stock - sign * it.qty)
  }
  ls.set('products', prods)
}

const local = {
  async ratings(): Promise<Ratings> {
    const out: Ratings = {}
    for (const r of ls.get<{ id: string; stars: number }[]>('reviews', [])) {
      const cur = out[r.id] ?? { avg: 0, count: 0 }
      out[r.id] = { avg: (cur.avg * cur.count + r.stars) / (cur.count + 1), count: cur.count + 1 }
    }
    return out
  },
  async rate(id: string, stars: number) {
    ls.set('reviews', [...ls.get<{ id: string; stars: number }[]>('reviews', []), { id, stars }])
  },
  async categories() {
    return seedCategories
  },
  async products(all = false) {
    const p = ls.get<Product[]>('products', seedProducts).map(normalize)
    return all ? p : p.filter((x) => x.active)
  },
  async saveProduct(p: Partial<Product> & { name: string }) {
    const prods = ls.get<Product[]>('products', seedProducts)
    const i = prods.findIndex((x) => x.id === p.id)
    if (i >= 0) prods[i] = { ...prods[i], ...p }
    else prods.unshift({ id: uid(), sku: '', description: '', notes: [], category_id: 'velas', price: 0, pix_price: null, stock: 0, image_url: null, featured: false, active: true, sizes: [], inspiration: '', pyramid: null, ...p } as Product)
    ls.set('products', prods)
  },
  async deleteProduct(id: string) {
    ls.set('products', ls.get<Product[]>('products', seedProducts).filter((x) => x.id !== id))
  },
  async createOrder(o: NewOrder) {
    const status: OrderStatus = o.source === 'balcao' ? 'entregue' : 'novo'
    const order: Order = { ...o, id: uid(), code: orderCode(), status, created_at: new Date().toISOString() }
    ls.set('orders', [order, ...ls.get<Order[]>('orders', [])])
    if (stockEffect(null, status)) applyLocalStock(o.items, 1)
    return order
  },
  async orders() {
    return ls.get<Order[]>('orders', [])
  },
  async setStatus(id: string, next: OrderStatus) {
    const orders = ls.get<Order[]>('orders', [])
    const o = orders.find((x) => x.id === id)
    if (!o) return
    const fx = stockEffect(o.status, next)
    o.status = next
    ls.set('orders', orders)
    if (fx) applyLocalStock(o.items, fx)
  },
  async updateOrder(id: string, patch: OrderUpdate) {
    const orders = ls.get<Order[]>('orders', [])
    const o = orders.find((x) => x.id === id)
    if (!o) return
    // pedido que já baixou estoque: devolve os itens antigos e baixa os novos
    if (held(o.status) && patch.items) {
      applyLocalStock(o.items, -1)
      applyLocalStock(patch.items, 1)
    }
    Object.assign(o, patch, patch.items ? { total: orderTotal(patch.items) } : {})
    ls.set('orders', orders)
  },
  async deleteOrder(id: string) {
    const orders = ls.get<Order[]>('orders', [])
    const o = orders.find((x) => x.id === id)
    if (o && held(o.status)) applyLocalStock(o.items, -1)
    ls.set('orders', orders.filter((x) => x.id !== id))
  },
}

// ---------- backend Supabase ----------
const sb = {
  async ratings(): Promise<Ratings> {
    const { data, error } = await supabase!.from('product_ratings').select('*')
    if (error) return {} // sem a view (banco antigo) o catálogo segue sem estrelas
    return Object.fromEntries((data as { product_id: string; avg: number; count: number }[]).map((r) => [r.product_id, { avg: r.avg, count: r.count }]))
  },
  async rate(id: string, stars: number) {
    const { error } = await supabase!.from('reviews').insert({ product_id: id, stars })
    if (error) throw error
  },
  async categories() {
    const { data, error } = await supabase!.from('categories').select('*').order('sort')
    if (error) throw error
    return data as Category[]
  },
  async products(all = false) {
    let q = supabase!.from('products').select('*').order('name')
    if (!all) q = q.eq('active', true)
    const { data, error } = await q
    if (error) throw error
    return (data as Product[]).map(normalize)
  },
  async saveProduct(p: Partial<Product> & { name: string }) {
    const { error } = await supabase!.from('products').upsert(p.id ? p : { ...p, id: uid() })
    if (error) throw error
  },
  async deleteProduct(id: string) {
    const { error } = await supabase!.from('products').delete().eq('id', id)
    if (error) throw error
  },
  async createOrder(o: NewOrder) {
    const status: OrderStatus = o.source === 'balcao' ? 'entregue' : 'novo'
    const order: Order = { ...o, id: uid(), code: orderCode(), status, created_at: new Date().toISOString() }
    const { error } = await supabase!.from('orders').insert(order)
    if (error) throw error
    if (stockEffect(null, status)) await sb.applyStock(o.items, 1)
    return order
  },
  async applyStock(items: OrderItem[], sign: number) {
    const { error } = await supabase!.rpc('apply_stock', { p_items: items, p_sign: sign })
    if (error) throw error
  },
  async orders() {
    const { data, error } = await supabase!.from('orders').select('*').order('created_at', { ascending: false }).limit(300)
    if (error) throw error
    return data as Order[]
  },
  async setStatus(id: string, next: OrderStatus) {
    const { data, error } = await supabase!.from('orders').select('*').eq('id', id).single()
    if (error) throw error
    const o = data as Order
    const fx = stockEffect(o.status, next)
    const { error: e2 } = await supabase!.from('orders').update({ status: next }).eq('id', id)
    if (e2) throw e2
    if (fx) await sb.applyStock(o.items, fx)
  },
  async updateOrder(id: string, patch: OrderUpdate) {
    const { data, error } = await supabase!.from('orders').select('*').eq('id', id).single()
    if (error) throw error
    const o = data as Order
    const { error: e2 } = await supabase!.from('orders').update({ ...patch, ...(patch.items ? { total: orderTotal(patch.items) } : {}) }).eq('id', id)
    if (e2) throw e2
    if (held(o.status) && patch.items) {
      await sb.applyStock(o.items, -1)
      await sb.applyStock(patch.items, 1)
    }
  },
  async deleteOrder(id: string) {
    const { data, error } = await supabase!.from('orders').select('*').eq('id', id).single()
    if (error) throw error
    const o = data as Order
    const { error: e2 } = await supabase!.from('orders').delete().eq('id', id)
    if (e2) throw e2
    // apagar um pedido confirmado/entregue devolve os itens ao estoque
    if (held(o.status)) await sb.applyStock(o.items, -1)
  },
}

export const api = supabase ? sb : local
