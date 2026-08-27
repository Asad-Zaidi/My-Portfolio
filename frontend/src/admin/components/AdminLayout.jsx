import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy-950 font-sans text-slate-200">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-navy-700 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-navy-700 shadow-2xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-navy-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-navy-700 bg-navy-900/80 px-5 backdrop-blur-md">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-navy-800 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-white">{admin?.name}</div>
              <div className="text-[11px] text-slate-500">{admin?.email}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent-light">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-navy-600 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
