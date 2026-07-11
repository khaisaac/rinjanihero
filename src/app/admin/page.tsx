"use client";

import Link from "next/link";
import {
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  Plus,
  Tag,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCMSStore } from "@/store/cmsStore";

export default function AdminOverviewPage() {
  const { bookings, packages } = useCMSStore();

  const totalRevenueUSD = bookings
    .filter((b) => b.paymentStatus === "Deposit Paid" || b.paymentStatus === "Fully Paid")
    .reduce((acc, curr) => acc + (curr.paymentStatus === "Fully Paid" ? curr.pricing.totalUSD : curr.pricing.depositRequiredUSD), 0);

  const activeBookingsCount = bookings.filter((b) => b.paymentStatus !== "Cancelled").length;
  const upcomingTrekkersCount = bookings.reduce((acc, curr) => acc + curr.participants.adults + curr.participants.children, 0);
  const pendingCount = bookings.filter((b) => b.paymentStatus === "Pending").length;

  const chartData = [
    { month: "Jan", revenue: 4200, bookings: 18 },
    { month: "Feb", revenue: 5800, bookings: 24 },
    { month: "Mar", revenue: 8900, bookings: 36 },
    { month: "Apr", revenue: 14500, bookings: 58 },
    { month: "May", revenue: 21000, bookings: 82 },
    { month: "Jun", revenue: 28400, bookings: 110 },
    { month: "Jul", revenue: totalRevenueUSD || 32000, bookings: activeBookingsCount || 135 },
  ];

  const handleExportCSV = () => {
    const headers = ["OrderNumber", "FullName", "Email", "ServiceType", "PackageTitle", "TrekDate", "TotalUSD", "PaymentStatus"];
    const rows = bookings.map((b) => [
      b.orderNumber,
      `"${b.customer.fullName}"`,
      b.customer.email,
      b.serviceType,
      `"${b.packageTitle}"`,
      b.trekDate,
      b.pricing.totalUSD,
      b.paymentStatus,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rinjani_hero_bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Overview Analytics" subtitle="Real-time operational metrics for Mount Rinjani Senaru Basecamp">
      <div className="space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Revenue (USD)</span>
              <span className="text-2xl sm:text-3xl font-black text-[#122826] block mt-1">
                ${totalRevenueUSD.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                ↑ +24.8% vs last month
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Bookings</span>
              <span className="text-2xl sm:text-3xl font-black text-[#122826] block mt-1">
                {activeBookingsCount}
              </span>
              <span className="text-[11px] text-[#18979B] font-semibold block mt-1">
                {pendingCount} Pending Verification
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#D4A017]/15 text-[#A87E0E] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Upcoming Trekkers</span>
              <span className="text-2xl sm:text-3xl font-black text-[#122826] block mt-1">
                {upcomingTrekkersCount}
              </span>
              <span className="text-[11px] text-gray-500 font-medium block mt-1">
                Across 60+ countries
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#18979B]/10 text-[#18979B] flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Conversion Rate</span>
              <span className="text-2xl sm:text-3xl font-black text-[#122826] block mt-1">
                4.85%
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                ★ Top 1% in Lombok
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Charts & Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Revenue Chart (8 spans) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#122826] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#18979B]" />
                  <span>Monthly Revenue Trend (2026 Season)</span>
                </h3>
                <p className="text-xs text-gray-500">Live transaction volume in USD across Sembalun, Senaru, and Torean routes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-[#18979B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#18979B]" /> Revenue ($)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18979B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#18979B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" fontSize={12} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#122826", borderRadius: "12px", color: "#fff", border: "none" }}
                    formatter={(value: any) => [`$${value}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#18979B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions Card (4 spans) */}
          <div className="lg:col-span-4 bg-[#122826] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <span className="text-xs text-[#D4A017] font-bold uppercase tracking-wider block">Basecamp Control</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Quick Actions</h3>
              <p className="text-xs text-gray-300 mt-1">Manage daily operations instantly.</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/admin/packages"
                className="w-full bg-[#18979B] hover:bg-[#13797C] text-white font-bold py-3.5 px-5 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm shadow"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4" />
                  <span>Add New Trekking Package</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin/vouchers"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-5 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#D4A017]" />
                  <span>Create Promo Voucher</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleExportCSV}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-5 rounded-2xl transition flex items-center justify-between text-xs sm:text-sm border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export All Bookings CSV</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span>National Park API Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
              </span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Quick Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#122826]">Recent Incoming Reservations</h3>
              <p className="text-xs text-gray-500">Showing most recent online bookings that need e-permit verification</p>
            </div>
            <Link
              href="/admin/bookings"
              className="px-4 py-2 rounded-xl bg-[#F8FAF9] hover:bg-gray-100 text-[#122826] font-bold text-xs transition flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service & Route</th>
                  <th className="py-3 px-4">Ascent Date</th>
                  <th className="py-3 px-4">Total USD</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium text-gray-700">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-[#F8FAF9] transition">
                    <td className="py-4 px-4 font-extrabold text-[#122826]">{b.orderNumber}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#122826]">{b.customer.fullName}</div>
                      <div className="text-xs text-gray-400">{b.customer.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold block">{b.packageTitle}</span>
                      <span className="text-[11px] text-gray-400 uppercase">{b.serviceType}</span>
                    </td>
                    <td className="py-4 px-4 text-[#18979B] font-bold">{b.trekDate}</td>
                    <td className="py-4 px-4 font-extrabold text-[#122826]">${b.pricing.totalUSD}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                          b.paymentStatus === "Fully Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.paymentStatus === "Deposit Paid"
                            ? "bg-blue-100 text-blue-800"
                            : b.paymentStatus === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/admin/bookings?view=${b.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs transition inline-block"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
