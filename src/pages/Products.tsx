import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../lib/cart'
import { CartBar, Icon, Price, Thumb, TopBar } from '../components'
import type { Category, Product } from '../types'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [cats, setCats] = useState<Category[]>([])
  const [prods, setProds] = useState<Product[]>([])
  const [q, setQ] = useState(params.get('q') ?? '')
  const { add } = useCart()
  const cat = params.get('cat') ?? ''
  const urlQ = params.get('q') ?? ''
  // uma busca nova vinda de um link (ex.: banner) substitui o que estava digitado
  useEffect(() => setQ(urlQ), [urlQ])

  useEffect(() => {
    void api.categories().then(setCats)
    void api.products().then(setProds)
  }, [])

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return prods.filter(
      (p) => (!cat || p.category_id === cat) && (!t || [p.name, p.sku, p.description, ...p.notes].join(' ').toLowerCase().includes(t)),
    )
  }, [prods, cat, q])

  const pick = (id: string) => setParams(id ? { cat: id } : {})
  const current = cats.find((c) => c.id === cat)

  return (
    <>
      <TopBar />
      <div className="page has-cartbar">
        <h2 className="page-title">{current?.name ?? 'Catálogo'}</h2>
        <p className="page-sub">{list.length} {list.length === 1 ? 'produto' : 'produtos'} · peça pelo WhatsApp</p>
        <label className="search-box">
          <Icon name="search" />
          <input type="search" aria-label="Buscar" placeholder="Buscar aroma, nota, produto…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="chips">
          <button className={!cat ? 'on' : ''} aria-pressed={!cat} onClick={() => pick('')}>
            Todos
          </button>
          {cats.map((c) => (
            <button key={c.id} className={cat === c.id ? 'on' : ''} aria-pressed={cat === c.id} onClick={() => pick(c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        {list.length === 0 && <p className="muted center">Nenhum produto encontrado.</p>}
        <div className="grid">
          {list.map((p) => (
            <article key={p.id} className="card">
              <Link to={`/produto/${p.id}`}>
                {p.featured && <span className="tag">Mais pedido</span>}
                <Thumb p={p} />
                <h4>{p.name}</h4>
                <p className="notes">{p.notes.slice(0, 3).join(' · ')}</p>
              </Link>
              <div className="card-foot">
                <Price p={p} />
                <button className="round" disabled={p.stock <= 0} onClick={() => add(p)} aria-label={`Adicionar ${p.name} ao pedido`}>
                  <Icon name="plus" />
                </button>
              </div>
              {p.stock <= 0 && <div className="sold">Esgotado</div>}
            </article>
          ))}
        </div>
      </div>
      <CartBar />
    </>
  )
}
