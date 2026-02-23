import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { userApi } from "@/features/users/userApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Loader2 } from "lucide-react";

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProfilePage() {
  // ── Data ──
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getMe,
  });

  const profile = profileData?.data?.profile;

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand flex flex-col">
      <LandingNavbar />

      <main className="flex-1 container mx-auto px-4 md:px-10 py-6 md:py-10 max-w-[1000px]">
        <div className="max-w-[557px] mx-auto">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#0A0D12] mb-6">Profile</h1>
          
          {profileLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="bg-white border border-[#F2F4F7] rounded-[24px] p-6 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center">
              
              {/* Large Avatar */}
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden mb-8 shadow-[0_4px_10px_rgba(0,0,0,0.1)] bg-neutral-100 flex-shrink-0">
                {profile?.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 text-[32px] font-bold uppercase">
                    {profile?.name?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info Rows */}
              <div className="w-full flex flex-col gap-6 mb-10">
                <div className="flex justify-between items-center text-[15px] md:text-[16px]">
                  <span className="font-medium text-[#667085]">Name</span>
                  <span className="font-bold text-[#0A0D12]">{profile?.name}</span>
                </div>
                <div className="flex justify-between items-center text-[15px] md:text-[16px]">
                  <span className="font-medium text-[#667085]">Email</span>
                  <span className="font-bold text-[#0A0D12]">{profile?.email}</span>
                </div>
                <div className="flex justify-between items-center text-[15px] md:text-[16px]">
                  <span className="font-medium text-[#667085]">Nomor Handphone</span>
                  <span className="font-bold text-[#0A0D12]">{profile?.phone || "-"}</span>
                </div>
              </div>

              {/* Update Profile Button */}
              <Link to="/profile/update" className="w-full">
                <button className="w-full h-[52px] rounded-full bg-[#1C65DA] hover:bg-[#1550bb] text-white font-bold text-[16px] transition-all active:scale-[0.98]">
                  Update Profile
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
