"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Download,
  Printer,
  Mail,
  ArrowRight,
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCMSStore } from "@/store/cmsStore";
import { BookingOrder } from "@/types/cms";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;
  const { bookings, updateBookingStatus } = useCMSStore();

  const [booking, setBooking] = useState<BookingOrder | null>(null);
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full">("deposit");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "va" | "qris">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [emailSimulated, setEmailSimulated] = useState(false);

  useEffect(() => {
    if (bookingId) {
      const found = bookings.find((b) => b.id === bookingId);
      if (found) {
        setBooking(found);
        if (found.paymentStatus === "Deposit Paid" || found.paymentStatus === "Fully Paid") {
          setIsPaid(true);
        }
      }
    }
  }, [bookingId, bookings]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-4">
          <Clock className="w-12 h-12 text-[#18979B] mx-auto animate-spin" />
          <h2 className="text-xl font-bold text-[#122826]">Loading Reservation...</h2>
          <p className="text-xs text-gray-500">If this takes longer than 5 seconds, the reservation ID may not exist.</p>
          <Link href="/booking" className="inline-block bg-[#18979B] text-white px-6 py-2.5 rounded-xl font-bold text-xs mt-2">
            Return to Booking Portal
          </Link>
        </div>
      </div>
    );
  }

  const amountToPayUSD =
    paymentOption === "deposit" ? booking.pricing.depositRequiredUSD : booking.pricing.totalUSD;
  const amountToPayIDR = Math.round(amountToPayUSD * 15500);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newStatus = paymentOption === "deposit" ? "Deposit Paid" : "Fully Paid";
      updateBookingStatus(booking.id, newStatus);
      setIsProcessing(false);
      setIsPaid(true);
      setEmailSimulated(true);

      // Launch celebration confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#18979B", "#D4A017", "#10B981", "#3B82F6"],
      });
    }, 1800);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Step Banner */}
        {!isPaid ? (
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/15 px-3.5 py-1.5 rounded-full block w-max mx-auto mb-3">
              Step 2 of 2: DOKU Secure Gateway
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122826]">
              Secure Your Expedition Permit
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Order <strong className="text-[#122826]">#{booking.orderNumber}</strong> has been reserved. Complete deposit payment below to register your National Park barcode e-ticket.
            </p>
          </div>
        ) : (
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-2">
              Payment Verified — Official Permit Active
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#122826]">
              Congratulations, {booking.customer.fullName}!
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              We have automatically dispatched your official E-Rinjani voucher and itinerary PDF to <strong className="text-[#18979B]">{booking.customer.email}</strong> and our Senaru basecamp directors.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Controls / Success Notice (7 spans) */}
          <div className="lg:col-span-7 space-y-6">
            {!isPaid ? (
              <>
                {/* 1. Payment Amount Choice */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
                  <h3 className="text-lg font-bold text-[#122826] flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#18979B]" />
                    <span>Select Payment Option</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentOption("deposit")}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        paymentOption === "deposit"
                          ? "bg-[#18979B]/10 border-[#18979B] shadow-sm"
                          : "bg-[#F8FAF9] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#122826] uppercase">30% Minimum Deposit</span>
                        <input type="radio" checked={paymentOption === "deposit"} readOnly className="text-[#18979B]" />
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-black text-[#122826]">${booking.pricing.depositRequiredUSD}</span>
                        <span className="text-xs text-gray-500 block">Pay balance (${booking.pricing.remainingBalanceUSD}) upon arrival</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentOption("full")}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                        paymentOption === "full"
                          ? "bg-[#D4A017]/15 border-[#D4A017] shadow-sm"
                          : "bg-[#F8FAF9] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#122826] uppercase">100% Full Payment</span>
                        <input type="radio" checked={paymentOption === "full"} readOnly className="text-[#D4A017]" />
                      </div>
                      <div className="mt-3">
                        <span className="text-2xl font-black text-[#122826]">${booking.pricing.totalUSD}</span>
                        <span className="text-xs text-emerald-600 font-semibold block">All settled upfront!</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DOKU Payment Method Choice */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#122826] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#18979B]" />
                      <span>DOKU Payment Gateway</span>
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase">
                      SSL 256-Bit Encrypted
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: "card", label: "Credit or Debit Card", icon: CreditCard, sub: "Visa, Mastercard, JCB, American Express" },
                      { id: "va", label: "Bank Virtual Account", icon: Building2, sub: "BCA, Bank Mandiri, BNI, BRI Virtual Account" },
                      { id: "qris", label: "QRIS Instant Scan", icon: QrCode, sub: "OVO, GoPay, Dana, ShopeePay, Mobile Banking" },
                    ].map((m) => {
                      const IconComp = m.icon;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            paymentMethod === m.id
                              ? "bg-[#18979B]/10 border-[#18979B] shadow-sm"
                              : "bg-[#F8FAF9] border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#18979B] shadow-sm">
                              <IconComp className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#122826]">{m.label}</h4>
                              <p className="text-xs text-gray-500">{m.sub}</p>
                            </div>
                          </div>
                          <input type="radio" checked={paymentMethod === m.id} readOnly className="text-[#18979B]" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Simulation Action CTA */}
                  <div className="pt-6 border-t border-gray-100">
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-[#18979B] to-[#13797C] hover:from-[#13797C] hover:to-[#18979B] text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-2 text-base uppercase tracking-wider disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 animate-spin" />
                          <span>Processing DOKU Transaction...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Pay ${amountToPayUSD} USD ({amountToPayIDR.toLocaleString()} IDR) Now</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-gray-400 mt-2">
                      💡 Click button to instantly simulate DOKU payment success and trigger instant email voucher dispatch!
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Success Printable Invoice & Automated Email Preview */
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6 print:border-none print:shadow-none">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-[#122826]">RINJANI HERO EXPEDITIONS</h2>
                      <p className="text-xs text-gray-500">Official Senaru Basecamp • Licensed National Park Operator</p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full block w-max sm:ml-auto">
                        {booking.paymentStatus.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-bold mt-1 block">Order #{booking.orderNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 uppercase font-bold block">Customer:</span>
                      <span className="font-bold text-[#122826] text-sm block mt-0.5">{booking.customer.fullName}</span>
                      <span className="text-gray-500">{booking.customer.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 uppercase font-bold block">Trek Date:</span>
                      <span className="font-bold text-[#18979B] text-sm block mt-0.5">{booking.trekDate}</span>
                      <span className="text-gray-500">{booking.participants.adults} Adults, {booking.participants.children} Kids</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-400 uppercase font-bold block">National Park E-Barcode:</span>
                      <span className="font-mono font-bold bg-[#F8FAF9] p-1.5 rounded text-xs text-[#122826] block mt-0.5">
                        RH-ERINJANI-{booking.id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-gray-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-sm text-[#122826]">
                      <span>{booking.packageTitle}</span>
                      <span>${booking.pricing.totalUSD} USD</span>
                    </div>
                    {booking.pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Voucher Promo Applied:</span>
                        <span>-${booking.pricing.discountAmount} USD</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-emerald-700">
                      <span>Amount Paid ({booking.paymentStatus}):</span>
                      <span>
                        ${booking.paymentStatus === "Fully Paid" ? booking.pricing.totalUSD : booking.pricing.depositRequiredUSD} USD
                      </span>
                    </div>
                    {booking.paymentStatus === "Deposit Paid" && (
                      <div className="flex justify-between text-gray-600">
                        <span>Balance Payable Upon Arrival at Basecamp:</span>
                        <span className="font-bold">${booking.pricing.remainingBalanceUSD} USD</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 print:hidden">
                    <button
                      onClick={handlePrintInvoice}
                      className="px-5 py-2.5 rounded-xl bg-[#122826] hover:bg-[#18979B] text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print / Save PDF Invoice</span>
                    </button>

                    <Link
                      href={booking.trackingSource?.returnUrl || "/"}
                      className="px-5 py-2.5 rounded-xl bg-[#18979B] hover:bg-[#13797C] text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <span>Return to {booking.trackingSource?.returnUrl !== "/" ? "Package Detail" : "Homepage"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Simulated Automated Email Status Box */}
                {emailSimulated && (
                  <div className="bg-[#122826] rounded-3xl p-6 text-white space-y-3 print:hidden">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-[#D4A017] uppercase tracking-wider">
                        <Mail className="w-4 h-4" />
                        <span>Automated Email Dispatch Log Simulation</span>
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                        Delivered Successfully ⚡
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1 bg-black/30 p-4 rounded-2xl font-mono">
                      <p>➔ To Customer: <span className="text-white font-bold">{booking.customer.email}</span> (E-Ticket + Packing Checklist)</p>
                      <p>➔ To Basecamp Director: <span className="text-white font-bold">rinjanihero@gmail.com</span> (Permit Registration Request)</p>
                      <p>➔ Tracking Source Record: <span className="text-[#18979B]">Referrer: {booking.trackingSource.referrer}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Order Overview Card (5 spans) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">Reservation Summary</span>
                <h3 className="text-xl font-extrabold text-[#122826] mt-1">{booking.packageTitle}</h3>
                <p className="text-xs text-[#18979B] font-bold mt-1">Status: {booking.paymentStatus}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#18979B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block uppercase font-bold">Target Ascent Date</span>
                    <span className="font-bold text-[#122826] text-sm">{booking.trekDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block uppercase font-bold">Participants</span>
                    <span className="font-bold text-[#122826] text-sm">
                      {booking.participants.adults} Adults
                      {booking.participants.children > 0 && `, ${booking.participants.children} Children`}
                      {booking.participants.extraPorters > 0 && ` (+${booking.participants.extraPorters} Extra Porters)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#18979B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block uppercase font-bold">Meeting & Pickup Note</span>
                    <span className="font-semibold text-gray-700">{booking.customer.pickupLocation}</span>
                  </div>
                </div>

                {booking.trackingSource && (
                  <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>Source Tracking: {booking.trackingSource.referrer} • {booking.trackingSource.utmSource}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-gray-600">
                  <span>Subtotal Amount:</span>
                  <span>${booking.pricing.subtotal} USD</span>
                </div>
                {booking.pricing.discountAmount > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Voucher Discount:</span>
                    <span>-${booking.pricing.discountAmount} USD</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-[#122826]">
                  <span>Total Amount:</span>
                  <span>${booking.pricing.totalUSD} USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
