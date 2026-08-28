import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  LuMenu as Menu,
  LuX as X,
  LuLogOut as LogOut,
  LuSun as Sun,
  LuMoon as Moon,
} from "react-icons/lu";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-800 dark:bg-navy-950 dark:text-slate-200"
      style={{ "--admin-sidebar-w": collapsed ? "4rem" : "16rem" }}
    >
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-all duration-300 dark:border-navy-700 dark:bg-navy-900 lg:block ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-slate-200 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-900">
            <Sidebar onNavigate={() => setMobileOpen(false)} collapsed={false} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-navy-800 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-5 backdrop-blur-md dark:border-navy-700 dark:bg-navy-900/80">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDark}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              title={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-navy-600 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white transition-colors"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{admin?.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{admin?.email}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-red-500/50 hover:text-red-600 dark:border-navy-600 dark:text-slate-300 dark:hover:border-red-500/50 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-full px-5 py-8 sm:px-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
