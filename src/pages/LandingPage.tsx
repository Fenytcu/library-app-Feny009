import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { CategorySection } from "@/components/landing/CategorySection"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { RecommendedBooks } from "@/features/books/RecommendedBooks"
import { PopularAuthors } from "@/features/authors/PopularAuthors"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      <LandingNavbar />
      
      <main className="space-y-4 pb-16">
        <HeroSection />
        
        <CategorySection />
        
        <section className="container mx-auto px-4 pt-8">
          {/* We use RecommendedBooks but we manage the title outside or let it handle it. 
              Since I updated RecommendedBooks to take a title prop, I can use that. 
              But wait, the design shows "Recommendation" as title. 
              RecommendedBooks has default "Recommended for You".
              I'll pass title="Recommendation" to override it if I want, 
              or just use the component and let it handle the grid. 
              The design shows "Recommendation" followed by grid.
              Let's pass title="" to RecommendedBooks and render our own title? 
              Or just pass title="Recommendation".
          */}
          <RecommendedBooks title="Recommendation" /> 
          {/* Wait, if I pass empty title, the h2 will be empty. 
             Reviewing my change to RecommendedBooks: 
             <h2 ...>{title}</h2>
             So if title is empty string, it shows empty h2.
             Actually the design shows "Recommendation" as the section header. 
             So I should pass title="Recommendation" (singular) as per user prompt/design?
             User prompt says "Recommendation" in the design image.
             So I will pass title="Recommendation".
          */}
        </section>

        <div className="container mx-auto px-4 mt-[48px]">
          <hr className="border-[#D5D7DA]" />
        </div>
        
        <section className="container mx-auto px-4 mt-[48px] mb-8">
             {/* Popular Authors usually has its own internal title, let's customize it too */}
             <PopularAuthors title="Popular Authors" />
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
