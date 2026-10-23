import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product, Size } from '../types'

/** Uma linha do pedido: produto + tamanho escolhido (quando o produto tem tamanhos). */
export type CartLine = { key: string; product: Product; qty: number; size: string | null }

const lineKey = (id: string, size: string | null) => (size ? `${id}|${size}` : id)

export const findSize = (p: Product, label: string | null): Size | null => (label ? p.sizes.find((s) => s.label === label) ?? null : null)

/** Preço unitário da linha; `pix` usa o preço PIX quando existe. */
export const unitPrice = (p: Product, size: string | null, pix = false) => {
  const s = findSize(p, size)
  const full = s ? s.price : p.price
  const discount = s ? s.pix_price : p.pix_price
  return pix && discount ? discount : full
}

export const lineName = (l: Pick<CartLine, 'product' | 'size'>) => (l.size ? `${l.product.name} ${l.size}` : l.product.name)

type CartCtx = {
  lines: CartLine[]
  count: number
  add: (p: Product, qty?: number, size?: string | null) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx>(null as never)
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lumiar:cart') || '[]') as Partial<CartLine>[]
      // carrinhos salvos antes dos tamanhos não tinham key/size
      return saved.filter((l) => l.product).map((l) => ({ ...l, size: l.size ?? null, key: l.key ?? lineKey(l.product!.id, l.size ?? null) })) as CartLine[]
    } catch {
      return []
    }
  })
  useEffect(() => localStorage.setItem('lumiar:cart', JSON.stringify(lines)), [lines])

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add: (p, qty = 1, size = null) =>
        setLines((ls) => {
          const label = size ?? p.sizes[0]?.label ?? null
          const key = lineKey(p.id, label)
          const cur = ls.find((l) => l.key === key)
          const next = Math.min(p.stock, (cur?.qty ?? 0) + qty)
          if (next <= 0) return ls
          return cur ? ls.map((l) => (l.key === key ? { ...l, product: p, qty: next } : l)) : [...ls, { key, product: p, qty: next, size: label }]
        }),
      setQty: (key, qty) =>
        setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : qty <= 0 ? [] : [{ ...l, qty: Math.min(qty, l.product.stock) }]))),
      clear: () => setLines([]),
    }),
    [lines],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
