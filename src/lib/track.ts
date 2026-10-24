/**
 * Origem da visita (UTM das campanhas do Instagram) e eventos básicos de venda.
 * Os eventos vão para `window.dataLayer`, onde um Google Analytics / Meta Pixel pode ser
 * ligado depois. Nunca registra nome, telefone, endereço ou dados de pagamento.
 */

const KEY = 'lumiar:utm'
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const MAX_AGE = 30 * 24 * 3600 * 1000 // a origem vale por 30 dias

export type Utm = Partial<Record<(typeof UTM)[number], string>> & { at?: number }

/** Guarda a UTM da URL (a mais recente vence). Chamado uma vez ao abrir o site. */
export function captureUtm(search = window.location.search) {
  const p = new URLSearchParams(search)
  const utm: Utm = {}
  for (const k of UTM) {
    const v = p.get(k)
    if (v) utm[k] = v.slice(0, 80)
  }
  if (!Object.keys(utm).length) return
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...utm, at: Date.now() }))
  } catch {
    /* sem armazenamento: segue sem origem */
  }
}

export function currentUtm(): Utm | null {
  try {
    const u = JSON.parse(localStorage.getItem(KEY) || 'null') as Utm | null
    return u && Date.now() - (u.at ?? 0) < MAX_AGE ? u : null
  } catch {
    return null
  }
}

/** "instagram / stories / lancamento-velas" — vai no fim da mensagem para a loja saber de onde veio. */
export const utmText = (u: Utm | null) => (u ? [u.utm_source, u.utm_medium, u.utm_campaign].filter(Boolean).join(' / ') : '')

export type SaleEvent = 'view_product' | 'share' | 'instagram_click' | 'add_to_cart' | 'begin_checkout' | 'send_whatsapp'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: SaleEvent, data: Record<string, string | number> = {}) {
  try {
    const utm = currentUtm()
    ;(window.dataLayer ??= []).push({ event, ...data, ...(utm ? { origem: utmText(utm) } : {}) })
  } catch {
    /* um evento nunca pode quebrar a compra */
  }
}
