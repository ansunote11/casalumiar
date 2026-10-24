import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { findSize, unitPrice, useCart } from '../lib/cart'
import { Icon, PageShade, PhotoViewer, Price, ShareSheet, StarInput, Stars, Thumb, TopBar } from '../components'
import { SITE_URL, brl } from '../lib/config'
import { findBySlug, productMeta, productPath } from '../lib/seo'
import { track } from '../lib/track'
import { useMeta } from '../lib/useMeta'
import { myVote, rememberVote } from '../lib/ratings'
import type { Category, Product, Rating } from '../types'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const [p, setP] = useState<Product | null | undefined>(undefined)
  const [cats, setCats] = useState<Category[]>([])
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState<string | null>(null)
  const [rating, setRating] = useState<Rating | undefined>(undefined)
  const [vote, setVote] = useState<number | null>(null)
  const [sharing, setSharing] = useState(false)
  const id = p?.id
  const [voteMsg, setVoteMsg] = useState('')
  const [viewing, setViewing] = useState(false)

  useEffect(() => {
    if (!id) return
    setVote(myVote(id))
    void api.ratings().then((r) => setRating(r[id]))
  }, [id])

  const rate = async (n: number) => {
    if (!id || vote) return
    try {
      await api.rate(id, n)
      rememberVote(id, n)
      setVote(n)
      setRating((r) => ({ avg: ((r?.avg ?? 0) * (r?.count ?? 0) + n) / ((r?.count ?? 0) + 1), count: (r?.count ?? 0) + 1 }))
      setVoteMsg('Obrigada pela avaliação!')
    } catch {
      setVoteMsg('Não foi possível registrar agora. Tente de novo.')
    }
  }

  useEffect(() => {
    void api.products().then((l) => {
      const found = findBySlug(l, slug)
      setP(found)
      setSize(found?.sizes[0]?.label ?? null)
      if (found) {
        track('view_product', { produto: found.name })
        // link antigo (com id) ou nome alterado: troca para o endereço amigável atual
        if (productPath(found) !== window.location.pathname) nav(productPath(found) + window.location.search, { replace: true })
      }
    })
    void api.categories().then(setCats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])
  useMeta(p ? productMeta(p, SITE_URL, cats.find((c) => c.id === p.category_id)?.name) : null)

  if (p === undefined) return <TopBar wave="b" />
  if (p === null)
    return (
      <>
        <TopBar wave="b" />
        <p className="muted center">Produto não encontrado.</p>
      </>
    )

  const chosen = findSize(p, size)
  const pyramid = p.pyramid && [
    ['Topo', p.pyramid.top],
    ['Coração', p.pyramid.heart],
    ['Fundo', p.pyramid.base],
  ]

  return (
    <>
      <PageShade side="left" />
      <TopBar
        wave="b"
        right={
          <button className="icon-btn" onClick={() => setSharing(true)} aria-label="Compartilhar produto" aria-haspopup="dialog">
            <Icon name="share" />
          </button>
        }
      />
      <div className="pdp-hero">
        {p.image_url ? (
          <button className="pdp-photo" onClick={() => setViewing(true)} aria-label={`Ver foto inteira de ${p.name}`}>
            <Thumb p={p} big />
            <span className="pdp-zoom" aria-hidden="true">
              <Icon name="zoom" />
            </span>
          </button>
        ) : (
          <Thumb p={p} big />
        )}
      </div>
      {sharing && <ShareSheet title={p.name} url={SITE_URL + productPath(p)} onClose={() => setSharing(false)} />}
      {viewing && p.image_url && <PhotoViewer src={`${import.meta.env.BASE_URL}${p.image_url}`} alt={p.name} onClose={() => setViewing(false)} />}
      <div className="page pdp" style={{ paddingTop: 20 }}>
        <span className="kicker">{cats.find((c) => c.id === p.category_id)?.name}</span>
        <h2>{p.name}</h2>
        <Stars rating={rating} />
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

        <div className="rate-box">
          <h3>{vote ? 'Sua avaliação' : 'Avalie este produto'}</h3>
          <StarInput value={vote} onRate={rate} disabled={!!vote} />
          {voteMsg && <p className="small muted" role="status">{voteMsg}</p>}
        </div>

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
              track('add_to_cart', { produto: p.name, quantidade: qty })
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
