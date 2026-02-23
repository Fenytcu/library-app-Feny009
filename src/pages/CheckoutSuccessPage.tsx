import { useNavigate, useLocation } from "react-router-dom";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive returnDate from navigation state (passed from CheckoutPage)
  const returnDateStr = (location.state as { returnDate?: string } | null)?.returnDate;
  const returnDate = returnDateStr ? new Date(returnDateStr) : null;

  return (
    <div className="min-h-screen bg-white font-quicksand flex flex-col">
      <LandingNavbar />

      {/* ── Centered content ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">

        {/* Card — 345px mobile / 638px desktop */}
        <div
          className="
            flex flex-col items-center text-center
            w-full max-w-[345px] md:max-w-[638px]
            gap-6 md:gap-8
          "
        >
          {/* Blue checkmark circle */}
          <div className="w-[72px] h-[72px] rounded-full bg-[#1C65DA] flex items-center justify-center flex-shrink-0">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-[20px] md:text-[24px] font-bold text-[#0A0D12]">
            Borrowing Successful!
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] md:text-[16px] font-medium text-neutral-600 leading-relaxed">
            Your book has been successfully borrowed.{" "}
            {returnDate ? (
              <>
                Please return it by{" "}
                <span className="text-[#EE1D52] font-semibold">
                  {formatDate(returnDate)}
                </span>
              </>
            ) : (
              "Please return it before the due date."
            )}
          </p>

          {/* Button */}
          <button
            onClick={() => navigate("/my-loans")}
            className="
              h-[48px] px-10 rounded-full
              bg-[#1C65DA] hover:bg-[#1550bb]
              text-white font-bold text-[14px] md:text-[16px]
              transition-colors
            "
          >
            See Borrowed List
          </button>
        </div>
      </div>
    </div>
  );
}
