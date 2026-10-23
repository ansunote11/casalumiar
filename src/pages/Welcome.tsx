import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { BANNERS } from '../lib/config'
import { useCart } from '../lib/cart'
import { BrandLockup, Icon } from '../components'
import { CategoryRail } from '../CategoryRail'
import { BannerCarousel } from '../BannerCarousel'
import type { Category } from '../types'


export default function Welcome() {
  const [cats, setCats] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { count } = useCart()
  useEffect(() => void api.categories().then(setCats), [])

  return (
    <main className="welcome">
      <div className="home-hero">
      <header className="home-top">
        <span className="spacer" aria-hidden="true" />
        <h1 className="brand">
          <BrandLockup height={54} color="#D2B48B" />
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

      {BANNERS.length > 0 && (
        <div className="hero-banner">
          <BannerCarousel banners={BANNERS} />
        </div>
      )}
      </div>

      <div className="page" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="section-head">
          <h2>Categorias</h2>
          <Link to="/produtos">Ver tudo</Link>
        </div>
      </div>

      <CategoryRail cats={cats} />

      <div className="page" style={{ paddingTop: 0 }}>
        <div className="wa-note">
          <span className="ic">
            <Icon name="whatsapp" />
          </span>
          <div>
            <b>Monte seu pedido aqui</b>
            <small>e ele chega pronto no nosso WhatsApp.</small>
          </div>
        </div>

        <form
          role="search"
          className="home-search"
          onSubmit={(e) => {
            e.preventDefault()
            nav(`/produtos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
          }}
        >
          <label htmlFor="home-q">Procurando um aroma específico?</label>
          <div className="search-box">
            <Icon name="search" />
            <input id="home-q" type="search" placeholder="Buscar velas, aromas, notas…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </form>

        <Link to="/admin" className="admin-link">
          Área da loja
        </Link>
      </div>
    </main>
  )
}
