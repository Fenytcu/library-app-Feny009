import { useQuery } from "@tanstack/react-query";
import { authorApi } from "@/features/authors/authorApi";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import bookIcon from "../../assets/Book.png";

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function PopularAuthors({ title = "Popular Authors" }: { title?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-authors'],
    queryFn: authorApi.getPopularAuthors,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data?.data?.authors || data.data.authors.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      <h2 className="text-[36px] font-bold font-quicksand mb-[40px] text-neutral-900 tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] md:gap-[20px]">
        {data.data.authors.map((author) => (
          <Link to={`/authors/${author.id}`} key={author.id} className="group">
            <div className="w-full h-[113px] bg-white rounded-[12px] p-[16px] shadow-[0_0_20px_rgba(203,202,202,0.25)] hover:shadow-[0_0_25px_rgba(203,202,202,0.4)] transition-all flex items-center gap-[16px]">
              <div className="w-[81px] h-[81px] rounded-full overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center">
                {author.photo && author.photo.startsWith("http") ? (
                  <img
                    src={author.photo}
                    alt={author.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-blue-600 font-bold font-quicksand text-[26px] select-none">
                    {getInitials(author.name)}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-[8px] overflow-hidden">
                <h3 className="text-[18px] font-bold text-neutral-900 line-clamp-1 font-quicksand flex-shrink-0">
                  {author.name}
                </h3>
                <div className="flex items-center gap-[8px] text-[#2563EB]">
                  <img src={bookIcon} alt="books" className="w-[24px] h-[24px] object-contain" />
                  <span className="text-[16px] font-semibold font-quicksand">{author.bookCount} books</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
