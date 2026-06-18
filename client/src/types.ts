export interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    category: string
    badge?: 'Sale' | 'New' | 'Hot'
  }
  
  export interface CartItem {
    product: Product
    quantity: number
    addedBy: string
  }