import { SITE_URL } from '../src/lib/config'
import { sitemapXml } from '../src/lib/seo'
import { CACHE, activeProducts } from './_catalog'

export const config = { runtime: 'edge' }

/** /sitemap.xml — páginas públicas + produtos ativos com estoque. */
export default async function handler() {
  try {
    return new Response(sitemapXml(await activeProducts(), SITE_URL), { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': CACHE } })
  } catch {
    return new Response(sitemapXml([], SITE_URL), { headers: { 'content-type': 'application/xml; charset=utf-8' } })
  }
}
