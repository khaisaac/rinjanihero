"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  Tag,
  FileText,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ExternalLink,
} from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { bookings } = useCMSStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<"Super Admin" | "Basecamp Manager">("Super Admin");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string }>({
    name: "Senaru Director",
    email: "admin@rinjanihero.com",
    role: "Super Admin",
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      const hasCookie = document.cookie.includes("admin_token=authenticated");

      if (token === "authenticated" || hasCookie) {
        setIsAuthenticated(true);
        const savedUser = localStorage.getItem("admin_user");
        if (savedUser) {
          try {
            setAdminUser(JSON.parse(savedUser));
          } catch (e) {}
        }
      } else {
        setIsAuthenticated(false);
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    document.cookie = "admin_token=; path=/; max-age=0";
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  const pendingCount = bookings.filter((b) => b.paymentStatus === "Pending").length;

  const navItems = [
    { name: "Overview Analytics", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings & Permits", href: "/admin/bookings", icon: CalendarCheck, badge: pendingCount > 0 ? pendingCount : undefined },
    { name: "Packages & Routes", href: "/admin/packages", icon: Compass },
    { name: "Vouchers & Promos", href: "/admin/vouchers", icon: Tag },
    { name: "SEO Blogs & Articles", href: "/admin/blogs", icon: FileText },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F211F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3.5 bg-white/[0.04] p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-9 h-9 border-3 border-[#18979B] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">
            Verifying Basecamp Authorization...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#122826] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <img
                src="/rinjani.webp"
                alt="Rinjani Hero Logo"
                className="w-10 h-10 rounded-xl object-contain shadow bg-white/10 backdrop-blur-md p-1 border border-white/20"
              />
              <div>
                <span className="text-base font-extrabold tracking-tight block">RINJANI HERO</span>
                <span className="text-[10px] text-[#D4A017] font-bold tracking-widest uppercase block">CMS CONTROL PANEL</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Switcher */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Current Role</span>
              </span>
              <span className="text-[10px] bg-[#18979B] px-2 py-0.5 rounded text-white font-bold uppercase">
                Active
              </span>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-[#122826] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-[#D4A017] focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Basecamp Manager">Basecamp Manager (Operations)</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
                    isActive
                      ? "bg-[#18979B] text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="bg-[#D4A017] text-[#122826] text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile with Logout */}
        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#D4A017] text-[#122826] flex items-center justify-center font-bold text-sm shrink-0">
                {adminUser.name ? adminUser.name.slice(0, 2).toUpperCase() : "SA"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block">{adminUser.name}</span>
                <span className="text-[10px] text-gray-400 truncate block">{adminUser.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition shrink-0"
              title="Log Out of Control Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-[#122826]">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#F8FAF9] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 w-64">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search orders, permits, tourists..."
                className="bg-transparent focus:outline-none w-full text-gray-700"
              />
            </div>

            <Link
              href="/admin/bookings"
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </Link>

            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#18979B] text-white font-bold text-xs shadow hover:bg-[#13797C] transition"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
