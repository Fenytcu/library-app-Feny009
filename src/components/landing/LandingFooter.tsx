import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const SOCIAL_LINKS = [
  { name: "Facebook",  src: "/assets/Facebook.png",  to: "/coming-soon" },
  { name: "Instagram", src: "/assets/Instagram.png", to: "/coming-soon" },
  { name: "Linkedin",  src: "/assets/Linkedin.png",  to: "/coming-soon" },
  { name: "Tiktok",   src: "/assets/Tiktok.png",    to: "/coming-soon" },
]

export function LandingFooter() {
  return (
    <footer className="bg-white py-12 border-t">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <img src="/assets/Logo.png" alt="Booky Logo" className="h-10 w-10" />
          <span className="text-[32px] font-bold text-neutral-950 font-quicksand">Booky</span>
        </div>

        <p className="text-neutral-950 md:max-w-[1140px] max-w-[361px] text-center md:text-[16px] text-[14px] font-semibold mb-10 font-quicksand">
          Discover inspiring stories &amp; timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.
        </p>

        <div className="flex flex-col items-center gap-4">
          <h3 className="font-bold text-[16px] text-neutral-900 font-quicksand mb-5">Follow on Social Media</h3>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ name, src, to }) => (
              <Link key={name} to={to}>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-neutral-300 p-0 overflow-hidden"
                >
                  <img src={src} alt={name} className="h-10 w-10 object-contain" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
