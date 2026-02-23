import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { SlidersHorizontal, Star, X, Loader2 } from "lucide-react"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { BookCard } from "@/components/BookCard"
import { bookApi } from "@/features/books/bookApi"
import { categoryApi } from "@/features/categories/categoryApi"
import type { BooksResponse } from "@/types/book"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// ─── Helpers ────────────────────────────────────────────────────────────────
const slugToName = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// ─── Component ──────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const { name: categorySlug } = useParams<{ name: string }>()
  const categoryNameFromUrl = categorySlug ? slugToName(categorySlug) : ""

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryNameFromUrl ? [categoryNameFromUrl] : []
  )
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Sync URL param → selected categories whenever route changes
  useEffect(() => {
    if (categoryNameFromUrl) {
      setSelectedCategories([categoryNameFromUrl])
      setPage(1)
    }
  }, [categoryNameFromUrl])

  // ── API: fetch all categories for sidebar ──
  const { data: categoriesData } = useQuery({
    queryKey: ["categories-list"],
    queryFn: () => categoryApi.getCategories({ limit: 50 }),
  })
  const allCategories = categoriesData?.data?.categories ?? []

  // ── API: fetch books with active filters ──
  const { data: booksData, isLoading } = useQuery<BooksResponse>({
    queryKey: ["category-books", selectedCategories, selectedRating, page],
    queryFn: () =>
      bookApi.getBooks({
        category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        rating: selectedRating ?? undefined,
        page,
        limit: 8,
      }),
    placeholderData: keepPreviousData,
  })

  const books = booksData?.data?.books ?? []
  const pagination = booksData?.data?.pagination

  // ── Handler: toggle a category checkbox ──
  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    )
    setPage(1)
  }

  // ── Filter Panel (shared between desktop sidebar & mobile sheet) ──
  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div className="flex flex-col gap-3">
        <span className="font-quicksand font-bold text-[16px] text-neutral-900">Category</span>
        <div className="flex flex-col gap-2">
          {allCategories.map((cat) => {
            const active = selectedCategories.includes(cat.name)
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  onClick={() => toggleCategory(cat.name)}
                  className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                    active
                      ? "bg-blue-600 border-blue-600"
                      : "border-neutral-300 bg-white group-hover:border-blue-400"
                  }`}
                >
                  {active && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleCategory(cat.name)}
                  className={`font-quicksand text-[14px] font-medium transition-colors ${
                    active ? "text-blue-600" : "text-neutral-700 group-hover:text-neutral-900"
                  }`}
                >
                  {cat.name}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-100" />

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <span className="font-quicksand font-bold text-[16px] text-neutral-900">Rating</span>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const active = selectedRating === star
            return (
              <button
                key={star}
                onClick={() => {
                  setSelectedRating(active ? null : star)
                  setPage(1)
                }}
                className="flex items-center gap-1.5 group"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-colors ${
                      i < star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-neutral-200 text-neutral-200"
                    } ${active ? "scale-110" : ""}`}
                  />
                ))}
                <span
                  className={`ml-1 font-quicksand text-[13px] font-semibold transition-colors ${
                    active ? "text-blue-600" : "text-neutral-500 group-hover:text-neutral-800"
                  }`}
                >
                  {star}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      {(selectedCategories.length > 0 || selectedRating !== null) && (
        <button
          onClick={() => {
            setSelectedCategories([])
            setSelectedRating(null)
            setPage(1)
          }}
          className="text-[13px] font-quicksand font-semibold text-red-500 hover:text-red-600 transition-colors text-left"
        >
          Reset filter
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      <LandingNavbar />

      <main className="container mx-auto px-4 md:px-10 py-8 md:py-12">
        {/* Page Title */}
        <h1 className="text-[28px] md:text-[36px] font-bold text-neutral-900 mb-6 md:mb-8">
          Book List
        </h1>

        {/* ─── Layout: sidebar (desktop) + book grid ─── */}
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden md:block w-[200px] flex-shrink-0">
            <div className="bg-white rounded-[16px] p-6 shadow-[0_0_20px_rgba(203,202,202,0.25)] sticky top-[88px]">
              <span className="font-quicksand font-bold text-[12px] tracking-widest uppercase text-neutral-400 mb-4 block">
                Filter
              </span>
              <FilterPanel />
            </div>
          </aside>

          {/* ── Right: Mobile filter bar + Book Grid ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile filter trigger */}
            <div className="flex md:hidden items-center justify-between mb-5">
              <span className="font-quicksand font-bold text-[16px] text-neutral-900 tracking-widest uppercase">
                Filter
              </span>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="p-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
              </button>
            </div>

            {/* Active filter pills */}
            {(selectedCategories.length > 0 || selectedRating !== null) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[12px] font-bold font-quicksand"
                  >
                    {c}
                    <button onClick={() => toggleCategory(c)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedRating !== null && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-[12px] font-bold font-quicksand">
                    ⭐ {selectedRating}+
                    <button onClick={() => setSelectedRating(null)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Book Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <span className="text-5xl">📚</span>
                <p className="font-quicksand font-bold text-neutral-700 text-[18px]">
                  No books found
                </p>
                <p className="text-neutral-500 text-[14px]">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        className={
                          page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── Mobile Filter Bottom Sheet ─── */}
      {mobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] p-6 md:hidden max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-quicksand font-bold text-[18px] text-neutral-900">
                Filter
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-700" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full h-[48px] rounded-full bg-blue-600 text-white font-quicksand font-bold text-[16px] hover:bg-blue-700 transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </>
      )}
    </div>
  )
}
