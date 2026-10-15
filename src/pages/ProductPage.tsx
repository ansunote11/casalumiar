import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../lib/cart'
import { Icon, Price, Thumb, TopBar } from '../components'
import { brl } from '../lib/config'
import type { Category, Product } from '../types'

export default function ProductPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const [p, setP] = useState<Product | null | undefined>(undefined)
  const [cats, setCats] = useState<Category[]>([])
  const [qty, setQty] = useState(1)

  useEffect(() => {
    void api.products().then((l) => setP(l.find((x) => x.id === id) ?? null))
    void api.categories().then(setCats)
  }, [id])

  if (p === undefined) return <TopBar />
  if (p === null)
    return (
      <>
        <TopBar />
        <p className="muted center">Produto não encontrado.</p>
      </>
    )

  const share = () => {
    const url = window.location.href
    if (navigator.share) void navigator.share({ title: p.name, url })
    else void navigator.clipboard?.writeText(url)
  }

  return (
    <>
      <div className="pdp-hero">
        <Thumb p={p} big />
        <div className="nav">
          <button className="icon-btn solid" onClick={() => nav(-1)} aria-label="Voltar">
            <Icon name="back" />
          </button>
          <button className="icon-btn solid" onClick={share} aria-label="Compartilhar produto">
            <Icon name="share" />
          </button>
        </div>
      </div>
      <div className="page pdp" style={{ paddingTop: 20 }}>
        <span className="kicker">{cats.find((c) => c.id === p.category_id)?.name}</span>
        <h2>{p.name}</h2>
        <Price p={p} />
        {p.notes.length > 0 && (
          <div className="note-chips" aria-label="Notas olfativas">
            {p.notes.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        )}
        <h3>Descrição</h3>
        <p>{p.description || 'Aroma artesanal Casa Lumiar.'}</p>
        <p className="muted">{p.stock > 0 ? (p.stock <= 3 ? `Últimas ${p.stock} unidades` : 'Disponível') : 'Esgotado'}</p>

        <div className="buybar">
          <div className="stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))} aria-label="Aumentar quantidade">+</button>
          </div>
          <button
            className="btn dark grow"
            disabled={p.stock <= 0}
            onClick={() => {
              add(p, qty)
              nav('/carrinho')
            }}
          >
            Adicionar · {brl(p.price * qty)}
          </button>
        </div>
      </div>
    </>
  )
}
