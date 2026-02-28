import { Link, useParams } from "react-router-dom"
import image from "../../assets/fiction.png";
import image2 from "../../assets/non fiction.png";
import image3 from "../../assets/self-improvement.png";
import image4 from "../../assets/finance.png";
import image5 from "../../assets/science.png";
import image6 from "../../assets/education.png";

const categories = [
  { name: "Fiction", icon: image, slug: "fiction" },
  { name: "Non-Fiction", icon: image2, slug: "non-fiction" },
  { name: "Self-Improvement", icon: image3, slug: "self-improvement" },
  { name: "Finance", icon: image4, slug: "finance" },
  { name: "Science", icon: image5, slug: "science" },
  { name: "Education", icon: image6, slug: "education" },
]

export function CategorySection() {
  // Get the current category slug from URL (only exists on /category/:name)
  const { name: activeSlug } = useParams<{ name?: string }>()

  return (
    <section className="w-full px-4 md:px-10 py-8">
      <div className="grid grid-cols-3 md:grid-cols-6 font-quicksand justify-center gap-[8px] md:gap-[24px]">
        {categories.map((category) => {
          const isActive = activeSlug === category.slug

          return (
            <Link
              key={category.name}
              to={`/category/${category.slug}`}
              className={`w-full aspect-[4/3] rounded-[12px] p-[8px] md:p-[16px] flex flex-col items-center justify-between gap-[8px] md:gap-[16px] transition-all group
                ${isActive
                  ? "bg-blue-600 shadow-[0_4px_24px_rgba(37,99,235,0.35)]"
                  : "bg-white shadow-[0_0_20px_rgba(203,202,202,0.25)] hover:shadow-[0_0_25px_rgba(203,202,202,0.4)]"
                }`}
            >
              <div
                className={`w-full h-[50px] md:h-[70px] rounded-[8px] md:rounded-[12px] flex items-center justify-center overflow-hidden transition-colors
                  ${isActive
                    ? "bg-blue-500"
                    : "bg-[#EAF2FF] group-hover:bg-[#DBEAFE]"
                  }`}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-[80%] h-[80%] object-contain"
                />
              </div>
              <span
                className={`text-[12px] md:text-[18px] font-semibold font-quicksand truncate w-full text-center transition-colors
                  ${isActive ? "text-white" : "text-neutral-900"}`}
              >
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
