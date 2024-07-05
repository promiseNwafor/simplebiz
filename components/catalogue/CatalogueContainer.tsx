import { Product } from '@/types'
import AddButton from '@/components/reusables/AddButton'
import ProductCard from './ProductCard'

const products = [
  {
    id: 'a1&t=u7f7i0JB5tDWinXt',
    name: 'Nike Air Max 97',
    type: 'physical',
    amount: 68000,
    imageURL: '',
    available: true,
  },
  {
    id: 'b2&t=v8g8j1KC6uEWjoYu',
    name: 'Adobe Photoshop Subscription',
    type: 'digital',
    amount: 8000,
    imageURL: '',
    available: true,
  },
  {
    id: 'c3&t=w9h9k2LD7vFXkpZv',
    name: 'House Cleaning Service',
    type: 'service',
    amount: 6000,
    imageURL: '',
    available: true,
  },
  {
    id: 'd4&t=x0i0l3ME8wGYlqAw',
    name: 'Samsung Galaxy S21',
    type: 'physical',
    amount: 250000,
    imageURL: '',
    available: true,
  },
  {
    id: 'e5&t=y1j1m4NF9xHZmrBx',
    name: 'Microsoft Office 365',
    type: 'digital',
    amount: 12000,
    imageURL: '',
    available: true,
  },
  {
    id: 'f6&t=z2k2n5OG0yIAnoCy',
    name: 'Gardening Service',
    type: 'service',
    amount: 4500,
    imageURL: '',
    available: true,
  },
  {
    id: 'g7&t=a3l3o6PH1zJBopDz',
    name: 'Apple MacBook Pro',
    type: 'physical',
    amount: 850000,
    imageURL: '',
    available: true,
  },
  {
    id: 'h8&t=b4m4p7QI2aKCpqEz',
    name: 'Spotify Premium Subscription',
    type: 'digital',
    amount: 5000,
    imageURL: '',
    available: true,
  },
]

const CatalogueContainer = () => {
  return (
    <div className='space-y-4 lg:space-y-8'>
      <div className='flex items-center justify-end'>
        <AddButton>Add a new product</AddButton>
      </div>
      <div className='p-5 bg-white rounded-lg flex items-center'>
        <h4>Product List</h4>
      </div>
      <div>
        <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8'>
          {products.map((product) => (
            <ProductCard product={product as Product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CatalogueContainer
