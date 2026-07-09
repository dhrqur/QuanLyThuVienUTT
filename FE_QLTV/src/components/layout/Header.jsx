import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logout } from "@/utils/session";

function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-end bg-white px-4 md:px-7">
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-slate-50 sm:gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-orange-500">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="max-w-28 truncate text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{user?.role}</p>
              </div>
              <ChevronDown className="hidden size-4 text-slate-500 sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
              onSelect={handleLogout}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
