import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useCart } from '../lib/cart'
import { STORE_NAME } from '../lib/config'
import { Icon, Logo, catIcon } from '../components'
import type { Category } from '../types'

export default function Welcome() {
  const [cats, setCats] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const { count } = useCart()
  useEffect(() => void api.categories().then(setCats), [])

  return (
    <main className="welcome">
      <div className="home-top">
        <Link to="/produtos" className="icon-btn" aria-label="Ver catálogo completo">
          <Icon name="menu" />
        </Link>
        <span className="label">Catálogo</span>
        <Link to="/carrinho" className="icon-btn" aria-label={`Meu pedido, ${count} itens`}>
          <Icon name="bag" />
          {count > 0 && <i className="badge" style={{ top: 6, right: 4 }}>{count}</i>}
        </Link>
      </div>

      <header className="brand">
        <Logo />
        <h1 className="brand-name">{STORE_NAME.toUpperCase()}</h1>
        <span className="brand-sub">Onde a luz vira essência</span>
      </header>

      <div className="page" style={{ paddingTop: 0 }}>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            nav(`/produtos${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
          }}
        >
          <label className="search-box">
            <Icon name="search" />
            <input type="search" aria-label="Buscar produtos" placeholder="Buscar velas, aromas, notas…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </form>

        <div className="section-head">
          <h2>Categorias</h2>
          <Link to="/produtos">Ver tudo</Link>
        </div>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <Link key={c.id} to={`/produtos?cat=${c.id}`} className={`cat c${i % 4}`}>
              <Icon name={catIcon(c.id)} />
              <span>{c.name}</span>
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

        <Link to="/admin" className="admin-link">
          Área da loja
        </Link>
      </div>
    </main>
  )
}
