import { SITE_URL } from '../src/lib/config'
import { renderProductHtml } from '../src/lib/seo'
import { CACHE, activeProducts, categoryNames } from './_catalog'

export const config = { runtime: 'edge' }

/**
 * /produto/:slug — devolve o index.html do site já com título, descrição, imagem e JSON-LD do produto,
 * para a prévia aparecer quando o link é colado no WhatsApp, Facebook etc. O React assume dali em diante.
 */
export default async function handler(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug') ?? ''
  try {
    const [template, products, cats] = await Promise.all([
      fetch(new URL('/index.html', url.origin)).then((r) => (r.ok ? r.text() : Promise.reject(new Error('index ' + r.status)))),
      activeProducts(),
      categoryNames(),
    ])
    const { status, html } = renderProductHtml(template, products, cats, slug, SITE_URL)
    return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': CACHE } })
  } catch {
    // sem banco ou sem o index: a página abre normal pelo site (o React acha o produto)
    return Response.redirect(new URL(`/#/produto/${encodeURIComponent(slug)}`, url.origin), 307)
  }
}
