/** Um tamanho à venda (ex.: 100 mL) com seu preço cheio e no PIX. */
export type Size = { label: string; price: number; pix_price: number | null }
export type Pyramid = { top: string[]; heart: string[]; base: string[] }

export type Category = { id: string; name: string; icon: string; sort: number }

export type Product = {
  id: string
  sku: string
  name: string
  description: string
  notes: string[]
  category_id: string
  price: number
  pix_price: number | null
  stock: number
  image_url: string | null
  featured: boolean
  active: boolean
  /** Vazio = preço único (price/pix_price). Com itens, cada tamanho tem seu preço. */
  sizes: Size[]
  inspiration: string
  pyramid: Pyramid | null
}

export type OrderItem = { id: string; name: string; qty: number; price: number }
export type OrderStatus = 'novo' | 'confirmado' | 'entregue' | 'cancelado'
export type Delivery = 'entrega' | 'retirada' | 'balcao'

export type Order = {
  id: string
  code: string
  customer_name: string
  phone: string
  delivery: Delivery
  address: string
  payment: string
  notes: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  source: 'catalogo' | 'balcao'
  created_at: string
}

export type NewOrder = Omit<Order, 'id' | 'code' | 'status' | 'created_at'>
/** O que o painel pode alterar num pedido existente (o total é recalculado pelos itens). */
export type OrderUpdate = Partial<Pick<Order, 'customer_name' | 'phone' | 'delivery' | 'address' | 'payment' | 'notes' | 'items'>>
