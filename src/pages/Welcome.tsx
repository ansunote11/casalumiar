import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { BANNERS, WHATSAPP } from '../lib/config'
import { useCart } from '../lib/cart'
import { BrandLockup, Icon } from '../components'
import { Highlights, ValuesBand } from '../HomeSections'
import { CategoryRail } from '../CategoryRail'
import { BannerCarousel } from '../BannerCarousel'
import type { Category, Product, Ratings } from '../types'

export default function Welcome() {
  const [cats, setCats] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [ratings, setRatings] = useState<Ratings>({})
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { count } = useCart()
  useEffect(() => {
    void api.categories().then(setCats)
    void api.products().then(setProducts)
    void api.ratings().then(setRatings)
  }, [])

  return (
    <main className="welcome">
      <div className="home-hero">
      <header className="home-top">
        <span className="spacer" aria-hidden="true" />
        <h1 className="brand">
          <BrandLockup height={54} color="#B69A62" />
        </h1>
        <Link to="/carrinho" className="icon-btn" aria-label={`Meu pedido, ${count} itens`}>
          <Icon name="bag" />
          {count > 0 && (
            <i className="badge" style={{ top: 6, right: 4 }}>
              {count}
            </i>
          )}
        </Link>
      </header>

      {/* adereços botânicos (Canva Dream Lab) que aparecem por trás das pontas do banner */}
      <span className="decor decor-hero-left" aria-hidden="true" />
      <span className="decor decor-hero-right" aria-hidden="true" />
      {BANNERS.length > 0 && (
        <div className="hero-banner">
          <BannerCarousel banners={BANNERS} />
        </div>
      )}
      </div>
      <span className="decor decor-shadow" aria-hidden="true" />

      <div className="page" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <form
          role="search"
          className="home-search"
          onSubmit={(e) => {
            e.preventDefault()
            nav(`/produtos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
          }}
        >
          <label className="search-pill">
            <Icon name="search" />
            <input type="search" aria-label="Buscar produtos" placeholder="Procurando um aroma específico?" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </form>

        <div className="section-head">
          <h2>Categorias</h2>
          <Link to="/produtos">Ver tudo</Link>
        </div>
      </div>

      <CategoryRail cats={cats} />

      <Highlights products={products} ratings={ratings} cats={cats} />

      <div className="page" style={{ paddingTop: 0 }}>
        <a className="wa-button" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá, Casa Lumiar! Gostaria de atendimento.')}`} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" />
          <span>
            <b>Atendimento pelo WhatsApp</b>
            <small>Estamos aqui para te ajudar.</small>
          </span>
          <Icon name="arrow" className="go" />
        </a>
      </div>

      <ValuesBand />
    </main>
  )
}
