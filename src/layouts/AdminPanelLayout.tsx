// Shared layout shell for standalone admin panel pages
import { type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation tabs shown in the header
const NAV_TABS = [
  { label: "Borrowed List", href: "/admin/borrowed-list" },
  { label: "User",          href: "/admin/user-list" },
  { label: "Book List",     href: "/admin/book-list" },
];

interface AdminPanelLayoutProps {
  children: ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAppSelector((s) => s.auth);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-quicksand">
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-[#EAECF0] sticky top-0 z-50">
        <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/assets/Logo.png" alt="Booky" className="h-8 w-8" />
            <span className="text-xl font-bold text-[#0A0D12]">Booky</span>
          </Link>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#EFF4FF] flex items-center justify-center text-[#1C65DA] text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block text-sm font-semibold text-[#0A0D12]">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-[#667085]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/borrowed-list" className="cursor-pointer">
                  Borrowed List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/user-list" className="cursor-pointer">
                  User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/book-list" className="cursor-pointer">
                  Book List
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="w-full mx-auto px-6">
          <div className="flex gap-0">
            {NAV_TABS.map((tab) => {
              const isActive = location.pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  to={tab.href}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                    isActive
                      ? "border-[#1C65DA] text-[#1C65DA]"
                      : "border-transparent text-[#667085] hover:text-[#0A0D12]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main className="w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
