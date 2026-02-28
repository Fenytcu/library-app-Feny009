import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useQuery } from "@tanstack/react-query"
import { cartApi } from "@/features/cart/cartApi"
import { logout } from "@/features/auth/authSlice"
import { authorApi } from "@/features/authors/authorApi"
import { setSearchQuery } from "@/store/uiSlice"
import { User as UserIcon, Search, X, User, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LandingNavbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { searchQuery } = useAppSelector((state) => state.ui)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearch, setTempSearch] = useState(searchQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Sync temp search with global state when it changes elsewhere
  useEffect(() => {
    setTempSearch(searchQuery)
  }, [searchQuery])

  // Fetch Authors for suggestions
  const { data: authorData } = useQuery({
    queryKey: ['author-suggestions', tempSearch],
    queryFn: () => authorApi.getAuthors({ search: tempSearch, limit: 5 }),
    enabled: tempSearch.length > 1 && isSearchOpen,
  })

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  })

  const cartCount = cartData?.data?.itemCount || 0

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    dispatch(setSearchQuery(tempSearch))
    if (location.pathname !== '/home') {
      navigate('/home')
    }
    setIsSearchOpen(false)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (authorName: string) => {
    dispatch(setSearchQuery(authorName))
    setTempSearch(authorName)
    if (location.pathname !== '/home') {
      navigate('/home')
    }
    setIsSearchOpen(false)
    setShowSuggestions(false)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const suggestions = authorData?.data?.authors 
    ? [...authorData.data.authors].sort((a, b) => a.name.localeCompare(b.name))
    : []

  return (
    <nav className="border-b border-[#CBCACA] bg-white sticky top-0 z-50">
      <div className="w-full flex h-[72px] items-center justify-between px-4 md:px-10">
        
        {/* Sisi Kiri: Logo & Nama Brand */}
        <Link to="/" className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <img src="/assets/Logo.png" alt="Booky Logo" className="h-8 w-8 md:h-10 md:w-10" />
          {!isSearchOpen && (
            <span className="text-xl md:text-[32px] font-bold text-neutral-950 font-quicksand">
              Booky
            </span>
          )}
        </Link>

        {/* UI Elements Section */}
        {isSearchOpen ? (
          /* --- MOBILE SEARCH BAR (Toggleable) --- */
          <div className="flex items-center gap-3 md:hidden relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="w-[265px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search book"
                value={tempSearch}
                onChange={(e) => {
                  setTempSearch(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-[40px] pl-10 pr-4 rounded-full border border-[#D5D7DA] focus:outline-none focus:border-blue-500 font-quicksand text-sm"
              />
            </form>
            <button onClick={() => setIsSearchOpen(false)} className="p-1">
              <X className="h-6 w-6 text-neutral-600" />
            </button>

            {/* Mobile Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-[48px] left-0 w-[265px] bg-white border border-[#D5D7DA] rounded-xl shadow-xl overflow-hidden z-[60]">
                <div className="py-2">
                  <p className="px-4 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-quicksand">Authors suggestions</p>
                  {suggestions.map((author) => (
                    <button
                      key={author.id}
                      onClick={() => handleSuggestionClick(author.name)}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <User size={14} className="text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-800 font-quicksand">{author.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- DESKTOP SEARCH & ICONS --- */
          <>
            {/* Desktop Search (Only when authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center flex-1 max-w-[500px] mx-8 relative" ref={dropdownRef}>
                <form onSubmit={handleSearchSubmit} className="w-full relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search book"
                    value={tempSearch}
                    onChange={(e) => {
                      setTempSearch(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full h-[44px] pl-12 pr-4 rounded-full border border-[#D5D7DA] focus:outline-none focus:border-blue-500 font-quicksand text-sm md:text-base font-medium"
                  />
                </form>

                {/* Desktop Dropdown Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-[52px] left-0 w-full bg-white border border-[#D5D7DA] rounded-xl shadow-xl overflow-hidden z-[60]">
                    <div className="py-2">
                      <p className="px-4 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-quicksand">Authors suggestions</p>
                      {suggestions.map((author) => (
                        <button
                          key={author.id}
                          onClick={() => handleSuggestionClick(author.name)}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
                        >
                          <User size={16} className="text-neutral-400" />
                          <span className="text-sm md:text-base font-medium text-neutral-800 font-quicksand">{author.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sisi Kanan: Mobile Icons & Desktop Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* --- VERSI MOBILE ICONS (When not searching) --- */}
              <div className="flex items-center gap-1 md:hidden">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2"
                >
                  <img src="/assets/search.png" alt="Search" className="h-6 w-6 object-contain" />
                </button>
                
                <Link to="/cart" className="relative p-2">
                  <img src="/assets/Bag.png" alt="Cart" className="h-6 w-6 object-contain" />
                  {cartCount > 0 && (
                    <span className="absolute top-[2px] right-[2px] flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-[#EF4444] text-[10px] text-white font-bold border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 focus:outline-none">
                        {user?.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserIcon size={18} />
                          </div>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-[361px] rounded-[16px] p-4 bg-white border border-[#F2F4F7] shadow-xl flex flex-col gap-4"
                    >
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                        <Link
                          to="/profile?tab=profile"
                          className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'ADMIN' ? (
                        <>
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                            <Link
                              to="/admin/borrowed-list"
                              className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                            >
                              Borrowed List
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                            <Link
                              to="/admin/user-list"
                              className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                            >
                              User
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                            <Link
                              to="/admin/book-list"
                              className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                            >
                              Book List
                            </Link>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                            <Link
                              to="/my-loans"
                              className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                            >
                              Borrowed List
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                            <Link
                              to="/my-reviews"
                              className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                            >
                              Reviews
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer"
                      >
                        <span className="text-[16px] font-bold text-[#EF4444] font-quicksand leading-none hover:opacity-80 transition-opacity">
                          Logout
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 focus:outline-none">
                        <img src="/assets/menu.png" alt="Menu" className="h-6 w-6 object-contain" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className="w-[200px] rounded-[16px] p-4 bg-white border border-[#F2F4F7] shadow-xl flex flex-col gap-4"
                    >
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                        <Link
                          to="/login"
                          className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                        >
                          Login
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                        <Link
                          to="/register"
                          className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                        >
                          Register
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* --- VERSI DESKTOP ICONS/AUTH --- */}
              <div className="hidden md:flex items-center gap-6">
                {isAuthenticated ? (
                  <>
                    <Link to="/cart" className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors">
                      <img src="/assets/Bag.png" alt="Cart" className="h-7 w-7 object-contain" />
                      {cartCount > 0 && (
                        <span className="absolute top-[0px] right-[0px] flex h-[20px] min-w-[20px] px-1 items-center justify-center rounded-full bg-[#EF4444] text-[11px] text-white font-bold border-2 border-white">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 hover:bg-neutral-50 px-2 py-1.5 rounded-full transition-colors focus:outline-none">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                              <UserIcon size={20} />
                            </div>
                          )}
                          <span className="text-[14px] md:text-[16px] font-bold text-neutral-900 font-quicksand ml-1">{user?.name || "User"}</span>
                          <ChevronDown className="h-4 w-4 text-neutral-900" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-[184px] rounded-[16px] p-4 bg-white border border-[#F2F4F7] shadow-xl flex flex-col gap-4"
                      >
                        <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                          <Link
                            to="/profile?tab=profile"
                            className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                          >
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        {user?.role === 'ADMIN' ? (
                          <>
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                              <Link
                                to="/admin/borrowed-list"
                                className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                              >
                                Borrowed List
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                              <Link
                                to="/admin/user-list"
                                className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                              >
                                User
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                              <Link
                                to="/admin/book-list"
                                className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                              >
                                Book List
                              </Link>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                              <Link
                                to="/my-loans"
                                className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                              >
                                Borrowed List
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer">
                              <Link
                                to="/my-reviews"
                                className="w-full text-[16px] font-bold text-neutral-900 font-quicksand leading-none hover:text-blue-600 transition-colors"
                              >
                                Reviews
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="p-0 focus:bg-transparent hover:bg-transparent cursor-pointer"
                        >
                          <span className="text-[16px] font-bold text-[#EF4444] font-quicksand leading-none hover:opacity-80 transition-opacity">
                            Logout
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      asChild 
                      className="rounded-full border-neutral-300 px-8 h-[48px] w-[140px] lg:w-[163px] font-quicksand font-bold text-neutral-950"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="rounded-full bg-blue-600 px-8 h-[48px] w-[140px] lg:w-[163px] hover:bg-blue-700 text-white font-quicksand font-bold shadow-md"
                    >
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}