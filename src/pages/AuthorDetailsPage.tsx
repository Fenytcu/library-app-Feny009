import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authorApi } from "@/features/authors/authorApi";
import { Loader2 } from "lucide-react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { BookCard } from "@/components/BookCard";
import bookIcon from "@/assets/Book.png";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Extract up to 2 initials from a name
const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function AuthorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["author-books", id, page],
    queryFn: () => authorApi.getAuthorBooks(Number(id), { page, limit: 10 }),
    enabled: !!id,
  });

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 font-quicksand">
        <LandingNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-neutral-50 font-quicksand">
        <LandingNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <span className="text-5xl">😕</span>
          <p className="font-bold text-neutral-700 text-[18px]">
            Failed to load author details
          </p>
        </div>
      </div>
    );
  }

  const { author, bookCount, books, pagination } = data.data;
  const hasPhoto = !!author.photo && author.photo.startsWith("http");

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      <LandingNavbar />

      <main className="container mx-auto px-4 md:px-10 py-8 md:py-12">

        {/* ── Author Header Card ───────────────────────────────────────── */}
        <div className="bg-white rounded-[16px] p-4 md:p-6 shadow-[0_0_20px_rgba(203,202,202,0.25)] mb-8 md:mb-10 flex items-center gap-4 md:gap-5 w-full md:w-fit">
          {/* Avatar */}
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center">
            {hasPhoto ? (
              <img
                src={author.photo}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-bold font-quicksand text-[20px] md:text-[28px] select-none">
                {getInitials(author.name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[18px] md:text-[20px] font-bold text-neutral-900 leading-tight">
              {author.name}
            </h1>
            <div className="flex items-center gap-2 text-blue-600">
              <img
                src={bookIcon}
                alt="books"
                className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] object-contain"
              />
              <span className="text-[14px] md:text-[16px] font-semibold font-quicksand">
                {bookCount ?? author.bookCount ?? books.length} books
              </span>
            </div>
          </div>
        </div>

        {/* ── Book List ────────────────────────────────────────────────── */}
        <h2 className="text-[24px] md:text-[32px] font-bold text-neutral-900 mb-6">
          Book List
        </h2>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl">📚</span>
            <p className="font-bold text-neutral-700 text-[18px]">
              No books yet
            </p>
            <p className="text-neutral-500 text-[14px]">
              This author has no published books in our library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === page}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
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
      </main>
    </div>
  );
}
