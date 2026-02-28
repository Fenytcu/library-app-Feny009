// Update Profile Page Component
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { userApi } from "@/features/users/userApi";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Loader2, Camera, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";

export default function UpdateProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // ── Data Fetching ──
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userApi.getMe,
  });

  useEffect(() => {
    if (profileData?.data?.profile) {
      const p = profileData.data.profile;
      setName(p.name || "");
      setPhone(p.phone || "");
      setPhotoPreview(p.profilePhoto || null);
    }
  }, [profileData]);

  // ── Mutation ──
  const updateMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (response) => {
      toast.success("Profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      
      // Update global auth state with the new user details including profilePhoto
      if (response && response.data && response.data.profile && user && token) {
        dispatch(setCredentials({
          user: { ...user, ...response.data.profile },
          token: token
        }));
      }

      navigate("/profile");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui profil.");
    },
  });

  // ── Handlers ──
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoBase64(result); // Assuming API takes base64 or URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }
    
    updateMutation.mutate({
      name,
      phone,
      profilePhoto: photoBase64 || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand flex flex-col">
      <LandingNavbar />

      <main className="w-full mx-auto py-8 px-4 md:px-10">
        <div className="max-w-[557px] mx-auto">
          
          {/* Back Button */}
          <Link 
            to="/profile" 
            className="inline-flex items-center gap-2 text-[#667085] hover:text-[#0A0D12] transition-colors mb-6 font-medium text-[14px]"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          <h1 className="text-[28px] md:text-[32px] font-bold text-[#0A0D12] mb-6">Update Profile</h1>
          
          {profileLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="bg-white border border-[#F2F4F7] rounded-[24px] p-6 md:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              
              <form onSubmit={handleSave} className="flex flex-col">
                
                {/* Photo Upload */}
                <div className="flex flex-col items-center mb-10">
                  <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                    <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-lg bg-neutral-100 border-4 border-white transition-transform group-hover:scale-[1.02]">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
                          <Camera className="w-10 h-10 opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#1C65DA] p-2 rounded-full border-2 border-white text-white shadow-md transition-transform group-hover:scale-110">
                      <Camera className="w-4 h-4" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <p className="mt-3 text-[13px] text-neutral-400 font-medium">Click to change photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-[14px] font-bold text-[#344054] mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full h-[52px] px-4 rounded-[12px] border border-[#D0D5DD] focus:border-[#1C65DA] focus:ring-1 focus:ring-[#1C65DA] outline-none transition-all placeholder:text-neutral-400 font-medium"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[#344054] mb-2">Nomor Handphone</label>
                    <input
                      type="tel"
                      className="w-full h-[52px] px-4 rounded-[12px] border border-[#D0D5DD] focus:border-[#1C65DA] focus:ring-1 focus:ring-[#1C65DA] outline-none transition-all placeholder:text-neutral-400 font-medium"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button 
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full h-[52px] rounded-full bg-[#1C65DA] hover:bg-[#1550bb] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-[16px] transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                >
                  {updateMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </form>

            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
