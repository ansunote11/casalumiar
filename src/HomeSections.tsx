import { Link } from 'react-router-dom'
import { Icon, Stars, Thumb } from './components'
import type { Category, Product, Ratings } from './types'
import { productPath } from './lib/seo'

const MAX = 3

/**
 * Escolhe os 3 produtos de "Escolhas que encantam": os de maior média de estrelas (desempate pela
 * quantidade de avaliações). Enquanto faltar avaliação, completa com os destaques da loja e,
 * por fim, com produtos que têm foto.
 */
export function pickHighlights(products: Product[], ratings: Ratings) {
  const active = products.filter((p) => p.active)
  const rated = active.filter((p) => ratings[p.id]?.count).sort((a, b) => ratings[b.id].avg - ratings[a.id].avg || ratings[b.id].count - ratings[a.id].count)
  const featured = active.filter((p) => p.featured).sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url))
  const withPhoto = active.filter((p) => p.image_url)
  const out: Product[] = []
  for (const p of [...rated, ...featured, ...withPhoto]) if (out.length < MAX && !out.includes(p)) out.push(p)
  return out
}

export function Highlights({ products, ratings, cats }: { products: Product[]; ratings: Ratings; cats: Category[] }) {
  const list = pickHighlights(products, ratings)
  if (!list.length) return null
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? ''
  return (
    <section className="highlights" aria-labelledby="destaques-titulo">
      {/* folhagem dourada (Canva) encostada na curva de cima */}
      <span className="decor decor-hl" aria-hidden="true" />
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
          <Link key={p.id} to={productPath(p)} className="hl-card">
            <span className="hl-photo">
              <Thumb p={p} />
            </span>
            <span className="hl-info">
              <b>{p.name}</b>
              <small>{catName(p.category_id)}</small>
              <Stars rating={ratings[p.id]} small />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Valores da marca tirados do material da Casa Lumiar (rótulos das velas, catálogos e identidade).
// Ícones gerados no Canva (Dream Lab), em public/valores/.
const VALUES = [
  { icon: 'feito-a-mao', title: 'Feito à mão', text: 'Produtos artesanais' },
  { icon: 'cera-vegetal', title: 'Cera vegetal', text: 'Matéria-prima premium' },
  { icon: 'alta-perfumaria', title: 'Alta perfumaria', text: 'Inspirados nos clássicos' },
  { icon: 'atendimento', title: 'Atendimento', text: 'Próximo e com hora marcada' },
]

/** Faixa de valores em tom terra, logo acima do menu inferior. */
export function ValuesBand() {
  return (
    <section className="values" aria-label="Nossos valores">
      <ul>
        {VALUES.map((v) => (
          <li key={v.icon}>
            <img src={`${import.meta.env.BASE_URL}valores/${v.icon}.png`} alt="" loading="lazy" />
            <span>
              <b>{v.title}</b>
              <small>{v.text}</small>
            </span>
          </li>
        ))}
      </ul>
      <Link to="/admin" className="values-admin">
        Área da loja
      </Link>
    </section>
  )
}
