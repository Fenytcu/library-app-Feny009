import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Borrowed List', path: '/admin/borrowed' },
    { name: 'User', path: '/admin/users' },
    { name: 'Authors', path: '/admin/authors' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Book List', path: '/admin/books' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-quicksand">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <img src="/assets/Logo.png" alt="Booky Logo" className="h-8 w-8" />
             <span className="text-xl font-bold text-neutral-950">Booky</span>
          </div>

          <div className="flex items-center gap-4">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-neutral-100">
                  <div className="flex items-center gap-2">
                    {user?.profilePhoto ? (
                       <img src={user.profilePhoto} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                         <UserIcon size={18} />
                       </div>
                    )}
                    <span className="font-semibold text-sm hidden md:block">{user?.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Centered) */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 inline-flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin/borrowed' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
