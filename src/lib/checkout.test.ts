import { describe, expect, it } from 'vitest'
import { emptyForm, installmentOptions, orderCode, orderMessage, summarize, validate, type CheckoutForm, type CheckoutLine } from './checkout'
import type { DeliveryRegion } from './config'

const regions: DeliveryRegion[] = [
  { id: 'proxima', label: 'Região próxima', fee: 10 },
  { id: 'intermediaria', label: 'Região intermediária', fee: 15 },
  { id: 'consultar', label: 'Não encontrei minha região', fee: null },
]
const lines: CheckoutLine[] = [
  { name: 'Difusor Conforto de Criança', qty: 1, price: 54.9, pixPrice: 48 },
  { name: 'Vela Lavanda Âmbar', qty: 2, price: 35, pixPrice: 30 },
]
const entrega: CheckoutForm = { ...emptyForm, name: 'Ana', phone: '(98) 98888-7777', receive: 'entrega', regionId: 'intermediaria', street: 'Rua das Flores, 120', reference: 'Perto da praça', payment: 'pix' }

describe('totais', () => {
  it('Pix aplica o desconto', () => {
    const s = summarize(lines, entrega, regions)
    expect(s.subtotal).toBe(124.9)
    expect(s.discount).toBe(16.9)
    expect(s.fee).toBe(15)
    expect(s.total).toBe(123)
  })
  it('cartão e dinheiro não aplicam desconto Pix', () => {
    for (const payment of ['cartao', 'dinheiro'] as const) {
      const s = summarize(lines, { ...entrega, payment }, regions)
      expect(s.discount).toBe(0)
      expect(s.total).toBe(139.9)
    }
  })
  it('retirada tem frete grátis', () => {
    expect(summarize(lines, { ...entrega, receive: 'retirada' }, regions).fee).toBe(0)
  })
  it('região não cadastrada fica com frete a confirmar', () => {
    const s = summarize(lines, { ...entrega, regionId: 'consultar' }, regions)
    expect(s.fee).toBeNull()
    expect(s.total).toBe(108)
  })
})

describe('validação', () => {
  it('pedido completo passa', () => {
    expect(validate(entrega, regions)).toEqual({})
  })
  it('exige recebimento e pagamento', () => {
    const e = validate({ ...entrega, receive: null, payment: null }, regions)
    expect(e.receive).toBeTruthy()
    expect(e.payment).toBeTruthy()
  })
  it('entrega exige região, rua com número e referência', () => {
    const e = validate({ ...entrega, regionId: '', street: 'Rua sem número', reference: '' }, regions)
    expect(Object.keys(e).sort()).toEqual(['reference', 'regionId', 'street'])
  })
  it('retirada não exige endereço', () => {
    expect(validate({ ...entrega, receive: 'retirada', regionId: '', street: '', reference: '' }, regions)).toEqual({})
  })
  it('parcelamento é exigido só no cartão', () => {
    expect(validate({ ...entrega, payment: 'cartao', installments: null }, regions).installments).toBeTruthy()
    expect(validate({ ...entrega, payment: 'cartao', installments: 'whatsapp' }, regions)).toEqual({})
    expect(validate({ ...entrega, payment: 'pix', installments: null }, regions).installments).toBeUndefined()
  })
  it('telefone precisa de DDD', () => {
    expect(validate({ ...entrega, phone: '98888-7777' }, regions).phone).toBeTruthy()
  })
})

describe('parcelas e código', () => {
  it('opções vão de à vista até o máximo, mais "decidir no WhatsApp"', () => {
    expect(installmentOptions(3)).toEqual([1, 2, 3, 'whatsapp'])
    expect(installmentOptions(1)).toEqual([1, 'whatsapp'])
  })
  it('código CL-AAAAMMDD-XXX', () => {
    expect(orderCode(new Date(2026, 9, 24), () => 0)).toBe('CL-20261024-222')
  })
})

describe('mensagem do WhatsApp', () => {
  it('Pix: traz pedido, produtos, desconto, frete, total, endereço e pagamento', () => {
    const msg = orderMessage('CL-20261024-ABC', lines, { ...entrega, complement: 'Casa 2', notes: 'É presente' }, summarize(lines, entrega, regions), 'instagram / stories')
    for (const part of [
      'Pedido: #CL-20261024-ABC',
      '1x Difusor Conforto de Criança — R$',
      '2x Vela Lavanda Âmbar — R$',
      'Subtotal: R$',
      'Desconto Pix:',
      'Frete estimado: R$',
      'Total estimado: R$',
      'Recebimento: Entrega',
      'Região: Região intermediária',
      'Endereço: Rua das Flores, 120',
      'Complemento: Casa 2',
      'Ponto de referência: Perto da praça',
      'Pagamento: Pix',
      'Observações: É presente',
      'Origem: instagram / stories',
      'Aguardo a confirmação do frete, prazo e instruções para pagamento.',
    ])
      expect(msg).toContain(part)
    expect(msg).not.toContain('Parcelamento')
  })
  it('cartão: preço cheio, sem desconto, com parcelamento', () => {
    const f: CheckoutForm = { ...entrega, payment: 'cartao', installments: 3 }
    const msg = orderMessage('CL-1', lines, f, summarize(lines, f, regions))
    expect(msg).not.toContain('Desconto Pix')
    expect(msg).toContain('Pagamento: Cartão de crédito')
    expect(msg).toMatch(/Parcelamento: 3x de R\$/)
  })
  it('retirada não mostra endereço; região não cadastrada mostra frete a confirmar', () => {
    const r: CheckoutForm = { ...entrega, receive: 'retirada' }
    const m1 = orderMessage('CL-1', lines, r, summarize(lines, r, regions))
    expect(m1).toContain('Recebimento: Retirada na loja')
    expect(m1).not.toContain('Endereço:')
    const c: CheckoutForm = { ...entrega, regionId: 'consultar' }
    expect(orderMessage('CL-1', lines, c, summarize(lines, c, regions))).toContain('Frete estimado: a confirmar pelo WhatsApp')
  })
})
