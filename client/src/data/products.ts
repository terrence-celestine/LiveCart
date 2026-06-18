import type { Product } from '../types'

export const products: Product[] = [
  { id: '1',  name: 'Sourdough Bread',    price: 6.99,  image: '🍞', category: 'Bakery',   badge: 'New' },
  { id: '2',  name: 'Whole Milk',         price: 3.49,  image: '🥛', category: 'Dairy' },
  { id: '3',  name: 'Free Range Eggs',    price: 5.99,  image: '🥚', category: 'Dairy',    badge: 'Hot' },
  { id: '4',  name: 'Chicken Breast',     price: 9.99,  originalPrice: 13.99, image: '🍗', category: 'Meat', badge: 'Sale' },
  { id: '5',  name: 'Avocados (3pk)',     price: 4.49,  image: '🥑', category: 'Produce' },
  { id: '6',  name: 'Baby Spinach',       price: 3.99,  image: '🥬', category: 'Produce',  badge: 'New' },
  { id: '7',  name: 'Pasta',              price: 2.49,  image: '🍝', category: 'Pantry' },
  { id: '8',  name: 'Olive Oil',          price: 8.99,  originalPrice: 11.99, image: '🫒', category: 'Pantry', badge: 'Sale' },
  { id: '9',  name: 'Orange Juice',       price: 4.99,  image: '🍊', category: 'Drinks' },
  { id: '10', name: 'Greek Yogurt',       price: 5.49,  image: '🫙', category: 'Dairy' },
  { id: '11', name: 'Salmon Fillet',      price: 12.99, originalPrice: 16.99, image: '🐟', category: 'Meat', badge: 'Sale' },
  { id: '12', name: 'Bananas',            price: 1.99,  image: '🍌', category: 'Produce',  badge: 'Hot' },
]