"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export default function AuthFloatingBanner() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);

  // 1. JANGAN TAMPILKAN jika user sudah login atau masih loading
  if (status === "loading" || session) return null;

  // 2. JANGAN TAMPILKAN jika user sudah menutup banner (klik X)
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-slate-900/95 backdrop-blur text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4">
        
        {/* TEKS RAYUAN */}
        <div className="flex-1">
          <h3 className="font-bold text-sm md:text-base text-indigo-400 mb-0.5">
            Baca Berita Tanpa Batas?
          </h3>
          <p className="text-xs text-slate-300 leading-tight">
            Daftar sekarang untuk akses fitur premium, simpan artikel, dan komentar.
          </p>
        </div>

        {/* TOMBOL ACTION */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/login" className="bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs py-2.5 px-4 rounded-lg transition-colors">
            Masuk
          </Link>
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors hidden sm:block">
            Daftar
          </Link>
        </div>

        {/* TOMBOL CLOSE */}
        <button 
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-lg"
        >
            <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}