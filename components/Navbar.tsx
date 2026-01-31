"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, User, TrendingUp, TrendingDown, LogOut, PenTool } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook Auth
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  // State IHSG
  const [ihsg, setIhsg] = useState({ price: 0, changePercent: 0, loading: true });

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('/api/ihsg');
        const data = await res.json();
        setIhsg({
          price: data.price,
          changePercent: data.changePercent,
          loading: false
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarket();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">

      {/* =======================================
          TOP BAR (NAVBAR ATAS - BIRU DONGKER)
         ======================================= */}
      <div className="bg-indigo-900 text-white text-xs py-2 px-4 hidden md:flex justify-between items-center">

        {/* KIRI: INFO PASAR & TANGGAL */}
        <div className="flex gap-4">
          <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-2 font-mono">
            <span className="bg-red-600 px-1.5 rounded font-bold animate-pulse text-[10px]">LIVE</span>
            {ihsg.loading ? (
              <span className="opacity-70">Memuat Data Pasar...</span>
            ) : (
              <span className={`flex items-center gap-1 font-bold ${ihsg.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                IHSG: {formatNumber(ihsg.price)}
                {ihsg.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                ({ihsg.changePercent >= 0 ? '+' : ''}{ihsg.changePercent.toFixed(2)}%)
              </span>
            )}
          </span>
        </div>

        {/* KANAN: MENU UTILITAS + PENULIS */}
        <div className="flex items-center gap-6 font-medium opacity-90">
          <Link href="/about" className="hover:text-white hover:underline transition-all">
            Tentang Kami
          </Link>

          {/* --- TOMBOL PENULIS (POSISI BARU) --- */}
          <Link
            href="/writer"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold hover:underline transition-all"
          >
            <PenTool className="w-3 h-3" />
            {isLoggedIn ? "Dasbor Penulis" : "Daftar Penulis"}
          </Link>
          {/* ------------------------------------ */}

          <Link href="/advertise" className="hover:text-white hover:underline transition-all">
            Pasang Iklan
          </Link>
        </div>
      </div>

      {/* =======================================
          MAIN BAR (NAVBAR UTAMA - PUTIH)
         ======================================= */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          {/* Ganti src="/logo.png" jika sudah ada logonya */}
          <Image
            src=""       // Pastikan nama file di folder public sesuai
            alt="Arshaka News"
            width={32}            // Ukuran lebar (32px setara w-8)
            height={32}           // Ukuran tinggi
            className="rounded-lg object-contain" // Supaya gambar tidak gepeng
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Arshaka<span className="text-indigo-600">News</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm font-bold text-slate-600 items-center">
          <Link href="/" className="hover:text-indigo-600 transition-colors">HOME</Link>
          <Link href="/category/teknologi" className="hover:text-indigo-600 transition-colors">TEKNOLOGI</Link>
          <Link href="/category/bisnis" className="hover:text-indigo-600 transition-colors">BISNIS</Link>
          <Link href="/category/crypto" className="hover:text-indigo-600 transition-colors">CRYPTO</Link>
          <Link href="/category/lifestyle" className="hover:text-indigo-600 transition-colors">LIFESTYLE</Link>
          <Link href="/category/lainnya" className="hover:text-indigo-600 transition-colors">LAINNYA</Link>
          <Link href="/subscription" className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition-colors">
            PREMIUM <span className="text-[10px] bg-amber-100 px-1 rounded border border-amber-200">PRO</span>
          </Link>
        </div>

        {/* ACTIONS KANAN */}
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600" />
          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

          {isLoggedIn && session?.user ? (
            <div className="flex items-center gap-3">
              {/* Info User */}
              <div className="text-right hidden lg:block leading-tight">
                <div className="text-xs font-bold text-slate-900">{session.user.name}</div>
                <div className="text-[10px] text-slate-400">Member</div>
              </div>
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold border border-indigo-100">
                {session.user.name?.[0] || "U"}
              </div>

              {/* Tombol Logout */}
              <button
                onClick={() => signOut()}
                className="hidden md:flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border border-red-100 ml-2"
                title="Keluar"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-slate-900/20">
              <User className="w-3 h-3" /> Login
            </Link>
          )}

          <Menu className="w-6 h-6 md:hidden text-slate-700 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 shadow-xl flex flex-col gap-4 z-50 animate-in slide-in-from-top-5">
          <Link href="/" className="font-bold text-slate-700">HOME</Link>
          <Link href="/category/teknologi" className="font-bold text-slate-700">TEKNOLOGI</Link>

          {/* MENU PENULIS DI MOBILE */}
          <Link href="/writer" className="font-bold text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
            <PenTool className="w-4 h-4" /> {isLoggedIn ? "Dasbor Penulis" : "Daftar Jadi Penulis"}
          </Link>

          <Link href="/subscription" className="font-bold text-indigo-600">UPGRADE PREMIUM</Link>

          {isLoggedIn ? (
            <button onClick={() => signOut()} className="bg-red-50 text-red-600 text-center py-2 rounded-lg font-bold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Keluar Akun
            </button>
          ) : (
            <Link href="/login" className="bg-slate-900 text-white text-center py-2 rounded-lg font-bold">Login Sekarang</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;