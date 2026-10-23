import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Product } from './types'
import { unitPrice, useCart } from './lib/cart'
import { WHATSAPP, brl } from './lib/config'

const paths: Record<string, ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  back: <path d="M15 5l-7 7 7 7" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7v9H4z" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  chat: <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />,
  whatsapp: (
    <>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9 10c0 3 2 5 5 5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z" />
    </>
  ),
  share: (
    <>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    </>
  ),
  // categorias
  vela: (
    <>
      <rect x="6" y="10" width="12" height="11" rx="2" />
      <path d="M12 10V8" />
      <path d="M12 7c-1.5-1.5-.8-3 0-4.5.8 1.5 1.5 3 0 4.5z" />
    </>
  ),
  spray: (
    <>
      <rect x="7" y="9" width="10" height="12" rx="2.5" />
      <path d="M10 9V6h4v3" />
      <path d="M14 6h3M19 4.5v.01M19 7.5v.01M21 6v.01" />
    </>
  ),
  difusor: (
    <>
      <path d="M8 13h8v7a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20v-7z" />
      <path d="M10.5 13v-2h3v2" />
      <path d="M11 11L8 3M12 11V2M13 11l3-8" />
    </>
  ),
  kit: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="1.5" />
      <rect x="3" y="7" width="18" height="3.5" rx="1" />
      <path d="M12 7v14" />
      <path d="M12 7c-2-3.5-6-3-4.5-.8C8.3 7 12 7 12 7zM12 7c2-3.5 6-3 4.5-.8C15.7 7 12 7 12 7z" />
    </>
  ),
  // painel
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  orders: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  store: (
    <>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12v8h14v-8" />
    </>
  ),
  box: (
    <>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7M12 11v10" />
    </>
  ),
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9z" />,
  // ações do painel
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  duplicate: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2M14 11v6M11 14h6" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
}

export type IconName = keyof typeof paths

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`i ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export const catIcon = (id: string): IconName =>
  ({ velas: 'vela', 'home-spray': 'spray', difusores: 'difusor', kits: 'kit' } as Record<string, IconName>)[id] ?? 'vela'

export { BrandLockup, Logo } from './brand'

const tints: Record<string, string> = { velas: '#eadfcb', 'home-spray': '#e3e5d6', difusores: '#f0e4d2', kits: '#e6e3d3' }

export function Thumb({ p, big }: { p: Pick<Product, 'image_url' | 'category_id' | 'name'>; big?: boolean }) {
  if (p.image_url) return <img className="thumb" src={p.image_url} alt={p.name} loading="lazy" />
  return (
    <div className="thumb" style={{ background: tints[p.category_id] ?? '#eadfcb' }}>
      <svg viewBox="0 0 74 92" width={big ? '38%' : '46%'} fill="none" aria-hidden="true">
        <path d="M37 20c-4-4-3-10 0-14 3 4 4 10 0 14z" fill="#d9b98f" />
        <path d="M37 20v8" stroke="#1d3412" strokeWidth="1.4" />
        <rect x="10" y="28" width="54" height="60" rx="8" fill="#faf7f1" stroke="#1d3412" strokeWidth="1.4" />
        <rect x="18" y="48" width="38" height="22" rx="2" fill="#fff" stroke="#a8743f" />
        <text x="37" y="63" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="8" fontWeight="600" fill="#1d3412" letterSpacing="1">LUMIAR</text>
      </svg>
    </div>
  )
}

export function Price({ p }: { p: Pick<Product, 'price' | 'pix_price' | 'sizes'> }) {
  const from = p.sizes?.length > 1
  return (
    <div className="price">
      <b>
        {from && <small className="from">a partir de </small>}
        {brl(p.price)}
      </b>
      {p.pix_price ? <small>{brl(p.pix_price)} no PIX</small> : null}
    </div>
  )
}

export function Shell() {
  const { count } = useCart()
  return (
    <div className="app">
      <Outlet />
      <nav className="tabbar" aria-label="Navegação principal">
        <NavLink to="/" end>
          <Icon name="home" />
          Início
        </NavLink>
        <NavLink to="/produtos">
          <Icon name="grid" />
          Catálogo
        </NavLink>
        <NavLink to="/carrinho">
          <span>
            <Icon name="bag" />
            {count > 0 && <i className="badge">{count}</i>}
          </span>
          Pedido
        </NavLink>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
          <Icon name="chat" />
          Contato
        </a>
      </nav>
    </div>
  )
}

export function TopBar({ right }: { right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <header className="topbar">
      <button className="icon-btn" onClick={() => nav(-1)} aria-label="Voltar">
        <Icon name="back" />
      </button>
      <h1>CASA LUMIAR</h1>
      <div className="topbar-right">{right}</div>
    </header>
  )
}

export function CartBar() {
  const { lines, count } = useCart()
  if (!count) return null
  const total = lines.reduce((s, l) => s + unitPrice(l.product, l.size) * l.qty, 0)
  return (
    <Link to="/carrinho" className="cartbar">
      <span>
        <small>
          {count} {count === 1 ? 'item' : 'itens'} no pedido
        </small>
        <b>{brl(total)}</b>
      </span>
      <span className="go">
        Ver pedido <Icon name="arrow" />
      </span>
    </Link>
  )
}

/** Média de estrelas (só leitura). Some quando ainda não há avaliações. */
export function Stars({ rating, small }: { rating?: { avg: number; count: number }; small?: boolean }) {
  if (!rating?.count) return null
  const full = Math.round(rating.avg)
  return (
    <span
      className={`stars${small ? ' sm' : ''}`}
      aria-label={`Nota ${rating.avg.toFixed(1).replace('.', ',')} de 5, ${rating.count} ${rating.count === 1 ? 'avaliação' : 'avaliações'}`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" className={n <= full ? 'on' : ''} />
      ))}
      <small>
        {rating.avg.toFixed(1).replace('.', ',')} ({rating.count})
      </small>
    </span>
  )
}

/** Escolha de 1 a 5 estrelas para avaliar um produto. */
export function StarInput({ value, onRate, disabled }: { value: number | null; onRate: (n: number) => void; disabled?: boolean }) {
  return (
    <div className="star-input" role="radiogroup" aria-label="Sua nota">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} role="radio" aria-checked={value === n} aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`} disabled={disabled} className={value && n <= value ? 'on' : ''} onClick={() => onRate(n)}>
          <Icon name="star" />
        </button>
      ))}
    </div>
  )
}
