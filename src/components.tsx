import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Product } from './types'
import { unitPrice, useCart } from './lib/cart'
import { WHATSAPP, brl } from './lib/config'
import { copyText, nativeShare, shareLinks } from './lib/share'
import { track } from './lib/track'
import { BrandLockup } from './brand'

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
  close: <path d="M6 6l12 12M18 6L6 18" />,
  link: <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" />
    </>
  ),
  zoom: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4M11 8v6M8 11h6" />
    </>
  ),
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

/** Caminho de arquivo do site ("produtos/x.jpg") vale em qualquer página, inclusive /produto/... */
export const assetUrl = (path: string) => (/^(https?:|data:|\/)/.test(path) ? path : `${import.meta.env.BASE_URL}${path}`)

export function Thumb({ p, big }: { p: Pick<Product, 'image_url' | 'category_id' | 'name'>; big?: boolean }) {
  if (p.image_url) return <img className="thumb" src={assetUrl(p.image_url)} alt={p.name} loading="lazy" />
  return (
    <div className="thumb" style={{ background: tints[p.category_id] ?? '#eadfcb' }}>
      <svg viewBox="0 0 74 92" width={big ? '38%' : '46%'} fill="none" aria-hidden="true">
        <path d="M37 20c-4-4-3-10 0-14 3 4 4 10 0 14z" fill="#d9b98f" />
        <path d="M37 20v8" stroke="#263323" strokeWidth="1.4" />
        <rect x="10" y="28" width="54" height="60" rx="8" fill="#faf7f1" stroke="#263323" strokeWidth="1.4" />
        <rect x="18" y="48" width="38" height="22" rx="2" fill="#fff" stroke="#a8743f" />
        <text x="37" y="63" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="8" fontWeight="600" fill="#263323" letterSpacing="1">LUMIAR</text>
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

/**
 * Folhas desfocadas ao fundo da página (Canva Dream Lab). Cada página usa uma posição diferente
 * para a identidade se repetir sem ficar igual: à direita, à esquerda ou de cabeça para baixo.
 */
export function PageShade({ side }: { side: 'right' | 'left' | 'flip' }) {
  return <span className={`page-shade page-shade--${side}`} aria-hidden="true" />
}

/**
 * Barra de topo das páginas internas: fundo verde, voltar, logomarca original e (por padrão) a sacola.
 * Termina numa onda suave; `wave` escolhe uma das formas para cada página ter a sua.
 */
export function TopBar({ right, wave = 'a' }: { right?: ReactNode; wave?: 'a' | 'b' | 'c' }) {
  const nav = useNavigate()
  const { count } = useCart()
  return (
    <header className={`topbar wave-${wave}`}>
      <button className="icon-btn" onClick={() => nav(-1)} aria-label="Voltar">
        <Icon name="back" />
      </button>
      <Link to="/" className="topbar-brand" aria-label="Casa Lumiar, página inicial">
        <BrandLockup height={62} color="#B69A62" />
      </Link>
      <div className="topbar-right">
        {right ?? (
          <Link to="/carrinho" className="icon-btn" aria-label={`Meu pedido, ${count} itens`}>
            <Icon name="bag" />
            {count > 0 && (
              <i className="badge" style={{ top: 6, right: 4 }}>
                {count}
              </i>
            )}
          </Link>
        )}
      </div>
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

/**
 * Foto ampliada sobre fundo escuro. Usa a versão inteira da foto (`<nome>-inteira.jpg`, ao lado do
 * recorte quadrado); se ela não existir, mostra a própria foto do produto.
 */
export function PhotoViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const full = src.replace(/\.jpg$/, '-inteira.jpg')
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`Foto: ${alt}`} onClick={onClose}>
      <button className="viewer-close" onClick={onClose} aria-label="Fechar foto" autoFocus>
        <Icon name="close" />
      </button>
      <img
        src={full}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        onError={(e) => {
          if (e.currentTarget.src !== new URL(src, location.href).href) e.currentTarget.src = src
        }}
      />
    </div>
  )
}

/** Painel de compartilhar: celular (nativo), copiar link, WhatsApp, Facebook e Instagram (nativo ou copiar). */
export function ShareSheet({ title, url, onClose }: { title: string; url: string; onClose: () => void }) {
  const [msg, setMsg] = useState('')
  const links = shareLinks(title, url)
  const canShare = typeof navigator.share === 'function'
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  const done = (canal: string, text = '') => {
    track('share', { canal, produto: title })
    if (text) setMsg(text)
  }
  const copy = async (canal: string, link: string, ok: string) => {
    done(canal, (await copyText(link)) ? ok : 'Não foi possível copiar. Toque e segure o endereço do navegador para copiar.')
  }
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="share-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h3 id="share-title">Compartilhar</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-actions">
          {canShare && (
            <button autoFocus onClick={async () => (await nativeShare({ title, text: `${title} — Casa Lumiar`, url })) && done('nativo')}>
              <Icon name="share" />
              Compartilhar pelo celular
            </button>
          )}
          <button autoFocus={!canShare} onClick={() => copy('copiar', url, 'Link copiado!')}>
            <Icon name="link" />
            Copiar link
          </button>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => done('whatsapp')}>
            <Icon name="whatsapp" />
            WhatsApp
          </a>
          <a href={links.facebook} target="_blank" rel="noopener noreferrer" onClick={() => done('facebook')}>
            <Icon name="facebook" />
            Facebook
          </a>
          <button
            onClick={async () => {
              if (canShare && (await nativeShare({ title, url: links.instagram }))) return done('instagram')
              await copy('instagram', links.instagram, 'Link copiado! Cole no seu Story ou na bio do Instagram.')
            }}
          >
            <Icon name="instagram" />
            {canShare ? 'Instagram (pelo celular)' : 'Copiar link para o Instagram'}
          </button>
        </div>
        <p className="small muted" role="status">
          {msg}
        </p>
      </div>
    </div>
  )
}
