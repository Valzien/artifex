import { lazy } from "react";

const FreelancerDashboard = lazy(() => import("@/pages/freelancer/Dashboard"));
const MyServices = lazy(() => import("@/pages/freelancer/MyServices"));
const MyProducts = lazy(() => import("@/pages/freelancer/MyProducts"));
const Portfolio = lazy(() => import("@/pages/freelancer/Portfolio"));
const FreelancerOrders = lazy(() => import("@/pages/freelancer/Orders"));
const FreelancerChat = lazy(() => import("@/pages/freelancer/FChat"));
const Earnings = lazy(() => import("@/pages/freelancer/Earnings"));
const Withdraw = lazy(() => import("@/pages/freelancer/Withdraw"));
const Reviews = lazy(() => import("@/pages/freelancer/Reviews"));
const Analytics = lazy(() => import("@/pages/freelancer/Analytics"));
const FreelancerSettings = lazy(() => import("@/pages/freelancer/FSettings"));
const FreelancerNotifications = lazy(() => import("@/pages/freelancer/FNotifications"));
const Profile = lazy(() => import("@/pages/Profile"));

const freelancerRoutes = [
  { path: "dashboard", element: <FreelancerDashboard /> },
  { path: "services", element: <MyServices /> },
  { path: "products", element: <MyProducts /> },
  { path: "portfolio", element: <Portfolio /> },
  { path: "orders", element: <FreelancerOrders /> },
  { path: "chat", element: <FreelancerChat /> },
  { path: "earnings", element: <Earnings /> },
  { path: "withdraw", element: <Withdraw /> },
  { path: "reviews", element: <Reviews /> },
  { path: "analytics", element: <Analytics /> },
  { path: "notifications", element: <FreelancerNotifications /> },
  { path: "profile", element: <Profile /> },
  { path: "settings", element: <FreelancerSettings /> },
];

export default freelancerRoutes;
