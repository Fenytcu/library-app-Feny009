
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { bookApi } from "@/features/books/bookApi";


export function HeroSection() {
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await bookApi.getRecommendations({ page: 1, limit: 2 });
        if (response.success && response.data?.books) {
          setRecommendedBooks(response.data.books);
        }
      } catch (error) {
        console.error("Gagal mengambil rekomendasi:", error);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <section className="w-full px-4 md:px-10 md:mt-[48px] mt-[16px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {/* --- SLIDE 1: WELCOME (STATIS) --- */}
        <SwiperSlide>
          <div className="relative w-full h-[220px] md:h-[441px] overflow-hidden rounded-[16px] md:rounded-[32px]">
            {/* Background */}
            <img 
              src="/assets/background-welcome.png" 
              alt="Background Welcome" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Tulisan Welcome */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img 
                src="/assets/welcome.png" 
                alt="Welcome to Booky" 
                className="w-auto h-auto max-w-[75%] sm:max-w-[200px] md:max-w-[656px] object-contain"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* --- SLIDE 2 & 3: REKOMENDASI BUKU (DINAMIS DARI API) --- */}
        {recommendedBooks.map((book) => (
          <SwiperSlide key={book.id}>
            <Link to={`/books/${book.id}`} className="block">
              <div className="relative w-full h-[220px] md:h-[441px] bg-slate-200 overflow-hidden rounded-[16px] md:rounded-[32px]">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover blur-sm opacity-40"
                />
                <div className="absolute inset-0 flex flex-row items-center justify-center gap-1 sm:gap-6 md:gap-12 p-2 sm:p-4 mx-[2%] sm:mx-[10%] max-w-4xl w-full sm:w-auto">
                  {/* Left Side: Book Image (Much larger presentation proportionally scaling naturally & border removed) */}
                  <img 
                    src={book.coverImage} 
                    className="h-[140px] sm:h-[180px] md:h-[320px] w-auto rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] object-contain flex-[0.55] sm:flex-[0.7] md:flex-none md:max-w-[45%]" 
                    alt="Book Cover"
                  />
                  {/* Right Side: Text Description Box (Constrained max space effectively wrapping tight blocks) */}
                  <div className="text-left bg-white/95 p-3 sm:p-5 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg flex-1 line-clamp-3 md:line-clamp-none min-w-[50%] md:min-w-[40%] text-wrap break-words">
                    <span className="text-blue-600 font-bold text-[8px] sm:text-[10px] md:text-sm uppercase tracking-widest hidden sm:block mb-1">Special Recommendation</span>
                    <h2 className="text-[12px] sm:text-xl md:text-3xl font-bold font-quicksand text-neutral-900 leading-[1.3] md:line-clamp-3">{book.title}</h2>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Style untuk Dots Pagination agar Biru seperti di Figma */}
      <style>{`
        .swiper-pagination-bullet { background: #BFDBFE; opacity: 1; transition: width 0.3s; }
        .swiper-pagination-bullet-active { background: #2563EB; width: 20px; border-radius: 4px; }
        .swiper { padding-bottom: 30px; }
        .swiper-pagination { bottom: 0 !important; }
      `}</style>
    </section>
  );
}