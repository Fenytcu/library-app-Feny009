import type { Book } from "@/types/book";
import { Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/books/${book.id}`)}
      className="group cursor-pointer w-full flex flex-col bg-white rounded-[16px] md:rounded-[24px] shadow-[0_4px_20px_rgba(203,202,202,0.25)] hover:shadow-[0_4px_25px_rgba(203,202,202,0.4)] transition-all duration-300 overflow-hidden"
    >
      {/* Container Image - Sesuai Desain: Rounded & Shadow */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {book.availableCopies === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold px-3 py-1 border border-white rounded-full">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Info Section - Sesuai Desain: Text Align Left */}
      <div className="flex flex-col h-[140px] p-[16px] md:p-[20px] gap-[8px] justify-center">
        <h3 className="text-[16px] md:text-[20px] font-bold text-neutral-900 line-clamp-1 font-quicksand text-left leading-tight">
          {book.title}
        </h3>
        {/* Author name — clickable link to author page */}
        <Link
          to={`/authors/${book.author?.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[14px] md:text-[16px] text-neutral-500 font-medium line-clamp-1 font-quicksand text-left hover:text-blue-600 hover:underline transition-colors w-fit mt-[4px]"
        >
          {book.author?.name}
        </Link>
        
        <div className="flex items-center gap-[6px] mt-auto">
          <Star className="w-[18px] h-[18px] fill-[#FBBF24] text-[#FBBF24]" />
          <span className="text-[14px] md:text-[16px] font-semibold text-neutral-900 font-quicksand leading-none">
            {book.rating || "0.0"}
          </span>
        </div>
      </div>
    </div>
  );
}