"use client";

import Navbar from "@/components/Navbar";
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // STATE BARU: Untuk Mengontrol Popup Sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // SUKSES: Munculkan Modal Keren (Bukan Alert Biasa)
        setShowSuccessModal(true); 
      } else {
        const data = await res.json();
        setError(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar />

      {/* --- MODAL POPUP SUKSES REGISTRASI (MODERN) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 animate-in fade-in duration-300">
          {/* Backdrop Gelap Blur */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

          {/* Kartu Modal */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center border border-slate-100 transform scale-100 transition-all">
            
            {/* Ikon Sukses Besar */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-in zoom-in duration-300">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Registrasi Berhasil!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Akun Anda telah siap digunakan. Silakan masuk untuk mulai menjelajah berita premium.
            </p>

            <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200"
            >
                Masuk Sekarang
            </Link>
          </div>
        </div>
      )}
      {/* ----------------------------------------------- */}

      <div className="flex items-center justify-center min-h-[85vh] px-4 py-10">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            
            {/* LOGO DI TENGAH */}
            <div className="text-center mb-8">
                 <div className="flex justify-center mb-4">
                    {/* Ganti dengan <Image /> logo Mas kalau sudah ada */}
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-3xl shadow-sm">
                        A
                    </div>
                 </div>
                <h1 className="text-2xl font-black text-slate-900">Buat Akun Baru</h1>
                <p className="text-slate-500 text-sm mt-1">Bergabunglah dengan Arshaka News</p>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2 border border-red-100 animate-pulse">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                
                {/* INPUT NAMA */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Nama Lengkap</label>
                    <div className="relative group">
                        <User className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="text" 
                            required
                            placeholder="Nama Anda"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 text-sm"
                        />
                    </div>
                </div>

                {/* INPUT EMAIL */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="email" 
                            required
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 text-sm"
                        />
                    </div>
                </div>

                {/* INPUT PASSWORD */}
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-indigo-600 transition-colors" />
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800 text-sm"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Sekarang"}
                </button>
            </form>

            <div className="text-center pt-2">
                <p className="text-slate-500 text-sm">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline transition-colors">
                        Login di sini
                    </Link>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}