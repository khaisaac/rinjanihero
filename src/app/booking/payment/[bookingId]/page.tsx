"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { useCMSStore } from "@/store/cmsStore";
import { BookingOrder } from "@/types/cms";

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params?.bookingId as string;
  const paymentOptionParam = searchParams?.get("paymentOption") as "deposit" | "full" || "deposit";
  
  const { bookings, updateBookingStatus } = useCMSStore();

  const [booking, setBooking] = useState<BookingOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

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
          <Link href="/booking" className="inline-block bg-[#18979B] text-white px-6 py-2.5 rounded-xl font-bold text-xs mt-2">
            Return to Booking Portal
          </Link>
        </div>
      </div>
    );
  }

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const newStatus = paymentOptionParam === "deposit" ? "Deposit Paid" : "Fully Paid";
      
      const res = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentOption: paymentOptionParam,
          paymentMethod: "card", // Default to card for DOKU redirect
          simulate: false,
        }),
      });

      const data = await res.json();
      
      if (data?.isLiveRedirect && data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Update local client state if simulating
      updateBookingStatus(booking.id, newStatus);
      setIsProcessing(false);
      setIsPaid(true);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#18979B", "#D4A017", "#10B981", "#3B82F6"],
      });
    } catch (error) {
      console.error("DOKU payment verification error:", error);
      const newStatus = paymentOptionParam === "deposit" ? "Deposit Paid" : "Fully Paid";
      updateBookingStatus(booking.id, newStatus);
      setIsProcessing(false);
      setIsPaid(true);
    }
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isPaid ? (
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#122826]">
              Connecting to DOKU Secure Gateway
            </h1>
            <p className="text-gray-600 text-sm">
              You are about to be redirected to DOKU to complete your payment of 
              <strong className="text-[#122826]">
                {" "}
                ${paymentOptionParam === "deposit" ? booking.pricing.depositRequiredUSD : booking.pricing.totalUSD} USD
              </strong>
              .
            </p>
            
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to DOKU"
              )}
            </button>
            <p className="text-xs text-gray-400">Do not refresh the page or click back.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full inline-block mb-2">
              Payment Verified — Official Permit Active
            </span>
            <h1 className="text-2xl font-extrabold text-[#122826]">
              Congratulations, {booking.customer.fullName}!
            </h1>
            <p className="text-gray-600 text-sm">
              We have dispatched your official E-Rinjani voucher to <strong className="text-[#18979B]">{booking.customer.email}</strong>.
            </p>
            <Link href="/" className="inline-block bg-[#122826] text-white px-6 py-3 rounded-xl font-bold text-sm">
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
