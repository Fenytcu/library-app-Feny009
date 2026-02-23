import { useBooksQuery } from "@/hooks/useBooksQuery"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { Loader2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setCurrentPage } from "@/store/uiSlice"
import { BookCard } from "@/components/BookCard"
import { BookFilter } from "@/features/books/BookFilter"
import { RecommendedBooks } from "@/features/books/RecommendedBooks"
import { PopularAuthors } from "@/features/authors/PopularAuthors"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { currentPage } = useAppSelector((state) => state.ui)
  
  // Menggunakan custom hook yang baru dibuat
  const { data, isLoading, error, refetch } = useBooksQuery()

  // Fallback data
  const books = data?.data?.books || []
  const pagination = data?.data?.pagination

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      <LandingNavbar />
      <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Library Catalog</h1>
          <p className="text-muted-foreground">
            Explore our vast collection of books and resources.
          </p>
        </div>

        {/* Popular Authors Section */}
        <PopularAuthors />

        {/* Recommended Books Section */}
        <section className="border-b pb-8">
           <RecommendedBooks />
        </section>

        <div className="flex flex-col gap-4">
           <h2 className="text-2xl font-bold tracking-tight">All Books</h2>
           <BookFilter />
        </div>

        {error ? (
          <div className="text-center py-12">
             <p className="text-red-500 mb-4">Failed to load books. Please try again.</p>
             <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No books found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
        
        {pagination && pagination.totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                     isActive={page === currentPage}
                     onClick={() => handlePageChange(page)}
                     className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
                  className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      </main>
    </div>
  )
}
