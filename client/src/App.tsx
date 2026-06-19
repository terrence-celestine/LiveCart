import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import type { Product, CartItem } from './types'
import { products } from './data/products'
import ProductCard from './components/ProductCard'
import CartPanel from './components/CartPanel'
import Lobby from './components/Lobby'

const socket = io('http://localhost:3001')
const CATEGORIES = ['All', 'Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Drinks']

interface SessionState {
  sessionId: string
  username: string
  members: string[]
}

function App() {
  const [connected, setConnected] = useState(false)
  const [session, setSession] = useState<SessionState | null>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('session:joined', ({ sessionId, cart, members }) => {
      setSession(prev => ({ ...prev!, sessionId, members }))
      setCart(cart)
      setSessionError(null)
    })

    socket.on('session:error', ({ message }) => {
      setSessionError(message)
    })

    socket.on('session:member_joined', ({ members }) => {
      setSession(prev => prev ? { ...prev, members } : prev)
    })

    socket.on('session:member_left', ({ members }) => {
      setSession(prev => prev ? { ...prev, members } : prev)
    })

    socket.on('cart:updated', ({ cart }) => {
      setCart(cart.map((item: any) => ({
        product: products.find(p => p.id === item.productId)!,
        quantity: item.quantity,
        addedBy: item.addedBy
      })))
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('session:joined')
      socket.off('session:error')
      socket.off('session:member_joined')
      socket.off('session:member_left')
      socket.off('cart:updated')
    }
  }, [])

  const AVATAR_COLORS = [
    'bg-indigo-100 text-indigo-700',
    'bg-pink-100 text-pink-700',
    'bg-amber-100 text-amber-700',
    'bg-green-100 text-green-700',
    'bg-sky-100 text-sky-700',
    'bg-rose-100 text-rose-700',
    'bg-violet-100 text-violet-700',
    'bg-orange-100 text-orange-700',
  ]
  
  function getAvatarColor(name: string): string {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length
    return AVATAR_COLORS[index]
  }
  
  function handleCreate(username: string) {
    setSession({ sessionId: '', username, members: [] })
    socket.emit('session:create', { username })
  }

  function handleJoin(username: string, code: string) {
    setSession({ sessionId: '', username, members: [] })
    socket.emit('session:join', { sessionId: code, username })
  }

    function handleAddToCart(product: Product) {
      socket.emit('cart:add', { sessionId: session?.sessionId ?? '', item: {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        addedBy: session?.username ?? 'You'
      } })
      setCart(prev => {
        const existing = prev.find(i => i.product.id === product.id)
        if (existing) {
          return prev.map(i =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        }
        return [...prev, { product, quantity: 1, addedBy: session?.username ?? 'You' }]
      })
    }

  function handleIncrement(id: string) {
    const item = cart.find(i => i.product.id === id)
    if (!item) return
    socket.emit('cart:update', {
      sessionId: session!.sessionId,
      productId: id,
      quantity: item.quantity + 1
    })
    setCart(prev => prev.map(i =>
      i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i
    ))
  }

  function handleDecrement(id: string) {
    const item = cart.find(i => i.product.id === id)
    if (!item) return
    socket.emit('cart:update', {
      sessionId: session!.sessionId,
      productId: id,
      quantity: item.quantity - 1
    })
    setCart(prev => prev
      .map(i => i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0)
    )
  }

  function handleRemove(id: string) {
    socket.emit('cart:update', {
      sessionId: session!.sessionId,
      productId: id,
      quantity: 0
    })
    setCart(prev => prev.filter(i => i.product.id !== id))
  }

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  // Show lobby until session is established
  if (!session || !session.sessionId) {
    return (
      <Lobby
        onCreate={handleCreate}
        onJoin={handleJoin}
        error={sessionError}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">🛒 LiveCart</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-gray-400">Session:</span>
              <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                {session.sessionId}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(session.sessionId)
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Members */}
            <div className="flex items-center gap-1">
            {session.members.map((m, i) => (
              <div
                key={i}
                title={m}
                className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white -ml-1 first:ml-0 ${getAvatarColor(m)}`}
              >
                {m[0].toUpperCase()}
              </div>
            ))}
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {connected ? '⚡ Live' : '⏳ Connecting'}
            </span>
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
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
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-0">
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

      <CartPanel
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default App