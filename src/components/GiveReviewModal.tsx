import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { reviewApi } from "@/features/reviews/reviewApi";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

interface GiveReviewModalProps {
  bookId: number;
  bookTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function GiveReviewModal({ bookId, bookTitle, isOpen, onClose }: GiveReviewModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [star, setStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");

  const createMutation = useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      toast.success("Review berhasil dikirim!");
      queryClient.invalidateQueries({ queryKey: ["my-reviews"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["reviews", Number(bookId)], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["book", String(bookId)], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["my-loans"], refetchType: "all" });
      handleClose();
      navigate("/my-reviews");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal mengirim review.");
    },
  });

  const handleClose = () => {
    createMutation.reset();
    setStar(0);
    setHoverStar(0);
    setComment("");
    onClose();
  };

  const handleSend = () => {
    if (star === 0) {
      toast.error("Pilih rating bintang terlebih dahulu.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Tulis komentar terlebih dahulu.");
      return;
    }
    console.log("Submitting review:", { bookId, star, comment });
    createMutation.mutate({ bookId, star, comment });
  };

  if (!isOpen) return null;

  const activeStar = hoverStar || star;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal Card — 439×518px per Figma */}
      <div className="relative z-10 w-[439px] h-[518px] max-w-[calc(100vw-32px)] bg-white rounded-[20px] shadow-2xl flex flex-col p-8 font-quicksand">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-bold text-[#0A0D12]">Give Review</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Book title (if provided) */}
        {bookTitle && (
          <p className="text-[13px] text-neutral-500 font-medium mb-4 line-clamp-1">
            {bookTitle}
          </p>
        )}

        {/* Star Rating */}
        <div className="mb-6">
          <p className="text-[14px] font-bold text-[#0A0D12] text-center mb-3">Give Rating</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStar(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-[40px] h-[40px] transition-colors ${
                    s <= activeStar
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-neutral-200 text-neutral-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="flex-1 mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please share your thoughts about this book"
            className="w-full h-full min-h-[150px] resize-none rounded-[12px] border border-[#D5D7DA] px-4 py-3 text-[14px] text-neutral-700 font-medium placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 transition-colors font-quicksand leading-relaxed"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={createMutation.isPending}
          className="w-full h-[52px] rounded-full bg-[#1C65DA] hover:bg-[#1550bb] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[16px] transition-colors"
        >
          {createMutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
