import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../lib/cart'
import { Price, Thumb, TopBar } from '../components'
import { brl } from '../lib/config'
import type { Product } from '../types'

export default function ProductPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const [p, setP] = useState<Product | null | undefined>(undefined)
  const [qty, setQty] = useState(1)

  useEffect(() => void api.products().then((l) => setP(l.find((x) => x.id === id) ?? null)), [id])

  if (p === undefined) return <TopBar title="Produto" />
  if (p === null)
    return (
      <>
        <TopBar title="Produto" />
        <p className="muted center">Produto não encontrado.</p>
      </>
    )

  return (
    <>
      <TopBar title="Detalhes" />
      <div className="page pdp">
        <Thumb p={p} big />
        <h2>{p.name}</h2>
        <Price p={p} />
        {p.notes.length > 0 && (
          <div className="note-chips">
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
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => Math.min(p.stock, q + 1))}>+</button>
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
