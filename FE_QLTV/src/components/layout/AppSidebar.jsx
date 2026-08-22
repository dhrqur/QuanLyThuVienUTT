import {
  Archive,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Library,
  PenLine,
  School,
  ShieldAlert,
  Settings2,
  Tags,
  Users,
} from "lucide-react";
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
      { label: "Mượn trả", href: "/muon-tra", icon: ClipboardList },
      { label: "Xử lý vi phạm", href: "/xu-ly-vi-pham", icon: ShieldAlert },
      { label: "Quy định thư viện", href: "/quy-dinh-thu-vien", icon: Settings2, managerOnly: true },
    ],
  },
];

function AppSidebar() {
  const user = getCurrentUser();
  const isThuThu = isLibrarian(user);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white text-slate-600 lg:flex"
    >
      <div className="flex h-20 shrink-0 items-center gap-3 px-7">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Library className="size-5" strokeWidth={2.4} />
        </div>
        <h1 className="whitespace-nowrap text-lg font-black text-[#25245A]">
          Thư viện UTT
        </h1>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 [scrollbar-width:none]">
        {!isThuThu && <SidebarLink href="/" icon={LayoutDashboard} label="Dashboard" />}

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
                  <SidebarLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarLink({ href, icon: Icon, label }) {
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
      to={href}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default AppSidebar;
