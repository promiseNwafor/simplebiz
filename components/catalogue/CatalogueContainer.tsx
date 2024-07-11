'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { GetResponse, Product } from '@/types'
import { addProduct } from '@/actions/products'
import { getProducts } from '@/store/products'
import AddButton from '@/components/reusables/AddButton'
import Modal from '@/components/reusables/Modal'
import ProductCard from './ProductCard'
import ProductForm from './ProductForm'

interface ICatalogueContainer {
  productsData: GetResponse<Product[]>
  itemsPerPage: number
}

const CatalogueContainer: React.FC<ICatalogueContainer> = ({
  productsData,
  itemsPerPage,
}) => {
  const { data: allData, error } = productsData || {}
  const [modalOpen, setModalOpen] = useState(false)
  const [products, setProducts] = useState(allData?.data)
  const [_isPending, startTransition] = useTransition()

  const router = useRouter()

  const count = allData?.count as number

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState)
  }

  const handlePageClick = async (selectedPage: { selected: number }) => {
    const pageNumber = selectedPage.selected + 1

    startTransition(async () => {
      try {
        const response = await getProducts(pageNumber, itemsPerPage)
        if (response.success) {
          setProducts(response.data?.data as Product[])

          const newSearchParams = new URLSearchParams()
          newSearchParams.set('page', pageNumber.toString())

          router.push(`?${newSearchParams.toString()}`)
          return
        }
        toast.error(response?.error || 'Something went wrong!')
        return
      } catch (error) {
        toast.error('Something went wrong!')
      }
    })
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

      {error ? (
        <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className='min-h-[400px]'>
            {!products || !products.length ? (
              <div className='bg-white w-full h-[400px] py-5 centered border-t border-gray-200'>
                <h4>No available products</h4>
              </div>
            ) : (
              <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-8'>
                {products.map((product) => (
                  <ProductCard product={product as Product} key={product.id} />
                ))}
              </div>
            )}
          </div>
          <div className='p-5 centered gap-1 border-t bg-white rounded-b-lg'>
            <ReactPaginate
              pageCount={Math.ceil(count / itemsPerPage)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              previousLabel={
                <ChevronLeft size={20} className='text-black/70' />
              }
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
        </>
      )}
    </div>
  )
}

export default CatalogueContainer
