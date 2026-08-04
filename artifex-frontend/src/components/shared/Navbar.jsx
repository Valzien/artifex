import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Search, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/api/categories";
import useAuthStore from "@/store/useAuthStore";

const NAV_LINKS = [
  { label: "Explore", to: "/explore" },
  { label: "Freelancers", to: "/freelancers" },
  { label: "Categories", to: "/categories", hasDropdown: true },
  { label: "Portfolio", to: "/portfolio" },
];

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats.map((c) => ({ name: c.name, slug: c.slug }))));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardPath = isAuthenticated ? `/${role}/dashboard` : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          <span className="text-lg font-semibold text-ink">Artifex</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setCategoryOpen(true)}
                onMouseLeave={() => setCategoryOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-surface hover:text-ink">
                  {link.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {categoryOpen && (
                  <div className="absolute left-0 top-full w-64 rounded-xl border border-border bg-background p-2 shadow-card">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/explore?category=${encodeURIComponent(cat.slug)}`}
                        className="block rounded-lg px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-surface hover:text-ink"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-surface hover:text-ink"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Search - desktop only */}
        <div className="hidden flex-1 items-center justify-center px-6 lg:flex">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              placeholder="Cari jasa..."
              className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/explore?search=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath}>
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-ink">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/become-freelancer">
                <Button variant="ghost" size="sm">Become a Freelancer</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-ink hover:bg-surface md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-surface hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath}>
                  <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full" onClick={handleLogout}>
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
