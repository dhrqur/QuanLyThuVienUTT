import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, logout } from "@/utils/session";

function Header({ onMenuOpen }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Mở menu điều hướng"
          className="grid size-11 shrink-0 place-items-center rounded-xl text-[#25245A] transition hover:bg-slate-50 lg:hidden"
          onClick={onMenuOpen}
          type="button"
        >
          <Menu className="size-5" />
        </button>
        <div className="relative h-8 w-[132px] shrink-0 overflow-hidden sm:h-9 sm:w-[190px] md:w-[220px]">
          <img
            alt="Trường Đại học Công nghệ Giao thông Vận tải"
            className="absolute left-0 top-1/2 w-full -translate-y-1/2"
            src="/logo_utt_transparent.png"
          />
        </div>
      </div>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-slate-50 sm:gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-orange-500">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="max-w-28 truncate text-sm font-bold text-[#25245A]">{user?.name}</p>
                <p className="mt-0.5 text-xs text-[#59617F]">{user?.role}</p>
              </div>
              <ChevronDown className="hidden size-4 text-slate-500 sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
              onSelect={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="size-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-rose-50 text-rose-500">
              <LogOut />
            </AlertDialogMedia>
            <AlertDialogTitle>Xác nhận đăng xuất?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-500 hover:bg-rose-600" onClick={handleLogout}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}

export default Header;
