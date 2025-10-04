import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart-items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart-items', JSON.stringify(items))
    } catch {}
  }, [items])

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { ...product, quantity }]
    })
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }

  function replaceItems(nextItems) {
    setItems(nextItems)
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0), [items])

  const value = { items, addItem, removeItem, replaceItems, subtotal }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


