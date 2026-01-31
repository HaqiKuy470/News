"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau Password salah!");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[85vh] px-4 py-10">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">

          {/* 1. LOGO DI TENGAH */}
          <div className="text-center mb-8">
            {/* Ganti src="/logo.png" sesuai nama file logo Mas */}
            <div className="flex justify-center mb-4">
              {/* GANTI LOGO "A" DENGAN GAMBAR INI */}
              <div className="mb-6 flex justify-center">
                <Image
                  src="/logo.png"       // Pastikan file logo ada di folder public
                  alt="Arshaka Logo"
                  width={80}            // Ukuran logo (sesuaikan biar pas)
                  height={80}
                  className="object-contain" // Biar gambar tidak gepeng
                />
              </div>
            </div>
            <h1 className="text-2xl font-black text-[#5865F2]">Selamat Datang</h1>
            <p className="text-slate-500 text-sm mt-1">Masuk untuk akses berita premium</p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2 border border-red-100 animate-pulse">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5 mb-6">
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

              {/* 2. POSISI BARU: LUPA PASSWORD (Di Kanan Bawah Input) */}
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                  Lupa Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Masuk Sekarang"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-2 text-slate-400 font-bold">Atau</span></div>
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-sm mb-8"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Masuk dengan Google
          </button>

          {/* 3. POSISI BARU: REGISTER (Paling Bawah) */}
          <div className="text-center pt-2">
            <p className="text-slate-500 text-sm">
              Belum punya akun?{' '}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline transition-colors">
                Daftar Sekarang
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}