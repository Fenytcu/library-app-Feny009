import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/features/reviews/reviewApi";
import { useAppSelector } from "@/store/hooks";
import type { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

interface BookReviewsProps {
  bookId: number;
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", bookId],
    queryFn: () => reviewApi.getBookReviews(bookId),
  });

  const createMutation = useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      toast.success("Review posted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["book", String(bookId)], refetchType: "all" });
      setComment("");
      setRating(5);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to post review");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["book", String(bookId)], refetchType: "all" });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createMutation.mutate({ bookId, star: rating, comment });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Reviews ({reviewsData?.data?.reviews.length || 0})</h3>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`focus:outline-none transition-colors ${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Posting..." : "Post Review"}
          </Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          Please login to leave a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData?.data?.reviews.map((review: Review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold">{review.user?.name || "Anonymous"}</div>
                <div className="text-xs text-gray-500">
                  {dayjs(review.createdAt).format("DD MMM YYYY")}
                </div>
              </div>
              {/* Allow delete if admin or owner */}
              {(user?.role === "ADMIN" || user?.id === review.userId) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-red-500"
                  onClick={() => deleteMutation.mutate(review.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.star ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}

        {reviewsData?.data?.reviews.length === 0 && (
          <p className="text-gray-500 text-center py-4">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
