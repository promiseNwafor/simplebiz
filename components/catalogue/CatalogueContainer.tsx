'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Product } from '@/types'
import { useAddProduct, useGetProducts } from '@/store/useStoreData'
import { PRODUCTS_PER_PAGE } from '@/constants'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'

const CatalogueContainer: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const router = useRouter()
  const { data, isPlaceholderData } = useQuery(useGetProducts(page))
  const { mutateAsync: addProduct } = useAddProduct()

  const count = data?.data?.count as number

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handlePageClick = async (selectedPage: { selected: number }) => {
    if (!isPlaceholderData) {
      const pageNumber = selectedPage.selected + 1

      const params = new URLSearchParams()
      params.set('page', pageNumber.toString())

      setPage(pageNumber)
      router.push(`?${params.toString()}`)
    }
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
      <div className='p-5 bg-white rounded-t-lg flex items-center'>
        <h4>Product List</h4>
      </div>

      <div className='min-h-[400px]'>
        {!data?.data || !data?.data?.data.length ? (
          <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
            <h4>No available products</h4>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8'>
            {data?.data?.data.map((product) => (
              <ProductCard product={product as Product} key={product.id} />
            ))}
          </div>
        )}
      </div>
      <div className='p-5 centered gap-1 border-t bg-white rounded-b-lg'>
        <ReactPaginate
          pageCount={Math.ceil(count / PRODUCTS_PER_PAGE)}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          previousLabel={<ChevronLeft size={20} className='text-black/70' />}
          nextLabel={<ChevronRight size={20} className='text-black/70' />}
          breakLabel={<MoreHorizontal className='h-4 w-4' />}
          breakClassName='break-me'
          onPageChange={handlePageClick}
          containerClassName='pagination-container'
          activeClassName='active'
          previousClassName='action-button'
          nextClassName='action-button'
          disabledClassName='disabled-page-button'
        />
      </div>
    </div>
  )
}

export default CatalogueContainer
