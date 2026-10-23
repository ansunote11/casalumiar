import { Link } from 'react-router-dom'
import { Icon, Stars, Thumb, catIcon } from './components'
import type { Category, Product, Ratings } from './types'

// Ícones das categorias gerados no Canva (Dream Lab), em public/icones/<id>.png
const ICONS = ['perfumes-femininos', 'perfumes-masculinos', 'body-splash', 'velas', 'home-spray', 'difusores', 'kits']

/** Categorias em ícones fixos (círculo bege com traço dourado e o nome embaixo). */
export function CategoryIcons({ cats }: { cats: Category[] }) {
  return (
    <nav className="cat-icons" aria-label="Categorias">
      {cats.map((c) => (
        <Link key={c.id} to={`/produtos?cat=${c.id}`} className="cat-icon">
          <span className="circle">
            {ICONS.includes(c.id) ? <img src={`${import.meta.env.BASE_URL}icones/${c.id}.png`} alt="" loading="lazy" /> : <Icon name={catIcon(c.id)} />}
          </span>
          <span className="label">{c.name}</span>
        </Link>
      ))}
    </nav>
  )
}

const MAX = 8

/**
 * Escolhe os produtos de "Escolhas que encantam": primeiro os que a loja marcou como destaque,
 * depois os mais bem avaliados, e completa com produtos que têm foto.
 */
export function pickHighlights(products: Product[], ratings: Ratings) {
  const active = products.filter((p) => p.active)
  const score = (p: Product) => ratings[p.id]?.avg ?? 0
  const featured = active.filter((p) => p.featured).sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url) || score(b) - score(a))
  const rated = active.filter((p) => ratings[p.id]?.count).sort((a, b) => score(b) - score(a) || ratings[b.id].count - ratings[a.id].count)
  const withPhoto = active.filter((p) => p.image_url)
  const out: Product[] = []
  for (const p of [...featured, ...rated, ...withPhoto]) if (out.length < MAX && !out.includes(p)) out.push(p)
  return out
}

export function Highlights({ products, ratings, cats }: { products: Product[]; ratings: Ratings; cats: Category[] }) {
  const list = pickHighlights(products, ratings)
  if (!list.length) return null
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? ''
  return (
    <section className="highlights" aria-labelledby="destaques-titulo">
      <div className="hl-head">
        <div>
          <span className="kicker">Destaques da Casa Lumiar</span>
          <h2 id="destaques-titulo">Escolhas que encantam</h2>
        </div>
        <Link to="/produtos" className="hl-all">
          Ver todos <Icon name="arrow" />
        </Link>
      </div>
      <div className="hl-track">
        {list.map((p) => (
          <Link key={p.id} to={`/produto/${p.id}`} className="hl-card">
            <Thumb p={p} />
            <span className="hl-info">
              <b>{p.name}</b>
              <small>{catName(p.category_id)}</small>
              <Stars rating={ratings[p.id]} small />
            </span>
            <span className="hl-go" aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
