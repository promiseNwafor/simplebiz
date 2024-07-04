import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginationContainerProps = {
  handlePageChange: (pageNumber: number) => void
  itemsCount: number
  itemsPerPage: number
  page: number
}

const PaginationContainer: React.FC<PaginationContainerProps> = ({
  handlePageChange,
  itemsCount,
  itemsPerPage,
  page,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={() => handlePageChange(Math.max(1, page - 1))}
          />
        </PaginationItem>
        {Array.from(
          { length: Math.ceil(itemsCount / itemsPerPage) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href='#'
              isActive={pageNumber === page}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem
        // disabled={page === Math.ceil(itemsCount / itemsPerPage)}
        >
          <PaginationNext
            href='#'
            onClick={() =>
              handlePageChange(
                Math.min(Math.ceil(itemsCount / itemsPerPage), page + 1)
              )
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationContainer
