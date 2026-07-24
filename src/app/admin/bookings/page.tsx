"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  Award,
  PhoneCall,
  Mail,
  X,
  FileText,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useCMSStore } from "@/store/cmsStore";
import { BookingOrder, PaymentStatus } from "@/types/cms";

export default function AdminBookingsPage() {
  const { bookings, updateBookingStatus } = useCMSStore();
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<BookingOrder | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === "All" || b.paymentStatus === filterStatus;
    const matchesSearch =
      b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, newStatus: PaymentStatus) => {
    updateBookingStatus(bookingId, newStatus);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, paymentStatus: newStatus });
    }
  };

  const handleExportCSV = () => {
    const headers = ["OrderNumber", "FullName", "Email", "WhatsApp", "ServiceType", "PackageTitle", "TrekDate", "TotalUSD", "DepositRequiredUSD", "PaymentStatus"];
    const rows = filteredBookings.map((b) => [
      b.orderNumber,
      `"${b.customer.fullName}"`,
      b.customer.email,
      b.customer.whatsapp,
      b.serviceType,
      `"${b.packageTitle}"`,
      b.trekDate,
      b.pricing.totalUSD,
      b.pricing.depositRequiredUSD,
      b.paymentStatus,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rinjani_hero_bookings_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout title="Bookings & Permits Manager" subtitle="Manage incoming reservations, payment verification, and E-Rinjani park registration">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Pending", "Deposit Paid", "Fully Paid", "Cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filterStatus === st
                    ? "bg-[#18979B] text-white shadow"
                    : "bg-[#F8FAF9] text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {st === "All" ? `All Orders (${bookings.length})` : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F8FAF9] border border-gray-200 rounded-xl px-3 py-2 text-xs w-64">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order # or customer..."
                className="bg-transparent focus:outline-none w-full text-gray-700 font-medium"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#122826] hover:bg-[#18979B] text-white font-bold text-xs transition flex items-center gap-1.5 shadow shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer & Contact</th>
                  <th className="py-4 px-6">Package / Service</th>
                  <th className="py-4 px-6">Target Date</th>
                  <th className="py-4 px-6">Pax</th>
                  <th className="py-4 px-6">Total / Deposit</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-medium text-gray-700">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 font-semibold">
                      No matching reservations found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F8FAF9] transition">
                      <td className="py-4 px-6 font-extrabold text-[#122826]">{b.orderNumber}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#122826]">{b.customer.fullName}</div>
                        <div className="text-xs text-gray-400">{b.customer.email}</div>
                        <div className="text-[11px] text-[#18979B] font-mono">{b.customer.whatsapp}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#122826] line-clamp-1">{b.packageTitle}</div>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase text-gray-600">
                          {b.serviceType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#18979B] font-bold">{b.trekDate}</td>
                      <td className="py-4 px-6 font-bold">{b.participants.adults + b.participants.children} pax</td>
                      <td className="py-4 px-6">
                        <div className="font-black text-[#122826]">${b.pricing.totalUSD}</div>
                        <div className="text-[10px] text-gray-400">Dep: ${b.pricing.depositRequiredUSD}</div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={b.paymentStatus}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as PaymentStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            b.paymentStatus === "Fully Paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : b.paymentStatus === "Deposit Paid"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : b.paymentStatus === "Pending"
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Deposit Paid">Deposit Paid</option>
                          <option value="Fully Paid">Fully Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-[#18979B] hover:text-white text-gray-700 transition inline-flex items-center gap-1 text-xs font-bold"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detail */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
              <div className="p-6 bg-[#122826] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#D4A017] uppercase font-bold tracking-widest block">Reservation Inspection</span>
                  <h3 className="text-xl font-black text-white mt-0.5">Order #{selectedBooking.orderNumber}</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 text-gray-400 hover:text-white bg-white/10 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4 bg-[#F8FAF9] p-4 rounded-2xl border border-gray-200">
                  <div>
                    <span className="text-gray-400 uppercase font-bold block text-[10px]">Customer Name</span>
                    <span className="font-extrabold text-[#122826] text-base">{selectedBooking.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold block text-[10px]">Arrival Date</span>
                    <span className="font-bold text-gray-700">{selectedBooking.customer.arrivalDate || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold block text-[10px]">Email</span>
                    <span className="font-semibold text-[#18979B]">{selectedBooking.customer.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase font-bold block text-[10px]">WhatsApp</span>
                    <span className="font-semibold text-[#18979B]">{selectedBooking.customer.whatsapp}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 uppercase font-bold block text-[10px]">Pickup Location</span>
                    <span className="font-semibold text-gray-700">{selectedBooking.customer.pickupLocation || "TBD"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-[#122826] uppercase text-xs tracking-wider">Itinerary & Participants</h4>
                  <div className="p-4 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex justify-between font-bold text-[#122826]">
                      <span>{selectedBooking.packageTitle}</span>
                      <span className="text-[#18979B]">{selectedBooking.trekDate}</span>
                    </div>
                    <div className="text-gray-600 flex flex-wrap gap-3 pt-1">
                      <span>• Adults: {selectedBooking.participants.adults}</span>
                      <span>• Children: {selectedBooking.participants.children}</span>
                      <span>• Extra Porters: {selectedBooking.participants.extraPorters}</span>
                      <span>• Private VIP Guide: {selectedBooking.participants.privateGuide ? "YES" : "NO"}</span>
                    </div>
                    {selectedBooking.customer.membersDataText && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-400 uppercase font-bold block text-[10px] mb-1">Members Data & Special Requests</span>
                        <pre className="whitespace-pre-wrap font-sans text-xs bg-white p-3 rounded-xl border border-gray-100 text-gray-700">
                          {selectedBooking.customer.membersDataText}
                        </pre>
                      </div>
                    )}
                    {selectedBooking.customer.orderNote && (
                      <div className="pt-2 border-t text-amber-800 bg-amber-50 p-2 rounded-xl text-xs">
                        ⚠️ Order Note: {selectedBooking.customer.orderNote}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-[#122826] uppercase text-xs tracking-wider">Payment Breakdown</h4>
                  <div className="p-4 rounded-2xl bg-[#122826] text-white space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>${selectedBooking.pricing.subtotal} USD</span>
                    </div>
                    {selectedBooking.pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Voucher Discount:</span>
                        <span>-${selectedBooking.pricing.discountAmount} USD</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-[#D4A017]">
                      <span>Grand Total:</span>
                      <span>${selectedBooking.pricing.totalUSD} USD</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                      <span>Deposit Paid / Required:</span>
                      <span>${selectedBooking.pricing.depositRequiredUSD} USD</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.trackingSource && (
                  <div className="p-3 rounded-xl bg-gray-100 text-gray-600 text-[11px] flex justify-between">
                    <span>Source: {selectedBooking.trackingSource.referrer}</span>
                    <span>UTM Campaign: {selectedBooking.trackingSource.utmCampaign}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
