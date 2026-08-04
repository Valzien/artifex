import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  Bell,
  User,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { getNotifications } from "@/services/api/notifications";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

function DashboardTopbar({ title, onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [unread, setUnread] = useState(0);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (role === "client" || role === "freelancer") {
      let mounted = true;
      getNotifications(role)
        .then((items) => {
          if (mounted) setUnread(items.filter((n) => !n.read).length);
        })
        .catch(() => {});
      return () => (mounted = false);
    }
  }, [role]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-ink/70 hover:bg-surface lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-ink sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {role === "client" || role === "freelancer" ? (
          <>
            <Link
              to={`/${role}/notifications`}
              className="relative rounded-lg p-2 text-ink/70 hover:bg-surface"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-1.5 rounded-lg p-1.5 hover:bg-surface"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Menu akun"
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-medium text-primary">
                {isAvatarUrl(user?.avatar) ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.name?.[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-ink/50" />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-ink/50">{user?.email}</p>
                </div>
                <div className="p-1">
                  <DropdownItem to={`/${role}/profile`} icon={User} onNavigate={() => setOpen(false)}>
                    Profile
                  </DropdownItem>
                  <DropdownItem to={`/${role}/settings`} icon={Settings} onNavigate={() => setOpen(false)}>
                    Settings
                  </DropdownItem>
                  <DropdownItem to={`/${role}/notifications`} icon={Bell} onNavigate={() => setOpen(false)}>
                    Notifications
                  </DropdownItem>
                </div>
                <div className="border-t border-border p-1">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
            </div>
          </>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({ to, icon: Icon, children, onNavigate }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      role="menuitem"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
    >
      <Icon className="h-4 w-4 text-ink/50" />
      {children}
    </Link>
  );
}

export default DashboardTopbar;
