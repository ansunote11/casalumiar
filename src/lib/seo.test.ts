import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Product } from '../types'
import { PUBLIC_PAGES, findBySlug, productMeta, renderProductHtml, sitemapXml, slugify } from './seo'
import { seedProducts } from './seed'

const SITE = 'https://casalumiar.vercel.app'
const vela: Product = {
  id: '11111111-1111-1111-1111-111111111111',
  sku: 'VEL-014',
  name: 'Vela Maracujá Azedo',
  description: '',
  notes: ['Maracujá'],
  category_id: 'velas',
  price: 62.5,
  pix_price: 50,
  stock: 4,
  image_url: 'produtos/vela-maracuja-azedo.jpg',
  featured: false,
  active: true,
  sizes: [],
  inspiration: '',
  pyramid: null,
}
const template = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')

describe('endereços amigáveis', () => {
  it('slug sem acento', () => {
    expect(slugify('Vela Maracujá Azedo')).toBe('vela-maracuja-azedo')
    expect(slugify('Difusor Conforto de Criança')).toBe('difusor-conforto-de-crianca')
  })
  it('acha pelo slug e pelo id antigo', () => {
    expect(findBySlug([vela], 'vela-maracuja-azedo')?.id).toBe(vela.id)
    expect(findBySlug([vela], vela.id)?.name).toBe(vela.name)
  })
  it('nenhum produto da lista inicial repete endereço', () => {
    const slugs = seedProducts.map((p) => slugify(p.name))
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('tags do produto', () => {
  it('título, descrição, canonical, imagem absoluta e JSON-LD', () => {
    const m = productMeta(vela, SITE, 'Velas')
    expect(m.title).toBe('Vela Maracujá Azedo — Casa Lumiar')
    expect(m.description).toContain('R$')
    expect(m.url).toBe(`${SITE}/produto/vela-maracuja-azedo`)
    expect(m.image).toBe(`${SITE}/produtos/vela-maracuja-azedo.jpg`)
    expect(m.jsonLd).toMatchObject({ '@type': 'Product', name: vela.name, brand: { name: 'Casa Lumiar' }, offers: { priceCurrency: 'BRL', price: '62.50', availability: 'https://schema.org/InStock' } })
  })
  it('a página do link compartilhado já vem com a prévia do produto', () => {
    const { status, html } = renderProductHtml(template, [vela], { velas: 'Velas' }, 'vela-maracuja-azedo', SITE)
    expect(status).toBe(200)
    expect(html).toContain('<title>Vela Maracujá Azedo — Casa Lumiar</title>')
    expect(html).toContain(`<meta property="og:image" content="${SITE}/produtos/vela-maracuja-azedo.jpg" />`)
    expect(html).toContain(`<meta property="og:url" content="${SITE}/produto/vela-maracuja-azedo" />`)
    expect(html).toContain('<meta property="og:type" content="product" />')
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('application/ld+json')
    expect(html.match(/<title>/g)).toHaveLength(1) // trocou o bloco padrão, não duplicou
    expect(html).toContain('<div id="root"></div>')
  })
  it('produto inexistente: 404 sem indexar', () => {
    const { status, html } = renderProductHtml(template, [vela], {}, 'nao-existe', SITE)
    expect(status).toBe(404)
    expect(html).toContain('noindex')
  })
})

describe('sitemap e robots', () => {
  it('sitemap tem páginas públicas e produtos com estoque, sem rotas privadas', () => {
    const xml = sitemapXml([vela, { ...vela, id: '2', name: 'Vela Esgotada', stock: 0 }], SITE)
    for (const p of PUBLIC_PAGES) expect(xml).toContain(`<loc>${SITE}${p}</loc>`)
    expect(xml).toContain('/produto/vela-maracuja-azedo')
    expect(xml).not.toContain('vela-esgotada')
    expect(xml).not.toMatch(/<loc>[^<]*(carrinho|admin|\?)/)
  })
  it('robots bloqueia carrinho, painel e buscas', () => {
    const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
    for (const rule of ['Disallow: /admin', 'Disallow: /carrinho', 'Disallow: /produtos?']) expect(robots).toContain(rule)
    expect(robots).toContain('Sitemap: https://casalumiar.vercel.app/sitemap.xml')
  })
})

describe('descrição da prévia', () => {
  it('não duplica o ponto nem corta letras do fim', () => {
    expect(productMeta({ ...vela, description: 'Azedinho tropical e alegre.' }, SITE).description).toContain('alegre. Peça')
    expect(productMeta({ ...vela, description: 'Notas cítricas' }, SITE).description).toContain('Notas cítricas. Peça')
  })
})
