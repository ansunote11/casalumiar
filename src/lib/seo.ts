import type { Product } from '../types'

/**
 * Títulos, descrições, prévias de compartilhamento (Open Graph) e dados de produto (JSON-LD).
 * Sem React nem Vite: o mesmo código monta as tags no navegador e na função da Vercel
 * (api/produto.ts) que entrega a página do produto já com a prévia para WhatsApp/Facebook.
 */

export const BRAND = 'Casa Lumiar'
export const DEFAULT_DESCRIPTION = 'Velas, difusores, perfumes e aromas artesanais da Casa Lumiar, no Maranhão. Monte seu pedido e envie pelo WhatsApp.'
export const DEFAULT_IMAGE = 'banners/amazonia-viva.jpg'

/** "Vela Maracujá Azedo" -> "vela-maracuja-azedo" */
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const productPath = (p: Pick<Product, 'name'>) => `/produto/${slugify(p.name)}`

/** Acha o produto pelo endereço amigável ou pelo id antigo (links enviados antes da mudança). */
export const findBySlug = <T extends Pick<Product, 'id' | 'name'>>(list: T[], slug: string) =>
  list.find((p) => slugify(p.name) === slug) ?? list.find((p) => p.id === slug) ?? null

const abs = (site: string, path: string) => (/^https?:\/\//.test(path) ? path : `${site.replace(/\/$/, '')}/${path.replace(/^\//, '')}`)
const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')
const money = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export type Meta = {
  title: string
  description: string
  url: string
  image: string
  type: 'website' | 'product'
  jsonLd?: Record<string, unknown>
  noindex?: boolean
}

export function siteMeta(site: string, path = '/', title = BRAND, description = DEFAULT_DESCRIPTION): Meta {
  return { title, description, url: abs(site, path), image: abs(site, DEFAULT_IMAGE), type: 'website' }
}

export function productMeta(p: Product, site: string, categoryName = ''): Meta {
  const prices = p.sizes.length ? p.sizes.map((s) => s.price) : [p.price]
  const low = Math.min(...prices)
  const high = Math.max(...prices)
  const pix = p.sizes.length ? Math.min(...p.sizes.map((s) => s.pix_price ?? s.price)) : (p.pix_price ?? p.price)
  const price = `${prices.length > 1 ? 'a partir de ' : ''}${money(low)}${pix < low ? ` (${money(pix)} no Pix)` : ''}`
  const about = p.description.trim() || [categoryName, p.inspiration && `inspirado em ${p.inspiration}`, p.notes.slice(0, 3).join(', ')].filter(Boolean).join(' · ')
  const url = abs(site, productPath(p))
  const image = abs(site, p.image_url || DEFAULT_IMAGE)
  const inStock = p.stock > 0 && p.active
  return {
    title: `${p.name} — ${BRAND}`,
    description: clip(`${p.name}: ${price}. ${about ? about + '. ' : ''}Peça pelo WhatsApp.`, 200),
    url,
    image,
    type: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [image],
      description: about || p.name,
      sku: p.sku || undefined,
      brand: { '@type': 'Brand', name: BRAND },
      offers:
        prices.length > 1
          ? { '@type': 'AggregateOffer', priceCurrency: 'BRL', lowPrice: low.toFixed(2), highPrice: high.toFixed(2), offerCount: prices.length, availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url }
          : { '@type': 'Offer', priceCurrency: 'BRL', price: low.toFixed(2), availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url },
    },
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** As tags do <head> em texto (para a função da Vercel). */
export function headHtml(m: Meta) {
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${esc(m.url)}" />`,
    m.noindex ? `<meta name="robots" content="noindex" />` : '',
    `<meta property="og:site_name" content="${BRAND}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:type" content="${m.type}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.url)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(m.image)}" />`,
    m.jsonLd ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

/** Troca o bloco entre <!--seo--> e <!--/seo--> do index.html pelas tags desta página. */
export const injectHead = (html: string, m: Meta) => html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n    ${headHtml(m)}\n    <!--/seo-->`)

/** Aplica as mesmas tags no navegador quando a pessoa navega dentro do site. */
export function applyMeta(m: Meta) {
  document.title = m.title
  // cria (ou reaproveita) a tag; valor null remove
  const tag = (name: string, attrs: Record<string, string>, value: string | null, valueAttr = 'content') => {
    const sel = name + Object.entries(attrs).map(([k, v]) => '[' + k + '="' + v + '"]').join('')
    let el = document.head.querySelector(sel)
    if (value == null) return el?.remove()
    if (!el) {
      el = document.createElement(name)
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
      document.head.appendChild(el)
    }
    if (valueAttr === 'text') el.textContent = value
    else el.setAttribute(valueAttr, value)
  }
  tag('meta', { name: 'description' }, m.description)
  tag('meta', { name: 'robots' }, m.noindex ? 'noindex' : null)
  tag('link', { rel: 'canonical' }, m.url, 'href')
  tag('meta', { property: 'og:type' }, m.type)
  tag('meta', { property: 'og:title' }, m.title)
  tag('meta', { property: 'og:description' }, m.description)
  tag('meta', { property: 'og:url' }, m.url)
  tag('meta', { property: 'og:image' }, m.image)
  tag('meta', { name: 'twitter:title' }, m.title)
  tag('meta', { name: 'twitter:description' }, m.description)
  tag('meta', { name: 'twitter:image' }, m.image)
  tag('script', { type: 'application/ld+json' }, m.jsonLd ? JSON.stringify(m.jsonLd) : null, 'text')
}

/** Páginas públicas do site (o que entra no sitemap). Carrinho, painel e buscas ficam de fora. */
export const PUBLIC_PAGES = ['/', '/produtos', '/sobre']

export function sitemapXml(products: Product[], site: string) {
  const urls = [
    ...PUBLIC_PAGES.map((p) => abs(site, p)),
    ...products.filter((p) => p.active && p.stock > 0).map((p) => abs(site, productPath(p))),
  ]
  const uniq = [...new Set(urls)]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniq.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`
}

/** Página do produto para quem chega pelo link (robôs do WhatsApp, Facebook, Google): index.html + tags do produto. */
export function renderProductHtml(template: string, products: Product[], categoryNames: Record<string, string>, slug: string, site: string) {
  const p = findBySlug(products, slug)
  if (!p) return { status: 404, html: injectHead(template, { ...siteMeta(site, '/produtos', `Produto não encontrado — ${BRAND}`), noindex: true }) }
  return { status: 200, html: injectHead(template, productMeta(p, site, categoryNames[p.category_id] ?? '')) }
}
