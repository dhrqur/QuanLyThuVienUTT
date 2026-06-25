import {
  Archive,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Library,
  PenLine,
  School,
  Tags,
  Users,
} from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";
import { getCurrentUser, isManager } from "@/utils/auth";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Quản lý Sách", href: "/sach", icon: BookOpen },
  { label: "Quản lý Độc giả", href: "/doc-gia", icon: Users },
  { label: "Quản lý Mượn trả", href: "/muon-tra", icon: ClipboardList },
  { label: "Quản lý Tác giả", href: "/tac-gia", icon: PenLine },
  { label: "Quản lý Thể loại", href: "/the-loai", icon: Tags },
  { label: "Quản lý Nhà xuất bản", href: "/nha-xuat-ban", icon: Building2 },
  { label: "Quản lý Ngôn ngữ", href: "/ngon-ngu", icon: Languages },
  { label: "Quản lý Kệ sách", href: "/ke-sach", icon: Archive },
  { label: "Quản lý Thẻ thư viện", href: "/the-thu-vien", icon: CreditCard },
  { label: "Quản lý Khoa", href: "/khoa", icon: GraduationCap },
  { label: "Quản lý Lớp", href: "/lop", icon: School },
  { label: "Quản lý Nhân viên", href: "/nhan-vien", icon: BarChart3 },
];

function AppSidebar({ collapsed = false }) {
  const user = getCurrentUser();
  const visibleNavItems = navItems.filter((item) => {
    const managerOnlyPaths = ["/", "/nhan-vien"];
    return !managerOnlyPaths.includes(item.href) || isManager(user);
  });

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-white text-slate-700 transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center border-b border-slate-100 transition-all duration-300",
          collapsed ? "justify-center px-3" : "gap-3 px-6"
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Library className="size-5" />
        </div>
        <div className={cn("min-w-0 transition-opacity duration-200", collapsed && "pointer-events-none hidden opacity-0")}>
          <h1 className="text-lg font-extrabold leading-tight text-slate-900">Thư viện UTT</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleNavItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-lg text-sm font-semibold transition",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                "text-slate-700 hover:bg-orange-50 hover:text-orange-600",
                isActive && "bg-orange-500 text-white shadow-sm shadow-orange-500/20 hover:bg-orange-500 hover:text-white"
              )
            }
            end={item.href === "/"}
            key={item.href}
            title={collapsed ? item.label : undefined}
            to={item.href}
          >
            <item.icon className="size-4 shrink-0" />
            <span className={cn("truncate transition-opacity duration-200", collapsed && "hidden opacity-0")}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;
