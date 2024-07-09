'use client'

import { useState } from 'react'
import { Product } from '@/types'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'
import { addProduct } from '@/actions/products'

const products = [
  {
    id: 'a1&t=u7f7i0JB5tDWinXt',
    name: 'Nike Air Max 97',
    type: 'physical',
    price: 68000,
    imageURL: '',
    available: true,
  },
  {
    id: 'b2&t=v8g8j1KC6uEWjoYu',
    name: 'Adobe Photoshop Subscription',
    type: 'digital',
    price: 8000,
    imageURL: '',
    available: true,
  },
  {
    id: 'c3&t=w9h9k2LD7vFXkpZv',
    name: 'House Cleaning Service',
    type: 'service',
    price: 6000,
    imageURL: '',
    available: true,
  },
  {
    id: 'd4&t=x0i0l3ME8wGYlqAw',
    name: 'Samsung Galaxy S21',
    type: 'physical',
    price: 250000,
    imageURL: '',
    available: true,
  },
  {
    id: 'e5&t=y1j1m4NF9xHZmrBx',
    name: 'Microsoft Office 365',
    type: 'digital',
    price: 12000,
    imageURL: '',
    available: true,
  },
  {
    id: 'f6&t=z2k2n5OG0yIAnoCy',
    name: 'Gardening Service',
    type: 'service',
    price: 4500,
    imageURL: '',
    available: true,
  },
  {
    id: 'g7&t=a3l3o6PH1zJBopDz',
    name: 'Apple MacBook Pro',
    type: 'physical',
    price: 850000,
    imageURL: '',
    available: true,
  },
  {
    id: 'h8&t=b4m4p7QI2aKCpqEz',
    name: 'Spotify Premium Subscription',
    type: 'digital',
    price: 5000,
    imageURL: '',
    available: true,
  },
]

const CatalogueContainer = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  return (
    <div className='space-y-4 lg:space-y-8'>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
        content={
          <ProductForm toggleModal={toggleModal} submitHandler={addProduct} />
        }
        title='Add a new product'
      />

      <div className='flex items-center justify-end'>
        <AddButton onClick={toggleModal}>Add a new product</AddButton>
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
