import { useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-quicksand flex flex-col">
      <LandingNavbar />

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center text-center gap-6 max-w-[480px]">
          {/* Emoji / icon */}
          <div className="w-[80px] h-[80px] rounded-full bg-blue-50 flex items-center justify-center text-[40px]">
            🚀
          </div>

          <h1 className="text-[28px] md:text-[36px] font-bold text-[#0A0D12]">
            Coming Soon
          </h1>

          <p className="text-[14px] md:text-[16px] font-medium text-neutral-500 leading-relaxed">
            We're working hard to bring this page to you. Stay tuned for updates!
          </p>

          <button
            onClick={() => navigate(-1)}
            className="h-[48px] px-10 rounded-full bg-[#1C65DA] hover:bg-[#1550bb] text-white font-bold text-[16px] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
