import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, demoMode, supabase } from '../lib/api'
import { DEMO_PIN, brl } from '../lib/config'
import type { Category, Order, OrderStatus, Product } from '../types'

type Tab = 'resumo' | 'pedidos' | 'balcao' | 'estoque'
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  novo: ['confirmado', 'cancelado'],
  confirmado: ['entregue', 'cancelado'],
  entregue: ['cancelado'],
  cancelado: [],
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => (demoMode ? sessionStorage.getItem('lumiar:pin') === '1' : false))

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!authed) return <Login onDemo={() => setAuthed(true)} />
  return <Panel onLogout={() => (supabase ? void supabase.auth.signOut() : (sessionStorage.removeItem('lumiar:pin'), setAuthed(false)))} />
}

function Login({ onDemo }: { onDemo: () => void }) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [err, setErr] = useState('')
  const go = async () => {
    setErr('')
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: a, password: b })
      if (error) setErr('E-mail ou senha incorretos.')
    } else if (a === DEMO_PIN) {
      sessionStorage.setItem('lumiar:pin', '1')
      onDemo()
    } else setErr('PIN incorreto.')
  }
  return (
    <div className="page login">
      <Link to="/" className="muted">
        ← Voltar à loja
      </Link>
      <h2>Área da loja</h2>
      {demoMode ? (
        <>
          <p className="muted small">Modo demonstração (sem Supabase). Dados ficam só neste navegador. PIN padrão: <b>{DEMO_PIN}</b></p>
          <input type="password" placeholder="PIN" value={a} onChange={(e) => setA(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
        </>
      ) : (
        <>
          <input placeholder="E-mail" value={a} onChange={(e) => setA(e.target.value)} />
          <input type="password" placeholder="Senha" value={b} onChange={(e) => setB(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
        </>
      )}
      {err && <p className="error">{err}</p>}
      <button className="btn dark" onClick={go}>
        Entrar
      </button>
    </div>
  )
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('resumo')
  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const reload = useCallback(async () => {
    const [p, o, c] = await Promise.all([api.products(true), api.orders(), api.categories()])
    setProducts(p)
    setOrders(o)
    setCats(c)
  }, [])
  useEffect(() => void reload(), [reload])

  const novos = orders.filter((o) => o.status === 'novo').length

  return (
    <div className="admin">
      <header className="admin-top">
        <b>Casa Lumiar · Painel</b>
        <span>
          <Link to="/">Loja</Link> · <button className="link" onClick={onLogout}>Sair</button>
        </span>
      </header>
      <div className="seg tabs">
        {(['resumo', 'pedidos', 'balcao', 'estoque'] as Tab[]).map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {{ resumo: 'Resumo', pedidos: 'Pedidos', balcao: 'Balcão', estoque: 'Estoque' }[t]}
            {t === 'pedidos' && novos > 0 && <i className="badge static">{novos}</i>}
          </button>
        ))}
      </div>
      <div className="page">
        {tab === 'resumo' && <Summary orders={orders} products={products} />}
        {tab === 'pedidos' && <Orders orders={orders} reload={reload} />}
        {tab === 'balcao' && <Pos products={products} reload={reload} />}
        {tab === 'estoque' && <Stock products={products} cats={cats} reload={reload} />}
      </div>
    </div>
  )
}

function Summary({ orders, products }: { orders: Order[]; products: Product[] }) {
  const today = new Date().toDateString()
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const sum = (l: Order[]) => l.reduce((s, o) => s + o.total, 0)
  const todayOrders = valid.filter((o) => new Date(o.created_at).toDateString() === today)
  const month = valid.filter((o) => new Date(o.created_at).getMonth() === new Date().getMonth())
  const low = products.filter((p) => p.active && p.stock <= 3)
  return (
    <>
      <div className="kpis">
        <div><small>Vendas hoje</small><b>{brl(sum(todayOrders))}</b><em>{todayOrders.length} pedidos</em></div>
        <div><small>No mês</small><b>{brl(sum(month))}</b><em>{month.length} pedidos</em></div>
        <div><small>Novos pedidos</small><b>{orders.filter((o) => o.status === 'novo').length}</b><em>aguardando</em></div>
        <div><small>Estoque baixo</small><b>{low.length}</b><em>≤ 3 un.</em></div>
      </div>
      <h3>Atenção ao estoque</h3>
      {low.length === 0 && <p className="muted">Tudo certo por aqui.</p>}
      {low.map((p) => (
        <div key={p.id} className="row">
          <span>{p.name}</span>
          <b className={p.stock === 0 ? 'bad' : ''}>{p.stock} un.</b>
        </div>
      ))}
    </>
  )
}

function Orders({ orders, reload }: { orders: Order[]; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState<OrderStatus | ''>('')
  const list = orders.filter((o) => !filter || o.status === filter)
  const change = async (id: string, s: OrderStatus) => {
    await api.setStatus(id, s)
    await reload()
  }
  return (
    <>
      <div className="chips">
        {(['', 'novo', 'confirmado', 'entregue', 'cancelado'] as const).map((s) => (
          <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>
            {s || 'Todos'}
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="muted center">Nenhum pedido.</p>}
      {list.map((o) => (
        <article key={o.id} className="order">
          <div className="row">
            <b>{o.code}</b>
            <span className={`st ${o.status}`}>{o.status}</span>
          </div>
          <small className="muted">
            {new Date(o.created_at).toLocaleString('pt-BR')} · {o.source === 'balcao' ? 'Balcão' : 'Catálogo'}
          </small>
          <p>
            {o.customer_name || 'Cliente balcão'} {o.phone && `· ${o.phone}`}
          </p>
          <ul>
            {o.items.map((i) => (
              <li key={i.id}>
                {i.qty}x {i.name} — {brl(i.price * i.qty)}
              </li>
            ))}
          </ul>
          {o.address && <small>📍 {o.address}</small>}
          <div className="row">
            <b>{brl(o.total)} · {o.payment}</b>
            <span className="actions">
              {NEXT[o.status].map((s) => (
                <button key={s} className={s === 'cancelado' ? 'ghost' : 'mini-btn'} onClick={() => change(o.id, s)}>
                  {s}
                </button>
              ))}
            </span>
          </div>
        </article>
      ))}
    </>
  )
}

function Pos({ products, reload }: { products: Product[]; reload: () => Promise<void> }) {
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [payment, setPayment] = useState('PIX')
  const [done, setDone] = useState('')
  const found = useMemo(() => {
    const t = q.trim().toLowerCase()
    return products.filter((p) => p.active && p.stock > 0 && (!t || (p.name + p.sku).toLowerCase().includes(t))).slice(0, 8)
  }, [products, q])
  const items = Object.entries(cart).flatMap(([id, qty]) => {
    const p = products.find((x) => x.id === id)
    return p ? [{ p, qty }] : []
  })
  const price = (p: Product) => (payment === 'PIX' && p.pix_price ? p.pix_price : p.price)
  const total = items.reduce((s, i) => s + price(i.p) * i.qty, 0)

  const finish = async () => {
    const o = await api.createOrder({
      customer_name: '',
      phone: '',
      delivery: 'balcao',
      address: '',
      payment,
      notes: '',
      items: items.map((i) => ({ id: i.p.id, name: i.p.name, qty: i.qty, price: price(i.p) })),
      total,
      source: 'balcao',
    })
    setCart({})
    setDone(o.code)
    await reload()
  }

  return (
    <>
      <input className="search" placeholder="Buscar produto ou SKU" value={q} onChange={(e) => setQ(e.target.value)} />
      {found.map((p) => (
        <div key={p.id} className="row pick" onClick={() => setCart((c) => ({ ...c, [p.id]: Math.min(p.stock, (c[p.id] ?? 0) + 1) }))}>
          <span>{p.name}<small> · {p.stock} un.</small></span>
          <b>{brl(price(p))} +</b>
        </div>
      ))}
      <h3>Venda atual</h3>
      {items.length === 0 && <p className="muted">Toque num produto para adicionar.</p>}
      {items.map(({ p, qty }) => (
        <div key={p.id} className="row">
          <span>{qty}x {p.name}</span>
          <button className="ghost" onClick={() => setCart(({ [p.id]: _, ...r }) => r)}>remover</button>
        </div>
      ))}
      <div className="seg">
        {['PIX', 'Dinheiro', 'Cartão'].map((m) => (
          <button key={m} className={payment === m ? 'on' : ''} onClick={() => setPayment(m)}>{m}</button>
        ))}
      </div>
      <div className="total"><span>Total</span><b>{brl(total)}</b></div>
      <button className="btn dark" disabled={!items.length} onClick={finish}>Registrar venda</button>
      {done && <p className="muted center">Venda {done} registrada e estoque atualizado.</p>}
    </>
  )
}

const blank = { name: '', sku: '', category_id: 'velas', price: 0, pix_price: null, stock: 0, description: '', notes: [], image_url: null, featured: false, active: true } as Partial<Product> & { name: string }

function Stock({ products, cats, reload }: { products: Product[]; cats: Category[]; reload: () => Promise<void> }) {
  const [edit, setEdit] = useState<(Partial<Product> & { name: string }) | null>(null)
  const [q, setQ] = useState('')
  const list = products.filter((p) => !q || (p.name + p.sku).toLowerCase().includes(q.toLowerCase()))
  const save = async () => {
    if (!edit || !edit.name.trim()) return
    await api.saveProduct(edit)
    setEdit(null)
    await reload()
  }
  const num = (v: string) => (v === '' ? 0 : Number(v.replace(',', '.')) || 0)

  if (edit)
    return (
      <>
        <h3>{edit.id ? 'Editar produto' : 'Novo produto'}</h3>
        <input placeholder="Nome" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
        <input placeholder="SKU" value={edit.sku ?? ''} onChange={(e) => setEdit({ ...edit, sku: e.target.value })} />
        <select value={edit.category_id} onChange={(e) => setEdit({ ...edit, category_id: e.target.value })}>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="two">
          <label>Preço<input inputMode="decimal" value={edit.price ?? 0} onChange={(e) => setEdit({ ...edit, price: num(e.target.value) })} /></label>
          <label>Preço PIX<input inputMode="decimal" value={edit.pix_price ?? ''} onChange={(e) => setEdit({ ...edit, pix_price: e.target.value ? num(e.target.value) : null })} /></label>
          <label>Estoque<input inputMode="numeric" value={edit.stock ?? 0} onChange={(e) => setEdit({ ...edit, stock: Math.round(num(e.target.value)) })} /></label>
        </div>
        <input placeholder="Notas olfativas (separadas por vírgula)" value={(edit.notes ?? []).join(', ')} onChange={(e) => setEdit({ ...edit, notes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
        <textarea placeholder="Descrição" value={edit.description ?? ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
        <input placeholder="URL da foto (opcional)" value={edit.image_url ?? ''} onChange={(e) => setEdit({ ...edit, image_url: e.target.value || null })} />
        <label className="check"><input type="checkbox" checked={!!edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Destaque (Mais pedido)</label>
        <label className="check"><input type="checkbox" checked={edit.active !== false} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Visível no catálogo</label>
        <div className="row">
          <button className="btn dark grow" onClick={save}>Salvar</button>
          <button className="btn light" onClick={() => setEdit(null)}>Cancelar</button>
        </div>
        {edit.id && (
          <button className="ghost danger" onClick={async () => { if (confirm('Excluir este produto?')) { await api.deleteProduct(edit.id!); setEdit(null); await reload() } }}>
            Excluir produto
          </button>
        )}
      </>
    )

  return (
    <>
      <div className="row">
        <input className="search" placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn dark" onClick={() => setEdit({ ...blank })}>+ Novo</button>
      </div>
      {list.map((p) => (
        <div key={p.id} className="row stock-row">
          <span onClick={() => setEdit(p)} className="grow">
            {p.name}
            <small> {p.sku} {!p.active && '· oculto'}</small>
          </span>
          <div className="stepper sm">
            <button onClick={async () => { await api.saveProduct({ ...p, stock: Math.max(0, p.stock - 1) }); await reload() }}>−</button>
            <span className={p.stock <= 3 ? 'bad' : ''}>{p.stock}</span>
            <button onClick={async () => { await api.saveProduct({ ...p, stock: p.stock + 1 }); await reload() }}>+</button>
          </div>
        </div>
      ))}
    </>
  )
}
