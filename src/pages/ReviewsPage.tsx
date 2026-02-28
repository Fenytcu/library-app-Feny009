import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { userApi } from "@/features/users/userApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { GiveReviewModal } from "@/components/GiveReviewModal";
import { Loader2, Search, Star } from "lucide-react";
import type { MyReview } from "@/types/user";
import dayjs from "dayjs";

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [reviewModal, setReviewModal] = useState<{ open: boolean; bookId: number; bookTitle: string }>({
    open: false,
    bookId: 0,
    bookTitle: "",
  });

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => userApi.getMyReviews(),
  });

  const reviews: MyReview[] = reviewsData?.data?.reviews ?? [];

  const filtered = search
    ? reviews.filter((r) => r.book?.title?.toLowerCase().includes(search.toLowerCase()))
    : reviews;

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand flex flex-col">
      <LandingNavbar />

      <main className="w-full mx-auto py-8 px-4 md:px-10">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0A0D12] mb-6">Reviews</h1>

        {/* Search */}
        <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 bg-white mb-6 w-full">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search book"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[14px] outline-none bg-transparent text-neutral-800 placeholder:text-neutral-400"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-medium">
            {search ? "No reviews match your search." : "You haven't written any reviews yet."}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onGiveReview={() =>
                  setReviewModal({ open: true, bookId: review.bookId, bookTitle: review.book?.title ?? "" })
                }
              />
            ))}
          </div>
        )}
      </main>

      <LandingFooter />

      {/* Give Review Modal */}
      <GiveReviewModal
        bookId={reviewModal.bookId}
        bookTitle={reviewModal.bookTitle}
        isOpen={reviewModal.open}
        onClose={() => setReviewModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

// ─── Review Card ────────────────────────────────────────────────────────────────

function ReviewCard({ review, onGiveReview }: { review: MyReview; onGiveReview: () => void }) {
  return (
    <div className="bg-white border border-[#F2F4F7] rounded-[16px] p-5 md:p-6 flex flex-col gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {/* Date row */}
      <p className="text-[12px] md:text-[13px] text-neutral-400 font-medium">
        {dayjs(review.createdAt).format("DD MMMM YYYY, HH:mm")}
      </p>

      {/* Book info Box */}
      <div className="border border-neutral-100 rounded-xl p-3 flex gap-4">
        {/* Cover Image */}
        <Link to={`/books/${review.bookId}`} className="flex-shrink-0">
          <div className="w-[64px] h-[88px] md:w-[72px] md:h-[100px] rounded-[8px] overflow-hidden bg-neutral-100">
            {review.book?.coverImage ? (
              <img
                src={review.book.coverImage}
                alt={review.book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300 text-[10px] font-bold text-center px-1">
                No Cover
              </div>
            )}
          </div>
        </Link>

        {/* Text info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {review.book?.category?.name && (
            <span className="inline-flex items-center justify-center border border-neutral-200 rounded text-[10px] md:text-[11px] font-bold text-neutral-500 px-2 py-0.5 w-fit mb-1 bg-neutral-50">
              {review.book.category.name}
            </span>
          )}
          <Link
            to={`/books/${review.bookId}`}
            className="text-[15px] md:text-[17px] font-bold text-[#0A0D12] hover:text-blue-600 transition-colors line-clamp-1 truncate leading-tight"
          >
            {review.book?.title ?? "Unknown Book"}
          </Link>
          <p className="text-[13px] md:text-[14px] text-neutral-500 font-medium mt-0.5">
            {review.book?.author?.name ?? "Unknown Author"}
          </p>
        </div>

        {/* Update Review button on desktop */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onGiveReview}
            className="h-[38px] px-6 rounded-full bg-[#1C65DA] hover:bg-[#1550bb] text-white text-[13px] font-bold transition-colors"
          >
            Update Review
          </button>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-[18px] h-[18px] md:w-[20px] md:h-[20px] ${
              s <= (review.star ?? 0)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-neutral-200 text-neutral-200"
            }`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-[14px] md:text-[15px] text-neutral-600 font-medium leading-relaxed">
        {review.comment}
      </p>

      {/* Mobile Update Review button */}
      <button
        onClick={onGiveReview}
        className="md:hidden w-full h-[42px] rounded-full bg-[#1C65DA] hover:bg-[#1550bb] text-white text-[14px] font-bold transition-colors mt-2"
      >
        Update Review
      </button>
    </div>
  );
}
