import { STORE_NAME, brl, type DeliveryRegion } from './config'

/**
 * Regras do pedido do catálogo, sem React: totais, validação e o texto que vai para o WhatsApp.
 * Ficam separadas da tela para poderem ser testadas.
 */

export type Receive = 'entrega' | 'retirada'
export type Pay = 'pix' | 'dinheiro' | 'cartao'
/** 1 = à vista; 'whatsapp' = decidir na conversa */
export type Installments = number | 'whatsapp'

export type CheckoutForm = {
  name: string
  phone: string
  receive: Receive | null
  regionId: string
  street: string
  complement: string
  reference: string
  cep: string
  payment: Pay | null
  installments: Installments | null
  notes: string
}

export const emptyForm: CheckoutForm = {
  name: '',
  phone: '',
  receive: null,
  regionId: '',
  street: '',
  complement: '',
  reference: '',
  cep: '',
  payment: null,
  installments: null,
  notes: '',
}

/** Uma linha do pedido já com os dois preços: cheio e no Pix. */
export type CheckoutLine = { name: string; qty: number; price: number; pixPrice: number }

export const PAY_LABEL: Record<Pay, string> = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão de crédito' }

const round = (v: number) => Math.round(v * 100) / 100

export type Summary = {
  subtotal: number
  discount: number
  /** 0 na retirada; null = frete a confirmar (região não cadastrada ou ainda não escolhida) */
  fee: number | null
  total: number
  region: DeliveryRegion | null
}

export function summarize(lines: CheckoutLine[], f: Pick<CheckoutForm, 'receive' | 'regionId' | 'payment'>, regions: DeliveryRegion[]): Summary {
  const subtotal = round(lines.reduce((s, l) => s + l.price * l.qty, 0))
  // desconto do Pix só quando a forma escolhida é Pix
  const discount = f.payment === 'pix' ? round(lines.reduce((s, l) => s + (l.price - Math.min(l.price, l.pixPrice)) * l.qty, 0)) : 0
  const region = f.receive === 'entrega' ? (regions.find((r) => r.id === f.regionId) ?? null) : null
  const fee = f.receive === 'retirada' ? 0 : (region?.fee ?? null)
  return { subtotal, discount, fee, total: round(subtotal - discount + (fee ?? 0)), region }
}

export const installmentLabel = (n: Installments, total: number) =>
  n === 'whatsapp' ? 'Ainda não sei — decidir pelo WhatsApp' : n === 1 ? `À vista (${brl(total)})` : `${n}x de ${brl(round(total / n))}`

export const installmentOptions = (max: number): Installments[] => [...Array.from({ length: Math.max(1, max) }, (_, i) => i + 1), 'whatsapp']

export type Field = 'name' | 'phone' | 'receive' | 'regionId' | 'street' | 'reference' | 'payment' | 'installments'
export type Errors = Partial<Record<Field, string>>

export function validate(f: CheckoutForm, regions: DeliveryRegion[]): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Informe seu nome.'
  const digits = f.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) e.phone = 'Informe um WhatsApp válido com DDD.'
  if (!f.receive) e.receive = 'Escolha entrega ou retirada na loja.'
  if (f.receive === 'entrega') {
    if (!regions.some((r) => r.id === f.regionId)) e.regionId = 'Escolha sua região.'
    if (!/\d/.test(f.street) || f.street.trim().length < 4) e.street = 'Informe a rua e o número.'
    if (!f.reference.trim()) e.reference = 'Informe um ponto de referência.'
  }
  if (!f.payment) e.payment = 'Escolha a forma de pagamento.'
  if (f.payment === 'cartao' && f.installments == null) e.installments = 'Escolha o parcelamento.'
  return e
}

/** Código do pedido: CL-AAAAMMDD-XXX (o final é sorteado; a loja confirma pelo WhatsApp). */
export function orderCode(d = new Date(), rand = Math.random) {
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const tail = Array.from({ length: 3 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(rand() * 32)]).join('')
  return `CL-${ymd}-${tail}`
}

export const paymentText = (f: Pick<CheckoutForm, 'payment' | 'installments'>, total: number) =>
  !f.payment ? '' : f.payment === 'cartao' && f.installments != null ? `${PAY_LABEL.cartao} · ${installmentLabel(f.installments, total)}` : PAY_LABEL[f.payment]

/** Endereço numa linha só, para guardar no pedido do painel. */
export function addressText(f: CheckoutForm, s: Summary) {
  if (f.receive !== 'entrega') return ''
  return [
    s.region?.label,
    f.street.trim(),
    f.complement.trim(),
    f.reference.trim() && `Ref.: ${f.reference.trim()}`,
    f.cep.trim() && `CEP ${f.cep.trim()}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

export const feeText = (s: Summary) => (s.fee == null ? 'a confirmar pelo WhatsApp' : s.fee === 0 ? 'grátis' : brl(s.fee))

/** Mensagem completa que abre no WhatsApp da loja. */
export function orderMessage(code: string, lines: CheckoutLine[], f: CheckoutForm, s: Summary, origin = '') {
  const pix = f.payment === 'pix'
  const unit = (l: CheckoutLine) => (pix ? Math.min(l.price, l.pixPrice) : l.price)
  const out = [
    `Olá, ${STORE_NAME}! Quero confirmar meu pedido.`,
    '',
    `*Pedido: #${code}*`,
    '',
    '*Produtos:*',
    ...lines.map((l) => `${l.qty}x ${l.name} — ${brl(unit(l) * l.qty)}${l.qty > 1 ? ` (${brl(unit(l))} cada)` : ''}`),
    '',
    `Subtotal: ${brl(s.subtotal)}`,
    ...(s.discount > 0 ? [`Desconto Pix: −${brl(s.discount)}`] : []),
    `Frete estimado: ${feeText(s)}`,
    `*Total estimado: ${brl(s.total)}*${s.fee == null ? ' + frete' : ''}`,
    '',
    `Nome: ${f.name.trim()}`,
    `WhatsApp: ${f.phone.trim()}`,
    '',
    `Recebimento: ${f.receive === 'retirada' ? 'Retirada na loja' : 'Entrega'}`,
  ]
  if (f.receive === 'entrega') {
    out.push(`Região: ${s.region?.label ?? ''}`, `Endereço: ${f.street.trim()}`)
    if (f.complement.trim()) out.push(`Complemento: ${f.complement.trim()}`)
    out.push(`Ponto de referência: ${f.reference.trim()}`)
    if (f.cep.trim()) out.push(`CEP: ${f.cep.trim()}`)
  }
  out.push('', `Pagamento: ${f.payment ? PAY_LABEL[f.payment] : ''}`)
  if (f.payment === 'cartao' && f.installments != null) out.push(`Parcelamento: ${installmentLabel(f.installments, s.total)}`)
  if (f.notes.trim()) out.push('', `Observações: ${f.notes.trim()}`)
  if (origin) out.push('', `Origem: ${origin}`)
  out.push('', 'Aguardo a confirmação do frete, prazo e instruções para pagamento.')
  return out.join('\n')
}
