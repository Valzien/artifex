import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import GuestLayout from "@/layouts/GuestLayout";
import ClientLayout from "@/layouts/ClientLayout";
import FreelancerLayout from "@/layouts/FreelancerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import guestRoutes from "@/routes/guestRoutes";
import clientRoutes from "@/routes/clientRoutes";
import freelancerRoutes from "@/routes/freelancerRoutes";
import adminRoutes from "@/routes/adminRoutes";
import NotFound from "@/pages/NotFound";

// Loading fallback sederhana saat lazy-loaded page sedang dimuat
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  const routeTree = [
    {
      // Guest routes dibungkus GuestLayout (Navbar + Footer)
      path: "/",
      element: <GuestLayout />,
      children: guestRoutes,
    },
    {
      // Client routes: protected + dibungkus ClientLayout (sidebar)
      path: "/client",
      element: (
        <ProtectedRoute allowedRoles={["client"]}>
          <ClientLayout />
        </ProtectedRoute>
      ),
      children: clientRoutes,
    },
    {
      // Freelancer routes: protected + dibungkus FreelancerLayout (sidebar)
      path: "/freelancer",
      element: (
        <ProtectedRoute allowedRoles={["freelancer"]}>
          <FreelancerLayout />
        </ProtectedRoute>
      ),
      children: freelancerRoutes,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: adminRoutes,
    },
    { path: "*", element: <NotFound /> },
  ];

  const element = useRoutes(routeTree);

  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export default AppRoutes;
