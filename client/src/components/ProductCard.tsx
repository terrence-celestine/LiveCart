import { useState } from 'react'
import { Heart } from 'lucide-react'
import type { Product, CartItem } from '../types'

interface Props {
  product: Product
  cartItems: CartItem[]
  onAdd: (product: Product) => void
}

export default function ProductCard({ product, cartItems, onAdd }: Props) {
  const [wishlisted, setWishlisted] = useState(false)
  const inCart = cartItems.find(i => i.product.id === product.id)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image area */}
      <div className="relative bg-gray-50 aspect-square flex items-center justify-content-center">
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${
            product.badge === 'Sale' ? 'bg-red-100 text-red-600' :
            product.badge === 'New'  ? 'bg-blue-100 text-blue-600' :
            'bg-amber-100 text-amber-600'
          }`}>
            {product.badge}
          </span>
        )}
        <button
          onClick={() => setWishlisted(w => !w)}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
        <div className="text-6xl w-full h-full flex items-center justify-center py-6">
          {product.image}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-gray-400 mb-0.5">{product.category}</p>
        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 min-h-10">
          {product.name}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-gray-900 text-sm">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors ${
              inCart
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}