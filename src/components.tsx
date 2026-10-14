import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Product } from './types'
import { useCart } from './lib/cart'
import { brl } from './lib/config'

const tints: Record<string, string> = { velas: '#e8d9c0', 'home-spray': '#dfe6dc', difusores: '#ead8d2', kits: '#e3dcea' }

export function Thumb({ p, big }: { p: Pick<Product, 'image_url' | 'category_id' | 'name'>; big?: boolean }) {
  if (p.image_url) return <img className="thumb" src={p.image_url} alt={p.name} loading="lazy" />
  const c = tints[p.category_id] ?? '#e8d9c0'
  return (
    <div className="thumb" style={{ background: `linear-gradient(160deg, ${c}, #f6f1ea)` }}>
      <svg viewBox="0 0 100 100" width={big ? '46%' : '58%'} aria-hidden>
        <path d="M50 8c7 10 11 15 11 22a11 11 0 0 1-22 0c0-7 4-12 11-22z" fill="#c9a66b" />
        <rect x="47.500" y="38" width="5" height="8" rx="2" fill="#2b2622" />
        <rect x="26" y="46" width="48" height="40" rx="9" fill="#fffaf2" stroke="#2b2622" strokeWidth="2" />
        <text x="50" y="72" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill="#2b2622" letterSpacing="1">LUMIAR</text>
      </svg>
    </div>
  )
}

export function Price({ p }: { p: Pick<Product, 'price' | 'pix_price'> }) {
  return (
    <div className="price">
      <b>{brl(p.price)}</b>
      {p.pix_price ? <small>{brl(p.pix_price)} no PIX</small> : null}
    </div>
  )
}

export function Shell() {
  const { count } = useCart()
  return (
    <div className="app">
      <Outlet />
      <nav className="tabbar">
        <NavLink to="/" end>
          <span>⌂</span>Início
        </NavLink>
        <NavLink to="/produtos">
          <span>▦</span>Produtos
        </NavLink>
        <NavLink to="/carrinho">
          <span>
            ◍{count > 0 && <i className="badge">{count}</i>}
          </span>
          Pedido
        </NavLink>
      </nav>
    </div>
  )
}

export function TopBar({ title, right }: { title: string; right?: React.ReactNode }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={() => nav(-1)} aria-label="Voltar">
        ←
      </button>
      <h1>{title}</h1>
      <div className="topbar-right">{right}</div>
    </header>
  )
}
