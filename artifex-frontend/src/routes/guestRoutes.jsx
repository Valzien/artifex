import { lazy } from "react";

const Home = lazy(() => import("@/pages/guest/Home"));
const ExploreServices = lazy(() => import("@/pages/guest/ExploreServices"));
const Categories = lazy(() => import("@/pages/guest/Categories"));
const ServiceDetail = lazy(() => import("@/pages/guest/ServiceDetail"));
const FreelancerList = lazy(() => import("@/pages/guest/FreelancerList"));
const FreelancerDetail = lazy(() => import("@/pages/guest/FreelancerDetail"));
const ExploreProducts = lazy(() => import("@/pages/guest/ExploreProducts"));
const Portfolio = lazy(() => import("@/pages/guest/Portfolio"));
const PortfolioDetail = lazy(() => import("@/pages/guest/PortfolioDetail"));
const ProductDetail = lazy(() => import("@/pages/guest/ProductDetail"));
const About = lazy(() => import("@/pages/guest/About"));
const FAQ = lazy(() => import("@/pages/guest/FAQ"));
const Contact = lazy(() => import("@/pages/guest/Contact"));
const Login = lazy(() => import("@/pages/guest/Login"));
const Register = lazy(() => import("@/pages/guest/Register"));
const BecomeFreelancer = lazy(() => import("@/pages/guest/BecomeFreelancer"));

const guestRoutes = [
  { index: true, element: <Home /> },
  { path: "explore", element: <ExploreServices /> },
  { path: "explore-products", element: <ExploreProducts /> },
  { path: "product/:id", element: <ProductDetail /> },
  { path: "categories", element: <Categories /> },
  { path: "service/:id", element: <ServiceDetail /> },
  { path: "freelancers", element: <FreelancerList /> },
  { path: "freelancer/:id", element: <FreelancerDetail /> },
  { path: "portfolio", element: <Portfolio /> },
  { path: "portfolio/:id", element: <PortfolioDetail /> },
  { path: "about", element: <About /> },
  { path: "faq", element: <FAQ /> },
  { path: "contact", element: <Contact /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  { path: "become-freelancer", element: <BecomeFreelancer /> },
];

export default guestRoutes;
