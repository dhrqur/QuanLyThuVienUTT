import { useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AppSidebar collapsed={sidebarCollapsed} />
      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Header
          onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="px-4 py-5 md:px-8 md:py-7">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
