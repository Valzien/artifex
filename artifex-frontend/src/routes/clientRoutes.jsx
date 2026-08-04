import { lazy } from "react";

const ClientDashboard = lazy(() => import("@/pages/client/Dashboard"));
const Orders = lazy(() => import("@/pages/client/Orders"));
const OrderDetail = lazy(() => import("@/pages/client/OrderDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const Favorites = lazy(() => import("@/pages/client/Favorites"));
const Settings = lazy(() => import("@/pages/client/Settings"));
const Notifications = lazy(() => import("@/pages/client/Notifications"));
const Chat = lazy(() => import("@/pages/client/Chat"));
const Checkout = lazy(() => import("@/pages/client/Checkout"));
const Riwayat = lazy(() => import("@/pages/client/Riwayat"));
const Cart = lazy(() => import("@/pages/client/Cart"));
const ProductOrders = lazy(() => import("@/pages/client/ProductOrders"));
const ProductCheckout = lazy(() => import("@/pages/client/ProductCheckout"));

const clientRoutes = [
  { path: "dashboard", element: <ClientDashboard /> },
  { path: "orders", element: <Orders /> },
  { path: "orders/:id", element: <OrderDetail /> },
  { path: "riwayat", element: <Riwayat /> },
  { path: "profile", element: <Profile /> },
  { path: "favorites", element: <Favorites /> },
  { path: "settings", element: <Settings /> },
  { path: "notifications", element: <Notifications /> },
  { path: "chat", element: <Chat /> },
  { path: "checkout/:serviceId", element: <Checkout /> },
  { path: "cart", element: <Cart /> },
  { path: "product-orders", element: <ProductOrders /> },
  { path: "product-checkout/:productId", element: <ProductCheckout /> },
];

export default clientRoutes;
