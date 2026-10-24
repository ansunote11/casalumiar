import { useEffect } from 'react'
import { SITE_URL } from './config'
import { applyMeta, siteMeta, type Meta } from './seo'

/** Título, descrição e prévia da página atual; ao sair, volta para as da loja. */
export function useMeta(m: Meta | null) {
  const key = m ? JSON.stringify(m) : ''
  useEffect(() => {
    if (!m) return
    applyMeta(m)
    return () => applyMeta(siteMeta(SITE_URL))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** Página simples do site (catálogo, sobre, carrinho...). */
export const pageMeta = (path: string, title: string, description?: string, noindex = false): Meta => ({
  ...siteMeta(SITE_URL, path, title, description),
  noindex,
})
