"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Key,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (data.success) {
        // Save token & user state in localStorage for fast client-side checks
        localStorage.setItem("admin_token", "authenticated");
        localStorage.setItem("admin_user", JSON.stringify(data.user));

        // Redirect to target control panel page
        router.push(redirectUrl);
      } else {
        setError(data.error || "Authentication failed. Invalid credentials.");
      }
    } catch (err: any) {
      setError("Unable to connect to authentication server. Please verify network status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl shadow-black/50 space-y-8">
      {/* Title & Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#D4A017]/15 border border-[#D4A017]/30 text-[#D4A017] px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
          <span>Restricted Access Control</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Basecamp Control Panel
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          Enter your authorized staff credentials to manage Rinjani trekking bookings, routes, and pricing.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-300 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username / Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
            Username / Email Address
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="e.g. admin or admin@rinjanihero.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#18979B] focus:ring-2 focus:ring-[#18979B]/20 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Password / Access Key
            </label>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] font-bold text-[#D4A017] hover:underline"
            >
              {showHint ? "Hide Hint" : "Forgot Credentials?"}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter basecamp access key..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 rounded-2xl bg-black/40 border border-white/15 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#18979B] focus:ring-2 focus:ring-[#18979B]/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="bg-[#18979B]/15 border border-[#18979B]/30 rounded-2xl p-3.5 text-xs text-[#18979B] flex items-start gap-2.5">
            <Key className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white">Basecamp Admin Key:</span>
              <span>Username: <strong className="text-white">admin</strong> | Password: <strong className="text-white">sTEREO123.</strong></span>
            </div>
          </div>
        )}

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-300 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-black/40 border-white/20 text-[#18979B] focus:ring-0 cursor-pointer"
            />
            <span>Keep session active for 30 days</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#18979B] to-[#13797C] hover:from-[#158588] hover:to-[#0F6568] text-white font-extrabold text-sm shadow-xl shadow-[#18979B]/20 flex items-center justify-center gap-2 transition transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Authorization...</span>
            </>
          ) : (
            <>
              <span>Sign In to Control Panel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Note */}
      <div className="pt-4 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit SSL Encrypted Admin Session</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0F211F] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#18979B] selection:text-white">
      {/* Ambient Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#18979B]/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#D4A017]/15 blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 px-6 py-6 sm:px-12 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18979B] to-[#D4A017] flex items-center justify-center font-black text-white text-xl shadow-lg group-hover:scale-105 transition">
            RH
          </div>
          <div>
            <span className="text-base font-black tracking-tight block text-white group-hover:text-[#18979B] transition">
              RINJANI HERO
            </span>
            <span className="text-[10px] text-[#D4A017] font-bold tracking-widest uppercase block">
              TREKKING & EXPEDITIONS
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition"
        >
          <span>Return to Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#18979B]" />
        </Link>
      </header>

      {/* Main Login Card Area inside Suspense */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-3 border-[#18979B] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-400">Loading Basecamp Portal...</span>
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 text-center text-xs text-gray-500 border-t border-white/5">
        &copy; {new Date().getFullYear()} Rinjani Hero Trekking & Expeditions. All basecamp operations logged.
      </footer>
    </div>
  );
}
