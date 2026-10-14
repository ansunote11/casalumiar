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
