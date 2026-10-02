import {
  Archive,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  GraduationCap,
  History,
  Inbox,
  Languages,
  LayoutDashboard,
  Library,
  PenLine,
  School,
  ShieldAlert,
  Settings2,
  Tags,
  Users,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";
import { isLibrarian } from "@/utils/accessControl";
import { getCurrentUser } from "@/utils/session";

const navGroups = [
  {
    label: "Thư viện",
    items: [
      { label: "Sách", href: "/sach", icon: BookOpen },
      { label: "Tác giả", href: "/tac-gia", icon: PenLine },
      { label: "Thể loại", href: "/the-loai", icon: Tags },
      { label: "Nhà xuất bản", href: "/nha-xuat-ban", icon: Building2 },
      { label: "Ngôn ngữ", href: "/ngon-ngu", icon: Languages },
      { label: "Kệ sách", href: "/ke-sach", icon: Archive },
    ],
  },
  {
    label: "Người dùng",
    items: [
      { label: "Độc giả", href: "/doc-gia", icon: Users },
      { label: "Thẻ thư viện", href: "/the-thu-vien", icon: CreditCard },
      { label: "Khoa", href: "/khoa", icon: GraduationCap },
      { label: "Lớp", href: "/lop", icon: School },
      { label: "Nhân viên", href: "/nhan-vien", icon: BarChart3 },
    ],
  },
  {
    label: "Nghiệp vụ",
    items: [
      { label: "Yêu cầu độc giả", href: "/yeu-cau-doc-gia", icon: Inbox },
      { label: "Mượn trả", href: "/muon-tra", icon: ClipboardList },
      { label: "Xử lý vi phạm", href: "/xu-ly-vi-pham", icon: ShieldAlert },
      { label: "Quy định thư viện", href: "/quy-dinh-thu-vien", icon: Settings2, managerOnly: true },
      { label: "Nhật ký hệ thống", href: "/nhat-ky-he-thong", icon: History, managerOnly: true },
    ],
  },
];

function AppSidebar({ mobileOpen, onMobileOpenChange }) {
  const user = getCurrentUser();
  const isThuThu = isLibrarian(user);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") onMobileOpenChange(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen, onMobileOpenChange]);

  return (
    <>
      <button
        aria-label="Đóng menu điều hướng"
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => onMobileOpenChange(false)}
        tabIndex={mobileOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-label="Điều hướng chính"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-3rem))] flex-col border-r border-slate-200/80 bg-white text-slate-600 shadow-xl transition-transform duration-200 lg:z-30 lg:w-64 lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 px-5 lg:px-7">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Library className="size-5" strokeWidth={2.4} />
          </div>
          <h1 className="whitespace-nowrap text-lg font-black text-[#25245A]">
            Thư viện UTT
          </h1>
          <button
            aria-label="Đóng menu điều hướng"
            className="ml-auto grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-50 lg:hidden"
            onClick={() => onMobileOpenChange(false)}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 [scrollbar-width:none]">
          {!isThuThu && <SidebarLink href="/" icon={LayoutDashboard} label="Dashboard" onNavigate={() => onMobileOpenChange(false)} />}

          {navGroups.map((group) => {
            const items = group.items.filter((item) => !isThuThu || (item.href !== "/nhan-vien" && !item.managerOnly));
            if (!items.length) return null;

            return (
              <div className="mt-4" key={group.label}>
                <div className="mb-1.5 flex items-center justify-between px-2">
                  <p className="text-xs font-semibold text-[#25245A]/60">{group.label}</p>
                  <ChevronDown className="size-3.5 text-slate-400" />
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => (
                    <SidebarLink key={item.href} {...item} onNavigate={() => onMobileOpenChange(false)} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label, onNavigate }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex h-10 items-center gap-3 rounded-xl px-4 text-sm font-medium transition",
          isActive
            ? "bg-orange-50 text-orange-600"
            : "text-[#25245A]/75 hover:bg-slate-50 hover:text-[#25245A]",
        )
      }
      end={href === "/"}
      onClick={onNavigate}
      to={href}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default AppSidebar;
