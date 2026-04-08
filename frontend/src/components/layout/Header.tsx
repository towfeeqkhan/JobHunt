import { useState } from "react";
import { SunIcon, MoonIcon, SearchIcon, MenuIcon } from "../icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 lg:px-12 shrink-0 z-10 relative bg-surface-container-lowest">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden bg-transparent border-0 text-on-surface-variant cursor-pointer flex items-center justify-center p-2 transition-colors hover:text-on-surface hover:bg-surface-container-low rounded-full"
        >
          <MenuIcon />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-50 sm:max-w-75 lg:w-96">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="w-full bg-surface-container-low rounded-full border-0 py-2.5 pr-4 pl-11 font-body text-sm text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border-0 cursor-pointer shrink-0"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="font-body font-semibold text-sm hidden sm:block">
              {user?.name || "User"}
            </span>
            <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center border border-surface-container-high shadow-sm group-hover:ring-2 ring-primary/20 transition-all">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=1149f0&color=fff`}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-3 w-56 bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgba(25,28,30,0.08)] border border-surface-container-high/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-surface-container-high/50">
                  <p className="font-body font-bold text-sm text-on-surface">
                    {user?.name || "User"}
                  </p>
                  <p className="font-body text-[13px] text-on-surface-variant mt-1 tracking-wide">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-[13px] tracking-wide font-body font-extrabold text-[#dc2626] hover:bg-[#fef2f2] rounded-md transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
