import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { BANNERS } from '../lib/config'
import { useCart } from '../lib/cart'
import { BrandLockup, Icon, catIcon } from '../components'
import type { Category } from '../types'

// Imagens geradas no Canva (Dream Lab), em public/categorias/<id>.png
const CAT_IMAGES = ['velas', 'home-spray', 'difusores', 'kits']

export default function Welcome() {
  const [cats, setCats] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { count } = useCart()
  useEffect(() => void api.categories().then(setCats), [])

  return (
    <main className="welcome">
      <header className="home-top">
        <span className="spacer" aria-hidden="true" />
        <h1 className="brand">
          <BrandLockup height={54} />
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

      <div className="page" style={{ paddingTop: 0 }}>
        {BANNERS.length > 0 && (
          <section className="banners" aria-label="Destaques">
            {BANNERS.map((b) => (
              <a key={b.src} href={b.href} target={b.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="banner">
                <img src={`${import.meta.env.BASE_URL}${b.src}`} alt={b.alt} width={1200} height={800} />
              </a>
            ))}
          </section>
        )}

        <div className="section-head">
          <h2>Categorias</h2>
          <Link to="/produtos">Ver tudo</Link>
        </div>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <Link key={c.id} to={`/produtos?cat=${c.id}`} className={`cat c${i % 4}`}>
              {CAT_IMAGES.includes(c.id) ? (
                <img src={`${import.meta.env.BASE_URL}categorias/${c.id}.png`} alt="" loading="lazy" />
              ) : (
                <Icon name={catIcon(c.id)} />
              )}
              <span>{c.name}</span>
              <Icon name="arrow" className="go" />
            </Link>
          ))}
        </div>

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
