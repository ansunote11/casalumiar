import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, demoMode, orderTotal, supabase } from '../lib/api'
import { orderText } from '../lib/whatsapp'
import { DEMO_PIN, brl } from '../lib/config'
import type { Category, Order, OrderStatus, Product, Size } from '../types'
import { lineName, unitPrice } from '../lib/cart'
import { BrandLockup, Icon, Logo, type IconName } from '../components'

type Tab = 'resumo' | 'pedidos' | 'balcao' | 'estoque'
const plural = (n: number) => `${n} ${n === 1 ? 'pedido' : 'pedidos'}`
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
      <Logo size={44} />
      <br />
      <Link to="/" className="muted">
        ← Voltar à loja
      </Link>
      <h2>Área da loja</h2>
      {demoMode ? (
        <>
          <p className="muted small">Modo demonstração (sem Supabase). Dados ficam só neste navegador. PIN padrão: <b>{DEMO_PIN}</b></p>
          <input type="password" aria-label="PIN" placeholder="PIN" value={a} onChange={(e) => setA(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
        </>
      ) : (
        <>
          <input type="email" aria-label="E-mail" placeholder="E-mail" value={a} onChange={(e) => setA(e.target.value)} />
          <input type="password" aria-label="Senha" placeholder="Senha" value={b} onChange={(e) => setB(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && go()} />
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
  const TABS: { id: Tab; label: string; icon: IconName; title: string; sub: string }[] = [
    { id: 'resumo', label: 'Visão geral', icon: 'chart', title: 'Visão geral', sub: 'Vendas, estoque e catálogo — tudo em um só lugar.' },
    { id: 'balcao', label: 'Vendas no balcão', icon: 'store', title: 'Venda no balcão', sub: 'Registre a venda e o estoque baixa na hora.' },
    { id: 'pedidos', label: 'Pedidos', icon: 'orders', title: 'Pedidos', sub: 'Confirmar baixa o estoque; cancelar devolve.' },
    { id: 'estoque', label: 'Estoque e catálogo', icon: 'box', title: 'Estoque e catálogo', sub: 'Preços, fotos, quantidades e o que aparece na loja.' },
  ]
  const cur = TABS.find((t) => t.id === tab)!

  return (
    <div className="admin">
      <aside className="side">
        <div className="side-brand">
          <BrandLockup height={46} color="#d9b98f" />
          <small>Painel da loja</small>
        </div>
        <nav aria-label="Seções do painel">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
              <Icon name={t.icon} />
              {t.label}
              {t.id === 'pedidos' && novos > 0 && <i className="badge static">{novos}</i>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <small>Link do catálogo</small>
          <span style={{ wordBreak: 'break-all' }}>{window.location.origin + window.location.pathname}</span>
          <a href={`https://wa.me/?text=${encodeURIComponent('Conheça o catálogo da Casa Lumiar: ' + window.location.origin + window.location.pathname)}`} target="_blank" rel="noreferrer">
            Compartilhar no WhatsApp
          </a>
          <Link to="/" className="link">Ver loja</Link>
          <button className="link" onClick={onLogout}>Sair</button>
        </div>
      </aside>
      <main className="main">
        <div className="main-head">
          <div>
            <h1>{cur.title}</h1>
            <p>{cur.sub}</p>
          </div>
          {tab === 'resumo' && (
            <div className="actions">
              <button className="btn light" onClick={() => setTab('estoque')}>+ Novo produto</button>
              <button className="btn wood" onClick={() => setTab('balcao')}>Registrar venda no balcão</button>
            </div>
          )}
        </div>
        {tab === 'resumo' && <Summary orders={orders} products={products} go={setTab} />}
        {tab === 'pedidos' && <Orders orders={orders} products={products} reload={reload} />}
        {tab === 'balcao' && <div className="panel"><Pos products={products} reload={reload} /></div>}
        {tab === 'estoque' && <div className="panel"><Stock products={products} cats={cats} reload={reload} /></div>}
      </main>
    </div>
  )
}

function Summary({ orders, products, go }: { orders: Order[]; products: Product[]; go: (t: Tab) => void }) {
  const today = new Date().toDateString()
  const valid = orders.filter((o) => o.status !== 'cancelado')
  const sum = (l: Order[]) => l.reduce((s, o) => s + o.total, 0)
  const todayOrders = valid.filter((o) => new Date(o.created_at).toDateString() === today)
  const now = new Date()
  const month = valid.filter((o) => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const low = products.filter((p) => p.active && p.stock <= 3).sort((a, b) => a.stock - b.stock)
  return (
    <>
      <div className="kpis">
        <div><small>Vendas hoje</small><b>{brl(sum(todayOrders))}</b><em>{plural(todayOrders.length)} · balcão + WhatsApp</em></div>
        <div><small>No mês</small><b>{brl(sum(month))}</b><em>{plural(month.length)}</em></div>
        <div><small>Novos pedidos</small><b>{orders.filter((o) => o.status === 'novo').length}</b><em>aguardando confirmação</em></div>
        <div className="hl"><small>Estoque baixo</small><b>{low.length} {low.length === 1 ? 'item' : 'itens'}</b><em>até 3 unidades</em></div>
      </div>
      <div className="cols" style={{ marginTop: 18 }}>
        <section className="panel" style={{ flexGrow: 3 }}>
          <div className="row" style={{ paddingTop: 0 }}>
            <h3 style={{ margin: 0 }}>Pedidos recentes</h3>
            <button className="link" onClick={() => go('pedidos')}>Ver todos</button>
          </div>
          {orders.length === 0 && <p className="muted">Nenhum pedido ainda. Compartilhe o link do catálogo!</p>}
          {orders.slice(0, 6).map((o) => (
            <div key={o.id} className="row stock-row">
              <span className="grow">
                {o.customer_name || 'Cliente balcão'}
                <small> · {o.code} · {o.source === 'balcao' ? 'Balcão' : 'WhatsApp'}</small>
              </span>
              <b>{brl(o.total)}</b>
              <span className={`st ${o.status}`}>{o.status}</span>
            </div>
          ))}
        </section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flexGrow: 2 }}>
          <section className="panel">
            <h3 style={{ marginTop: 0 }}>Estoque baixo</h3>
            {low.length === 0 && <p className="muted">Tudo certo por aqui.</p>}
            {low.slice(0, 6).map((p) => (
              <div key={p.id}>
                <div className="row" style={{ paddingBottom: 6 }}>
                  <span>{p.name}</span>
                  <small className={p.stock === 0 ? 'bad' : ''}>{p.stock} un.</small>
                </div>
                <div className="bar"><i style={{ width: `${Math.max(4, (p.stock / 3) * 100)}%` }} /></div>
              </div>
            ))}
          </section>
          <section className="ai">
            <h3><Icon name="spark" /> Assistente 24h</h3>
            <p>Atendimento automático no WhatsApp: tira dúvidas sobre aromas, envia o link do catálogo e informa horários.</p>
            <small>Próxima etapa — precisa de uma conta na API oficial do WhatsApp (Meta).</small>
          </section>
        </div>
      </div>
    </>
  )
}

function Orders({ orders, products, reload }: { orders: Order[]; products: Product[]; reload: () => Promise<void> }) {
  const [filter, setFilter] = useState<OrderStatus | ''>('')
  const [editing, setEditing] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const list = orders.filter((o) => !filter || o.status === filter)
  const count = (s: OrderStatus | '') => (s ? orders.filter((o) => o.status === s).length : orders.length)
  const change = async (id: string, s: OrderStatus) => {
    await api.setStatus(id, s)
    await reload()
  }
  const copy = async (o: Order) => {
    try {
      await navigator.clipboard.writeText(orderText(o))
      setCopied(o.id)
      setTimeout(() => setCopied((c) => (c === o.id ? null : c)), 2000)
    } catch {
      setCopied(null)
    }
  }
  const remove = async (o: Order) => {
    const back = o.status === 'confirmado' || o.status === 'entregue' ? ' Os itens voltam para o estoque.' : ''
    if (!confirm(`Apagar o pedido ${o.code} de vez? Isso não pode ser desfeito.${back}`)) return
    await api.deleteOrder(o.id)
    await reload()
  }
  return (
    <>
      <div className="chips">
        {(['', 'novo', 'confirmado', 'entregue', 'cancelado'] as const).map((s) => (
          <button key={s} className={filter === s ? 'on' : ''} aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s || 'Todos'} <small>{count(s)}</small>
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="muted center">Nenhum pedido.</p>}
      {list.map((o) =>
        editing === o.id ? (
          <OrderEditor
            key={o.id}
            order={o}
            products={products}
            onDone={async (saved) => {
              setEditing(null)
              if (saved) await reload()
            }}
          />
        ) : (
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
              {o.items.map((i, n) => (
                <li key={i.id + n}>
                  {i.qty}x {i.name} — {brl(i.price * i.qty)}
                </li>
              ))}
            </ul>
            {o.address && <small>Endereço: {o.address}</small>}
            {o.notes && <small className="block">Obs.: {o.notes}</small>}
            <div className="row">
              <b>{brl(o.total)} · {o.payment}</b>
              <span className="actions">
                {NEXT[o.status].map((s) => (
                  <button key={s} className={s === 'cancelado' ? 'ghost' : 'mini-btn'} onClick={() => change(o.id, s)}>
                    {s === 'cancelado' ? 'cancelar' : s}
                  </button>
                ))}
              </span>
            </div>
            <div className="tools" role="group" aria-label={`Ações do pedido ${o.code}`}>
              <button onClick={() => setEditing(o.id)}><Icon name="edit" />Editar</button>
              <button onClick={() => copy(o)}><Icon name="copy" />{copied === o.id ? 'Copiado!' : 'Copiar'}</button>
              <button className="danger" onClick={() => remove(o)}><Icon name="trash" />Apagar</button>
            </div>
          </article>
        ),
      )}
    </>
  )
}

const PAYMENTS = ['PIX', 'Dinheiro', 'Cartão']

function OrderEditor({ order, products, onDone }: { order: Order; products: Product[]; onDone: (saved: boolean) => void }) {
  const [f, setF] = useState(() => ({ ...order, items: order.items.map((i) => ({ ...i })) }))
  const [pick, setPick] = useState('')
  const [busy, setBusy] = useState(false)
  const options = useMemo(
    () => products.flatMap((p) => (p.sizes.length ? p.sizes.map((s) => ({ key: `${p.id}|${s.label}`, p, size: s.label as string | null })) : [{ key: p.id, p, size: null }])),
    [products],
  )
  const setItem = (n: number, qty: number) => setF((x) => ({ ...x, items: qty <= 0 ? x.items.filter((_, k) => k !== n) : x.items.map((i, k) => (k === n ? { ...i, qty } : i)) }))
  const addItem = () => {
    const o = options.find((x) => x.key === pick)
    if (!o) return
    const name = lineName({ product: o.p, size: o.size })
    setF((x) => {
      const same = x.items.findIndex((i) => i.id === o.p.id && i.name === name)
      if (same >= 0) return { ...x, items: x.items.map((i, k) => (k === same ? { ...i, qty: i.qty + 1 } : i)) }
      return { ...x, items: [...x.items, { id: o.p.id, name, qty: 1, price: unitPrice(o.p, o.size, x.payment === 'PIX') }] }
    })
    setPick('')
  }
  const save = async () => {
    if (!f.items.length) return alert('O pedido precisa de pelo menos um item. Para tirar o pedido, use Apagar ou Cancelar.')
    setBusy(true)
    try {
      await api.updateOrder(order.id, { customer_name: f.customer_name, phone: f.phone, delivery: f.delivery, address: f.address, payment: f.payment, notes: f.notes, items: f.items })
      onDone(true)
    } finally {
      setBusy(false)
    }
  }
  return (
    <article className="order editing" aria-label={`Editando o pedido ${order.code}`}>
      <div className="row">
        <b>Editando {order.code}</b>
        <span className={`st ${order.status}`}>{order.status}</span>
      </div>
      <div className="two">
        <label>Cliente<input value={f.customer_name} onChange={(e) => setF({ ...f, customer_name: e.target.value })} /></label>
        <label>Telefone<input inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <label>Recebimento
          <select value={f.delivery} onChange={(e) => setF({ ...f, delivery: e.target.value as Order['delivery'] })}>
            <option value="entrega">Entrega</option>
            <option value="retirada">Retirada</option>
            <option value="balcao">Balcão</option>
          </select>
        </label>
      </div>
      {f.delivery === 'entrega' && <input aria-label="Endereço" placeholder="Endereço" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />}
      <div className="seg">
        {PAYMENTS.map((m) => (
          <button key={m} className={f.payment === m ? 'on' : ''} aria-pressed={f.payment === m} onClick={() => setF({ ...f, payment: m })}>{m}</button>
        ))}
      </div>
      <h4 className="label">Itens</h4>
      {f.items.map((i, n) => (
        <div key={i.id + n} className="row">
          <span className="grow">{i.name}<small> · {brl(i.price)} cada</small></span>
          <div className="stepper sm">
            <button onClick={() => setItem(n, i.qty - 1)} aria-label={`Diminuir ${i.name}`}>−</button>
            <span>{i.qty}</span>
            <button onClick={() => setItem(n, i.qty + 1)} aria-label={`Aumentar ${i.name}`}>+</button>
          </div>
        </div>
      ))}
      <div className="row">
        <select aria-label="Adicionar produto" value={pick} onChange={(e) => setPick(e.target.value)} style={{ margin: 0 }}>
          <option value="">Adicionar produto…</option>
          {options.map((o) => <option key={o.key} value={o.key}>{lineName({ product: o.p, size: o.size })}</option>)}
        </select>
        <button className="mini-btn" disabled={!pick} onClick={addItem}>Adicionar</button>
      </div>
      <textarea aria-label="Observações" placeholder="Observações" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
      {(order.status === 'confirmado' || order.status === 'entregue') && <p className="small muted">Este pedido já baixou o estoque: ao salvar, o estoque é ajustado pela diferença dos itens.</p>}
      <div className="row">
        <b>Total {brl(orderTotal(f.items))}</b>
        <span className="actions">
          <button className="ghost" onClick={() => onDone(false)}>Descartar</button>
          <button className="mini-btn" disabled={busy} onClick={save}>{busy ? 'Salvando…' : 'Salvar'}</button>
        </span>
      </div>
    </article>
  )
}

function Pos({ products, reload }: { products: Product[]; reload: () => Promise<void> }) {
  const [q, setQ] = useState('')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [payment, setPayment] = useState('PIX')
  const [done, setDone] = useState('')
  // cada tamanho de um perfume vira uma opção própria (chave "id|100 mL")
  const options = useMemo(
    () => products.flatMap((p) => (p.sizes.length ? p.sizes.map((s) => ({ key: `${p.id}|${s.label}`, p, size: s.label as string | null })) : [{ key: p.id, p, size: null }])),
    [products],
  )
  const found = useMemo(() => {
    const t = q.trim().toLowerCase()
    return options.filter(({ p }) => p.active && p.stock > 0 && (!t || (p.name + p.sku).toLowerCase().includes(t))).slice(0, 10)
  }, [options, q])
  const items = Object.entries(cart).flatMap(([key, qty]) => {
    const o = options.find((x) => x.key === key)
    return o ? [{ ...o, qty }] : []
  })
  const price = (p: Product, size: string | null) => unitPrice(p, size, payment === 'PIX')
  const total = items.reduce((s, i) => s + price(i.p, i.size) * i.qty, 0)

  const finish = async () => {
    const o = await api.createOrder({
      customer_name: '',
      phone: '',
      delivery: 'balcao',
      address: '',
      payment,
      notes: '',
      items: items.map((i) => ({ id: i.p.id, name: lineName({ product: i.p, size: i.size }), qty: i.qty, price: price(i.p, i.size) })),
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
      {found.map(({ key, p, size }) => (
        <button key={key} className="row pick" onClick={() => setCart((c) => ({ ...c, [key]: Math.min(p.stock, (c[key] ?? 0) + 1) }))}>
          <span>{lineName({ product: p, size })}<small> · {p.stock} un.</small></span>
          <b>{brl(price(p, size))} +</b>
        </button>
      ))}
      <h3>Venda atual</h3>
      {items.length === 0 && <p className="muted">Toque num produto para adicionar.</p>}
      {items.map(({ key, p, size, qty }) => (
        <div key={key} className="row">
          <span>{qty}x {lineName({ product: p, size })}</span>
          <button className="ghost" onClick={() => setCart(({ [key]: _, ...r }) => r)}>remover</button>
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

const blank = { name: '', sku: '', category_id: 'velas', price: 0, pix_price: null, stock: 0, description: '', notes: [], image_url: null, featured: false, active: true, sizes: [], inspiration: '', pyramid: null } as Partial<Product> & { name: string }

// Tamanhos no editor: uma linha por tamanho, "100 mL; 189,32; 136,49" (preço PIX opcional)
const sizesToText = (sizes: Size[] = []) => sizes.map((s) => [s.label, s.price, s.pix_price ?? ''].join('; ').replace(/\./g, ',')).join('\n')
const textToSizes = (t: string): Size[] =>
  t.split('\n').flatMap((line) => {
    const [label, price, pix] = line.split(';').map((x) => x.trim())
    const n = (v?: string) => (v ? Number(v.replace(',', '.')) : NaN)
    return label && !isNaN(n(price)) ? [{ label, price: n(price), pix_price: isNaN(n(pix)) ? null : n(pix) }] : []
  })

function Stock({ products, cats, reload }: { products: Product[]; cats: Category[]; reload: () => Promise<void> }) {
  const [edit, setEdit] = useState<(Partial<Product> & { name: string }) | null>(null)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('')
  const list = products.filter((p) => (!tab || p.category_id === tab) && (!q || (p.name + p.sku).toLowerCase().includes(q.toLowerCase())))
  const save = async () => {
    if (!edit || !edit.name.trim()) return
    const sizes = edit.sizes ?? []
    // com tamanhos, o preço de vitrine ("a partir de") é o do menor tamanho
    const cheapest = sizes.length ? sizes.reduce((a, b) => (b.price < a.price ? b : a)) : null
    await api.saveProduct(cheapest ? { ...edit, price: cheapest.price, pix_price: cheapest.pix_price } : edit)
    setEdit(null)
    await reload()
  }
  const num = (v: string) => (v === '' ? 0 : Number(v.replace(',', '.')) || 0)

  if (edit)
    return (
      <>
        <h3>{edit.id ? 'Editar produto' : edit.name.endsWith('(cópia)') ? 'Novo produto (cópia)' : 'Novo produto'}</h3>
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
        <label className="small muted">Tamanhos (um por linha: tamanho; preço; preço PIX). Deixe vazio para preço único.
          <textarea key={edit.id ?? 'novo'} defaultValue={sizesToText(edit.sizes)} placeholder={'100 mL; 189,32; 136,49\n50 mL; 131,86; 95,44'} onBlur={(e) => setEdit({ ...edit, sizes: textToSizes(e.target.value) })} />
        </label>
        <input placeholder="Inspirado em (opcional)" value={edit.inspiration ?? ''} onChange={(e) => setEdit({ ...edit, inspiration: e.target.value })} />
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

  const counts = (id: string) => products.filter((p) => !id || p.category_id === id).length
  const duplicate = (p: Product) => {
    const { id: _, ...rest } = p
    // a cópia nasce oculta e sem estoque: só aparece no catálogo depois de revisada
    setEdit({ ...rest, name: `${p.name} (cópia)`, sku: p.sku ? `${p.sku}-C` : '', stock: 0, active: false })
  }
  const remove = async (p: Product) => {
    if (!confirm(`Apagar "${p.name}" do catálogo de vez? Isso não pode ser desfeito.`)) return
    await api.deleteProduct(p.id)
    await reload()
  }

  return (
    <>
      <div className="chips" role="tablist" aria-label="Categorias">
        {[{ id: '', name: 'Todos' }, ...cats].map((c) => (
          <button key={c.id} role="tab" aria-selected={tab === c.id} className={tab === c.id ? 'on' : ''} onClick={() => setTab(c.id)}>
            {c.name} <small>{counts(c.id)}</small>
          </button>
        ))}
      </div>
      <div className="row">
        <input className="search" placeholder="Buscar nesta aba" value={q} onChange={(e) => setQ(e.target.value)} style={{ margin: 0 }} />
        <button className="btn dark" onClick={() => setEdit({ ...blank, category_id: tab || blank.category_id })}>+ Novo</button>
      </div>
      {list.length === 0 && <p className="muted center">Nenhum produto nesta aba.</p>}
      {list.map((p) => (
        <div key={p.id} className="row stock-row">
          <button onClick={() => setEdit(p)} className="grow">
            {p.name}
            <span className="meta">
              {p.sku}
              {!tab && ` · ${cats.find((c) => c.id === p.category_id)?.name ?? p.category_id}`}
              {p.sizes.length > 0 && ` · ${p.sizes.map((s) => s.label).join(' / ')}`}
              {!p.active && ' · oculto'}
            </span>
          </button>
          <div className="stepper sm" aria-label={`Estoque de ${p.name}`}>
            <button aria-label="Tirar 1 do estoque" onClick={async () => { await api.saveProduct({ ...p, stock: Math.max(0, p.stock - 1) }); await reload() }}>−</button>
            <span className={p.stock <= 3 ? 'bad' : ''}>{p.stock}</span>
            <button aria-label="Pôr 1 no estoque" onClick={async () => { await api.saveProduct({ ...p, stock: p.stock + 1 }); await reload() }}>+</button>
          </div>
          <div className="tools" role="group" aria-label={`Ações de ${p.name}`}>
            <button onClick={() => setEdit(p)} aria-label={`Editar ${p.name}`}><Icon name="edit" /><span>Editar</span></button>
            <button onClick={() => duplicate(p)} aria-label={`Duplicar ${p.name}`}><Icon name="duplicate" /><span>Duplicar</span></button>
            <button className="danger" onClick={() => remove(p)} aria-label={`Apagar ${p.name}`}><Icon name="trash" /><span>Apagar</span></button>
          </div>
        </div>
      ))}
    </>
  )
}
