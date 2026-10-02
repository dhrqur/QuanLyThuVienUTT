import { useState } from "react";

import AppSidebar from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import { cn } from "@/lib/utils";

function MainLayout({ children, compact = false }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-slate-50 text-[#46506E]",
        compact ? "xl:h-screen xl:overflow-hidden" : "min-h-screen",
      )}
    >
      <AppSidebar
        mobileOpen={mobileNavigationOpen}
        onMobileOpenChange={setMobileNavigationOpen}
      />
      <div
        className={cn(
          "flex min-h-screen flex-col lg:pl-64",
          compact && "xl:h-screen xl:min-h-0",
        )}
      >
        <Header onMenuOpen={() => setMobileNavigationOpen(true)} />
        <main
          className={cn(
            "bg-white px-3 sm:px-4 lg:px-6",
            compact ? "flex-1 py-2.5 xl:min-h-0 xl:overflow-hidden" : "pb-4 pt-7",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
