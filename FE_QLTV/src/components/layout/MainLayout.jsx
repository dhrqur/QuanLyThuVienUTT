import { useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

function MainLayout({ children, compact = false }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((current) => !current);

  return (
    <div
      className={cn(
        "bg-slate-50 text-slate-800",
        compact ? "xl:h-screen xl:overflow-hidden" : "min-h-screen",
      )}
    >
      <AppSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
          compact && "xl:h-screen xl:min-h-0",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
        )}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <main
          className={cn(
            "px-4 py-5 md:px-7",
            compact ? "flex-1 md:py-4 xl:min-h-0 xl:overflow-hidden" : "md:py-7",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
