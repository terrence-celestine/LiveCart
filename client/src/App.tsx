import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import type { Product, CartItem } from './types'
import { products } from './data/products'
import ProductCard from './components/ProductCard'

const socket = io('http://localhost:3001')

const CATEGORIES = ['All', 'Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Drinks']

function App() {
  const [connected, setConnected] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    return () => { socket.off('connect'); socket.off('disconnect') }
  }, [])

  function handleAddToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1, addedBy: 'You' }]
    })
  }

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🛒 LiveCart</h1>
            <p className="text-[11px] text-gray-400">Shop together, live</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {connected ? '⚡ Live' : '⏳ Connecting'}
            </span>
            <button className="relative bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === cat
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-xs text-gray-400 mb-4">{filtered.length} products</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              cartItems={cart}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      </main>

    </div>
  )
}

export default App