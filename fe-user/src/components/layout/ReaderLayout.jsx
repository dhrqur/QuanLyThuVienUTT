import { BookOpen, ClipboardList, Home, LogOut, Search, UserRound } from "lucide-react";
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router";

import { useCart } from "@/contexts/cart";
import { clearSession, getSession } from "@/utils/session";

const navigation = [
  ["/", "Tổng quan", Home],
  ["/tra-cuu", "Tra cứu", Search],
  ["/yeu-cau", "Yêu cầu", ClipboardList],
  ["/muon-tra", "Mượn trả", BookOpen],
  ["/tai-khoan", "Tài khoản", UserRound],
];

export default function ReaderLayout({ children }) {
  const session = getSession();
  const navigate = useNavigate();
  const { items } = useCart();
  const logoutDialogRef = useRef(null);

  function openLogoutDialog() {
    logoutDialogRef.current?.showModal();
  }

  function logout() {
    clearSession();
    navigate("/dang-nhap", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <a
        className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-brand px-4 py-2 text-white focus:translate-y-0"
        href="#main-content"
      >
        Bỏ qua điều hướng
      </a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
        <Brand />
        <nav aria-label="Điều hướng chính" className="mt-8 space-y-1">
          {navigation.map(([to, label, Icon]) => (
            <NavItem Icon={Icon} key={to} label={label} to={to} />
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-black text-brand">{session?.name}</p>
          <p className="text-xs text-slate-500">{session?.id}</p>
          <button
            className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
            onClick={openLogoutDialog}
            type="button"
          >
            <LogOut className="size-4" />
            Đăng xuất
          </button>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 lg:ml-60 lg:px-8">
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-3">
          <span className="hidden text-sm font-bold text-slate-600 sm:block">
            Xin chào, {session?.name}
          </span>
          {items.length > 0 && (
            <NavLink
              className="rounded-full bg-accent-soft px-3 py-1 text-xs font-black text-accent"
              to="/tra-cuu"
            >
              <span className="sm:hidden">Giỏ: {items.length}</span>
              <span className="hidden sm:inline">Giỏ mượn: {items.length}</span>
            </NavLink>
          )}
          <button
            aria-label="Đăng xuất"
            className="flex size-11 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 lg:hidden"
            onClick={openLogoutDialog}
            type="button"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>
      <main
        className="mx-auto max-w-[1440px] px-3 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-4 sm:pt-6 lg:ml-60 lg:px-8 lg:pb-10"
        id="main-content"
        tabIndex="-1"
      >
        {children}
      </main>
      <nav aria-label="Điều hướng di động" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] lg:hidden">
        {navigation.map(([to, label, Icon]) => (
          <NavItem Icon={Icon} compact key={to} label={label} to={to} />
        ))}
      </nav>
      <dialog
        aria-describedby="logout-description"
        aria-labelledby="logout-title"
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-slate-200 bg-white p-0 text-slate-800 shadow-xl backdrop:bg-slate-950/40"
        ref={logoutDialogRef}
      >
        <div className="p-6">
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <LogOut aria-hidden="true" className="size-5" />
          </div>
          <h2 className="text-lg font-black text-brand" id="logout-title">Xác nhận đăng xuất?</h2>
          <p className="mt-2 text-sm text-slate-600" id="logout-description">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button className="button-secondary" onClick={() => logoutDialogRef.current?.close()} type="button">
              Hủy
            </button>
            <button
              className="min-h-11 rounded-lg bg-rose-600 px-4 font-extrabold text-white hover:bg-rose-700"
              onClick={logout}
              type="button"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-sm font-black text-white">
        UTT
      </span>
      {!compact && (
        <div>
          <p className="font-black leading-tight text-brand">Thư viện UTT</p>
          <p className="text-[11px] text-slate-500">Cổng thông tin độc giả</p>
        </div>
      )}
    </div>
  );
}

function NavItem({ Icon, compact, label, to }) {
  return (
    <NavLink
      className={({ isActive }) => {
        if (compact) {
          return `flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${isActive ? "text-accent" : "text-slate-500"}`;
        }

        return `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold ${isActive ? "bg-accent-soft text-accent" : "text-slate-600 hover:bg-slate-50"}`;
      }}
      end={to === "/"}
      to={to}
    >
      <Icon className={compact ? "size-5" : "size-[18px]"} />
      <span className={compact ? "max-w-full truncate px-0.5" : undefined}>{label}</span>
    </NavLink>
  );
}
