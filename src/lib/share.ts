/** Links de compartilhamento de um produto. Cada canal leva sua UTM para a loja saber de onde veio a visita. */
export function shareLinks(title: string, url: string) {
  const tag = (source: string) => `${url}${url.includes('?') ? '&' : '?'}utm_source=${source}&utm_medium=compartilhamento`
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} — Casa Lumiar\n${tag('whatsapp')}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(tag('facebook'))}`,
    instagram: tag('instagram'),
  }
}

/** Copia texto; usa o jeito antigo quando o navegador não libera a área de transferência. */
export async function copyText(text: string, nav: Pick<Navigator, 'clipboard'> | undefined = globalThis.navigator) {
  try {
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(text)
      return true
    }
  } catch {
    /* cai no plano B */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}

/** Compartilhamento nativo do celular; devolve false quando não existe ou a pessoa cancelou. */
export async function nativeShare(data: ShareData, nav: Pick<Navigator, 'share'> | undefined = globalThis.navigator) {
  if (!nav?.share) return false
  try {
    await nav.share(data)
    return true
  } catch {
    return false
  }
}
