import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookApi } from "@/features/books/bookApi";
import { cartApi } from "@/features/cart/cartApi";
import { loanApi } from "@/features/loans/loanApi";
import { reviewApi } from "@/features/reviews/reviewApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, Loader2 } from "lucide-react";
import { RecommendedBooks } from "@/features/books/RecommendedBooks";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: bookResponse, isLoading: isBookLoading, error: bookError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookApi.getBook(Number(id)),
    enabled: !!id,
  });

  const { data: reviewsResponse } = useQuery({
    queryKey: ["reviews", Number(id)],
    queryFn: () => reviewApi.getBookReviews(Number(id)),
    enabled: !!id,
  });

  const book = bookResponse?.data;
  const reviews = reviewsResponse?.data?.reviews || [];

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    },
  });

  const handleAddToCart = () => {
    if (book) {
      addToCartMutation.mutate({ bookId: book.id });
    }
  };

  const borrowBookMutation = useMutation({
    mutationFn: (bookId: number) => loanApi.borrowBook({ bookId }),
    onSuccess: (data) => {
      const due = data.data?.loan?.dueAt
        ? dayjs(data.data.loan.dueAt).format("DD MMM YYYY")
        : "";
      toast.success(due ? `Borrow success! Due: ${due}` : "Borrow success!");
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["book", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to borrow book");
    },
  });

  const handleBorrowNow = () => {
    if (book) {
      borrowBookMutation.mutate(book.id);
    }
  };

  if (isBookLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LandingNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
        <LandingFooter />
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <LandingNavbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-xl font-bold text-neutral-600 font-quicksand">Book not found</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/home">Back to Home</Link>
          </Button>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-quicksand">
      <LandingNavbar />

      <main className="container mx-auto px-4 md:px-10 py-8 pb-20 md:pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="text-blue-600 font-bold hover:underline">Home</Link>
          <ChevronRight className="h-4 w-4 text-neutral-400" />
          {book.category && (
            <>
              <Link to={`/home?category=${book.category.id}`} className="text-blue-600 font-bold hover:underline">
                {book.category.name}
              </Link>
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </>
          )}
          <span className="text-neutral-900 font-bold truncate">{book.title}</span>
        </nav>

        {/* Hero Section: Cover & Info */}
        <section className="flex flex-col md:flex-row gap-8 md:gap-14 mb-16 items-start">
          {/* Book Cover */}
          <div className="w-[222px] h-[328px] md:w-[337px] md:h-[498px] rounded-[12px] overflow-hidden shadow-2xl flex-shrink-0 mx-auto md:mx-0 bg-neutral-100">
            <img 
              src={book.coverImage || "/assets/book-cover-placeholder.png"} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Info */}
          <div className="flex-1 w-full">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-neutral-500 text-[12px] md:text-[14px] font-bold mb-3">
                {book.category?.name || "Category"}
              </span>
              <h1 className="text-[28px] md:text-[40px] font-bold text-neutral-950 leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-[16px] md:text-[18px] text-neutral-500 font-medium mb-4">
                {book.author?.name || "Author"}
              </p>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-[16px] md:text-[18px] font-bold text-neutral-900">
                  {book.rating?.toFixed(1) || "4.9"}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-0 mb-8 py-6 border-y border-[#F2F4F7]">
               <div className="flex flex-col items-center md:items-start justify-center">
                  <p className="text-[24px] md:text-[32px] font-bold text-neutral-900 leading-none mb-2">{book.publishedYear || "---"}</p>
                  <p className="text-[14px] md:text-[16px] text-neutral-500 font-medium">Year</p>
               </div>
               <div className="flex flex-col items-center md:items-start justify-center border-x border-[#F2F4F7] px-2 md:px-10">
                  <p className="text-[24px] md:text-[32px] font-bold text-neutral-900 leading-none mb-2">{book.rating?.toFixed(1) || "0.0"}</p>
                  <p className="text-[14px] md:text-[16px] text-neutral-500 font-medium">Rating</p>
               </div>
               <div className="flex flex-col items-center md:items-start justify-center px-2 md:px-10">
                  <p className="text-[24px] md:text-[32px] font-bold text-neutral-900 leading-none mb-2">{book.reviewCount || 0}</p>
                  <p className="text-[14px] md:text-[16px] text-neutral-500 font-medium">Reviews</p>
               </div>
            </div>

            {/* Description (Inside Column) */}
            <div className="mb-10">
              <h3 className="text-[18px] md:text-[20px] font-bold text-neutral-950 mb-3">Description</h3>
              <p className="text-neutral-500 leading-relaxed text-[16px] font-medium whitespace-pre-line">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {/* Actions (Desktop Only) */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                variant="outline" 
                className="h-[56px] min-w-[180px] rounded-full border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 text-[16px]"
              >
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                onClick={handleBorrowNow}
                disabled={borrowBookMutation.isPending}
                className="h-[56px] min-w-[180px] rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md text-[16px]"
              >
                {borrowBookMutation.isPending ? "Borrowing..." : "Borrow Book"}
              </Button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-[#F2F4F7] mb-16" />

        {/* Reviews Section */}
        <section className="mb-0">
           <h2 className="text-[24px] md:text-[32px] font-bold text-neutral-950 mb-6">Review</h2>
           
           <div className="flex items-center gap-2 mb-10">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-[18px] md:text-[20px] font-bold text-neutral-900">
                {book.rating?.toFixed(1) || "4.9"} ({book.reviewCount || "24"} Reviews)
              </span>
           </div>

           {/* Review Cards Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="p-6 md:p-8 rounded-[16px] bg-white border border-[#F2F4F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-3 mb-5">
                      <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                         {review.user?.profilePhoto ? (
                           <img src={review.user.profilePhoto} alt={review.user.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center font-bold text-blue-600 bg-blue-50">
                             {review.user?.name?.charAt(0) || "U"}
                           </div>
                         )}
                      </div>
                      <div>
                         <p className="font-bold text-neutral-900 text-[16px]">{review.user?.name || "John Doe"}</p>
                         <p className="text-[12px] text-neutral-400 font-medium">
                           {dayjs(review.createdAt).format("DD August YYYY, HH:mm")}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                         <Star 
                           key={s} 
                           className={`w-[18px] h-[18px] ${s <= review.star ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}`} 
                         />
                      ))}
                   </div>
                   <p className="text-neutral-500 leading-[1.6] font-medium text-[16px]">
                     {review.comment}
                   </p>
                </div>
              )) : (
                 // Placeholder reviews if empty to match design
                 [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 md:p-8 rounded-[16px] bg-white border border-[#F2F4F7] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                       <div className="flex items-center gap-3 mb-5">
                          <div className="w-[48px] h-[48px] rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                             <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="font-bold text-neutral-900 text-[16px]">John Doe</p>
                             <p className="text-[12px] text-neutral-400 font-medium">25 August 2025, 13:38</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((s) => (
                             <Star key={s} className="w-[18px] h-[18px] fill-yellow-400 text-yellow-400" />
                          ))}
                       </div>
                       <p className="text-neutral-500 leading-[1.6] font-medium text-[16px]">
                         Lorem ipsum dolor sit amet consectetur. Pulvinar porttitor aliquam viverra nunc sed facilisis. Integer tristique nullam morbi mauris ante.
                       </p>
                    </div>
                 ))
              )}
           </div>

           {reviews.length > 6 && (
             <div className="flex justify-center mb-6">
               <Button variant="outline" className="w-[344px] h-[56px] rounded-full border border-[#D5D7DA] text-neutral-900 font-bold hover:bg-neutral-50 text-[16px]">
                 Load More
               </Button>
             </div>
           )}
        </section>

        {/* Related Books Section */}
        <section className="mt-0 mb-0 pt-6 border-t border-[#F2F4F7]">
           <RecommendedBooks title="Related Books" limit={5} />
        </section>
      </main>

      <LandingFooter />

      {/* Mobile Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F2F4F7] p-4 flex gap-4 md:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Button 
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
          variant="outline" 
          className="h-[48px] flex-1 rounded-full border border-blue-600 text-blue-600 font-bold hover:bg-blue-50 text-[14px]"
        >
          {addToCartMutation.isPending ? "..." : "Add to Cart"}
        </Button>
        <Button 
          onClick={handleBorrowNow}
          disabled={borrowBookMutation.isPending}
          className="h-[48px] flex-[1.5] rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md text-[14px]"
        >
          {borrowBookMutation.isPending ? "Borrowing..." : "Borrow Book"}
        </Button>
      </div>
    </div>
  );
}

