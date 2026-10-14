import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../types'

export type CartLine = { product: Product; qty: number }

type CartCtx = {
  lines: CartLine[]
  count: number
  add: (p: Product, qty?: number) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx>(null as never)
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lumiar:cart') || '[]')
    } catch {
      return []
    }
  })
  useEffect(() => localStorage.setItem('lumiar:cart', JSON.stringify(lines)), [lines])

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      add: (p, qty = 1) =>
        setLines((ls) => {
          const cur = ls.find((l) => l.product.id === p.id)
          const next = Math.min(p.stock, (cur?.qty ?? 0) + qty)
          if (next <= 0) return ls
          return cur ? ls.map((l) => (l.product.id === p.id ? { product: p, qty: next } : l)) : [...ls, { product: p, qty: next }]
        }),
      setQty: (id, qty) =>
        setLines((ls) => ls.flatMap((l) => (l.product.id !== id ? [l] : qty <= 0 ? [] : [{ ...l, qty: Math.min(qty, l.product.stock) }]))),
      clear: () => setLines([]),
    }),
    [lines],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
