import type { Order } from '../types'
import { WHATSAPP, STORE_NAME, brl } from './config'

const deliveryLabel = { entrega: 'Entrega', retirada: 'Retirada', balcao: 'Balcão' }

export function whatsappLink(o: Order) {
  const lines = [
    `*Novo pedido ${STORE_NAME}* — ${o.code}`,
    '',
    ...o.items.map((i) => `• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`),
    '',
    `*Total: ${brl(o.total)}*`,
    '',
    `Cliente: ${o.customer_name}`,
    `Telefone: ${o.phone}`,
    `Recebimento: ${deliveryLabel[o.delivery]}`,
    ...(o.delivery === 'entrega' && o.address ? [`Endereço: ${o.address}`] : []),
    `Pagamento: ${o.payment}`,
    ...(o.notes ? [`Obs.: ${o.notes}`] : []),
  ]
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`
}
