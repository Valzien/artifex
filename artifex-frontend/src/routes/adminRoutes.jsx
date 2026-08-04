import { lazy } from "react";
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminFreelancers = lazy(() => import("@/pages/admin/Freelancers"));
const AdminServices = lazy(() => import("@/pages/admin/Services"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));
const AdminCategories = lazy(() => import("@/pages/admin/Categories"));
const AdminWithdrawals = lazy(() => import("@/pages/admin/Withdrawals"));
const AdminFaqs = lazy(() => import("@/pages/admin/Faqs"));
const AdminReports = lazy(() => import("@/pages/admin/Reports"));
const AdminContactMessages = lazy(() => import("@/pages/admin/ContactMessages"));

const adminRoutes = [
  { path: "dashboard", element: <AdminDashboard /> },
  { path: "users", element: <AdminUsers /> },
  { path: "freelancers", element: <AdminFreelancers /> },
  { path: "services", element: <AdminServices /> },
  { path: "orders", element: <AdminOrders /> },
  { path: "analytics", element: <AdminAnalytics /> },
  { path: "categories", element: <AdminCategories /> },
  { path: "withdrawals", element: <AdminWithdrawals /> },
  { path: "faqs", element: <AdminFaqs /> },
  { path: "reports", element: <AdminReports /> },
  { path: "contact-messages", element: <AdminContactMessages /> },
];
export default adminRoutes;
