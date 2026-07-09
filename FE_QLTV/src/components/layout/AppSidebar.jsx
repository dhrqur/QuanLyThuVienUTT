import {
  Archive,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronLeft,
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
    items: [{ label: "Mượn trả", href: "/muon-tra", icon: ClipboardList }],
  },
];

function AppSidebar({ collapsed = false, onToggle }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200/80 bg-white text-slate-600 transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-20 shrink-0 items-center transition-all duration-300",
          collapsed ? "justify-center px-3" : "gap-3 px-7",
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Library className="size-5" strokeWidth={2.4} />
        </div>
        <h1
          className={cn(
            "whitespace-nowrap text-lg font-black text-slate-900 transition-opacity duration-200",
            collapsed && "hidden opacity-0",
          )}
        >
          Thư viện UTT
        </h1>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 [scrollbar-width:none]">
        <SidebarLink
          collapsed={collapsed}
          href="/"
          icon={LayoutDashboard}
          label="Dashboard"
        />

        {navGroups.map((group) => {
          const items = group.items;
          if (!items.length) return null;

          return (
            <div className={cn("mt-4", collapsed && "mt-3")} key={group.label}>
              {!collapsed && (
                <div className="mb-1.5 flex items-center justify-between px-2">
                  <p className="text-xs font-semibold text-slate-500">{group.label}</p>
                  <ChevronDown className="size-3.5 text-slate-400" />
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <SidebarLink collapsed={collapsed} key={item.href} {...item} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 p-4 pt-2">
        <button
          aria-label={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          className={cn(
            "flex h-11 w-full items-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600",
            collapsed ? "justify-center" : "gap-3 px-4",
          )}
          onClick={onToggle}
          type="button"
        >
          <ChevronLeft
            className={cn("size-4 transition-transform duration-300", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Thu gọn</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ collapsed, href, icon: Icon, label }) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex h-10 items-center rounded-xl text-sm font-medium transition",
          collapsed ? "justify-center" : "gap-3 px-4",
          isActive
            ? "bg-orange-50 text-orange-600"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        )
      }
      end={href === "/"}
      title={collapsed ? label : undefined}
      to={href}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

export default AppSidebar;
