import { useInfiniteQuery } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import { BookCard } from "@/components/BookCard";
import { Loader2 } from "lucide-react";

export function RecommendedBooks({ 
  title = "Recommended for You",
  limit = 10 
}: { 
  title?: string;
  limit?: number;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['recommended-books', limit],
    queryFn: ({ pageParam = 1 }) => bookApi.getRecommendations({ page: pageParam, limit, mode: 'rating' }), 
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
       if (!lastPage.data?.pagination) return undefined;
       const { page, totalPages } = lastPage.data.pagination;
       return page < totalPages ? page + 1 : undefined;
    },
  });

  if (status === 'pending') {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load recommendations.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between mb-[40px]">
          <h2 className="text-[36px] font-bold tracking-tight font-quicksand">{title}</h2>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] md:gap-[20px]">
        {data.pages.map((group, i) => (
          group.data.books.map((book) => (
            <BookCard key={`${book.id}-${i}`} book={book} />
          ))
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-[40px] mb-[48px]">
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="w-[344px] h-[56px] border border-[#D5D7DA] rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-[16px] font-bold font-quicksand">Loading...</span>
              </>
            ) : (
              <span className="text-[16px] font-bold font-quicksand">Load More</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
