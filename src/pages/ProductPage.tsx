import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { findSize, unitPrice, useCart } from '../lib/cart'
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
  const [size, setSize] = useState<string | null>(null)

  useEffect(() => {
    void api.products().then((l) => {
      const found = l.find((x) => x.id === id) ?? null
      setP(found)
      setSize(found?.sizes[0]?.label ?? null)
    })
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
  const chosen = findSize(p, size)
  const pyramid = p.pyramid && [
    ['Topo', p.pyramid.top],
    ['Coração', p.pyramid.heart],
    ['Fundo', p.pyramid.base],
  ]

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
        {p.inspiration && <p className="insp">Inspirado em {p.inspiration}</p>}
        {chosen ? <Price p={{ price: chosen.price, pix_price: chosen.pix_price, sizes: [] }} /> : <Price p={p} />}

        {p.sizes.length > 0 && (
          <>
            <h3 className="label">Tamanho</h3>
            <div className="seg sizes" role="radiogroup" aria-label="Tamanho">
              {p.sizes.map((s) => (
                <button key={s.label} role="radio" aria-checked={size === s.label} className={size === s.label ? 'on' : ''} onClick={() => setSize(s.label)}>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}

        {pyramid ? (
          <div className="pyramid" aria-label="Pirâmide olfativa">
            {pyramid.map(([label, notes]) => (
              <div key={label as string}>
                <small>{label as string}</small>
                <span>{(notes as string[]).join(' · ')}</span>
              </div>
            ))}
          </div>
        ) : (
          p.notes.length > 0 && (
            <div className="note-chips" aria-label="Notas olfativas">
              {p.notes.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          )
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
              add(p, qty, size)
              nav('/carrinho')
            }}
          >
            Adicionar · {brl(unitPrice(p, size) * qty)}
          </button>
        </div>
      </div>
    </>
  )
}
