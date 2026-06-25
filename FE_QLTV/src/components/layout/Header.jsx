import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logout } from "@/utils/auth";

function Header({ onToggleSidebar, sidebarCollapsed }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
      <Button
        aria-label={sidebarCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
        className="text-slate-600"
        onClick={onToggleSidebar}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Menu className="size-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-slate-200 hover:bg-slate-50">
            <div className="size-10 overflow-hidden rounded-full bg-orange-100">
              <div className="flex size-full items-center justify-center text-sm font-extrabold text-orange-600">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs font-medium text-slate-500">{user?.role}</p>
            </div>
            <ChevronDown className="size-4 text-slate-500" />
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
    </header>
  );
}

export default Header;
