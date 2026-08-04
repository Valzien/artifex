import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import DashboardTopbar from "@/components/shared/DashboardTopbar";
import { ADMIN_MENU } from "@/constants/menuItems";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentTitle =
    ADMIN_MENU.find((item) => item.to === location.pathname)?.label ??
    "Admin Dashboard";

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar
        menuItems={ADMIN_MENU}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        <DashboardTopbar
          title={currentTitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
