"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail, Key, Lock, CheckCircle, AlertCircle, X } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // STATE BARU: Untuk Error & Modal Sukses
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle Kirim Email (Step 1)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error lama

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, type: "request" }),
      });

      if (res.ok) {
        setStep(2); // Langsung pindah ke halaman OTP
      } else {
        setError("Email tidak ditemukan atau terjadi kesalahan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password (Step 2)
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, type: "reset", otp, newPassword }),
      });

      if (res.ok) {
        // SUKSES: Munculkan Modal Keren
        setShowSuccessModal(true);
      } else {
        setError("Kode OTP salah atau sudah kadaluarsa.");
      }
    } catch (err) {
      setError("Gagal mereset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar />

      {/* --- MODAL POPUP SUKSES RESET PASSWORD --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center border border-slate-100 transform scale-100 transition-all">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Password Berhasil Diubah!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Keamanan akun Anda telah dipulihkan. Silakan login kembali dengan password baru.
            </p>

            <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200"
            >
                Login Sekarang
            </Link>
          </div>
        </div>
      )}
      {/* ------------------------------------------- */}

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          
          <Link href="/login" className="flex items-center gap-1 text-slate-400 text-sm mb-6 hover:text-indigo-600 transition-colors font-bold">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Login
          </Link>

          <h1 className="text-2xl font-black text-slate-900 mb-2">
            {step === 1 ? "Reset Password" : "Verifikasi Kode"}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {step === 1 ? "Masukkan email yang terdaftar untuk menerima kode akses." : `Kode OTP telah dikirim ke ${email}`}
          </p>

          {/* ERROR MESSAGE (Kotak Merah Inline) */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2 border border-red-100 animate-pulse">
                <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="email" 
                        placeholder="nama@email.com" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium text-slate-800"
                    />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Kode OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Kode OTP (Cek Email)</label>
                <div className="relative group">
                    <Key className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="123456" 
                        required 
                        maxLength={6} 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono tracking-widest text-lg font-bold text-center"
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Password Baru</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                    />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Password Baru"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}