
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
    <section className="container mx-auto px-4 md:mt-[48px] mt-[16px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="rounded-[16px] md:rounded-[32px] overflow-hidden"
      >
        {/* --- SLIDE 1: WELCOME (STATIS) --- */}
        <SwiperSlide>
          <div className="relative w-full aspect-[361/133] md:aspect-[1200/441] overflow-hidden rounded-[16px] md:rounded-[32px]">
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
                className="w-full max-w-[200px] md:max-w-[656px] object-contain"
              />
            </div>
          </div>
        </SwiperSlide>

        {/* --- SLIDE 2 & 3: REKOMENDASI BUKU (DINAMIS DARI API) --- */}
        {recommendedBooks.map((book) => (
          <SwiperSlide key={book.id}>
            <Link to="/reviews" className="block">
              <div className="relative w-full aspect-[361/133] md:aspect-[1200/441] bg-slate-200">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover blur-sm opacity-40"
                />
                <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 p-6">
                  <img 
                    src={book.coverImage} 
                    className="h-[140px] md:h-[280px] rounded-lg shadow-2xl border-4 border-white" 
                    alt="Book Cover"
                  />
                  <div className="text-center md:text-left bg-white/90 p-5 rounded-2xl backdrop-blur-md shadow-lg max-w-sm">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Special Recommendation</span>
                    <h2 className="text-xl md:text-3xl font-bold font-quicksand mt-2 text-neutral-900">{book.title}</h2>
                    <p className="text-sm md:text-lg text-neutral-600 mt-1 font-medium italic">by {book.authorName}</p>
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
        .swiper { padding-bottom: 40px; }
      `}</style>
    </section>
  );
}