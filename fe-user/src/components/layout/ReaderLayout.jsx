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
  const logoutDialog = useRef(null);
  function logout() { clearSession(); navigate("/dang-nhap", { replace: true }); }

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <a className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-brand px-4 py-2 text-white focus:translate-y-0" href="#main-content">Bỏ qua điều hướng</a>
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
        <Brand />
        <nav aria-label="Điều hướng chính" className="mt-8 space-y-1">
          {navigation.map(([to, label, Icon]) => <NavItem Icon={Icon} key={to} label={label} to={to} />)}
        </nav>
        <div className="mt-auto border-t border-slate-100 pt-4">
          <p className="truncate text-sm font-black text-brand">{session?.name}</p>
          <p className="text-xs text-slate-500">{session?.id}</p>
          <button className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-lg px-3 text-sm font-bold text-rose-600 hover:bg-rose-50" onClick={() => logoutDialog.current.showModal()}><LogOut className="size-4" />Đăng xuất</button>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:ml-60 lg:px-8">
        <div className="lg:hidden"><Brand compact /></div>
        <div className="ml-auto flex items-center gap-3"><span className="hidden text-sm font-bold text-slate-600 sm:block">Xin chào, {session?.name}</span>{items.length > 0 && <NavLink className="rounded-full bg-accent-soft px-3 py-1 text-xs font-black text-accent" to="/tra-cuu">Giỏ mượn: {items.length}</NavLink>}</div>
      </header>
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 lg:ml-60 lg:px-8 lg:pb-10" id="main-content" tabIndex="-1">{children}</main>
      <nav aria-label="Điều hướng di động" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {navigation.map(([to, label, Icon]) => <NavItem Icon={Icon} compact key={to} label={label} to={to} />)}
      </nav>
      <dialog
        ref={logoutDialog}
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-black/50"
      >
        <h2 className="text-lg font-bold" id="logout-title">Xác nhận đăng xuất</h2>
        <p className="mt-2 text-sm text-slate-600" id="logout-description">Bạn có chắc muốn đăng xuất?</p>
        <form method="dialog" className="mt-6 flex flex-wrap justify-end gap-3">
          <button autoFocus className="button-secondary" type="submit">Hủy</button>
          <button className="flex min-h-11 items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-bold text-white hover:bg-rose-700" type="button" onClick={logout}>
            <LogOut className="size-4" /> Đăng xuất
          </button>
        </form>
      </dialog>
    </div>
  );
}

function Brand({ compact = false }) {
  return <div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-lg bg-brand text-sm font-black text-white">UTT</span>{!compact && <div><p className="font-black leading-tight text-brand">Thư viện UTT</p><p className="text-[11px] text-slate-500">Cổng thông tin độc giả</p></div>}</div>;
}

function NavItem({ Icon, compact, label, to }) {
  return <NavLink className={({ isActive }) => compact ? `flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${isActive ? "text-accent" : "text-slate-500"}` : `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold ${isActive ? "bg-accent-soft text-accent" : "text-slate-600 hover:bg-slate-50"}`} end={to === "/"} to={to}><Icon className={compact ? "size-5" : "size-[18px]"} />{label}</NavLink>;
}
