import { X, Trash2, Plus, Minus } from 'lucide-react'
import type { CartItem } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
}

export default function CartPanel({ isOpen, onClose, cart, onIncrement, onDecrement, onRemove }: Props) {
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-30 shadow-2xl flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Your Cart</h2>
            <p className="text-xs text-gray-400 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-semibold text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex gap-3">
                {/* Product image */}
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {item.product.image}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Added by {item.addedBy}</p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecrement(item.product.id)}
                        className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onIncrement(item.product.id)}
                        className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors"
                      >
                        <Plus size={11} className="text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}