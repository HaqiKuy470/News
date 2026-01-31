"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

// 1. KOMPONEN PEMBUNGKUS UTAMA
// Ini wajib ada biar "Session" bisa dibaca di seluruh aplikasi
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

// 2. HOOK KOMPATIBILITAS (PENTING!)
// Kita biarkan ini ada (walau kosong) supaya file lain yang masih import 'useAuth'
// tidak langsung error/crash. Nanti pelan-pelan kita ganti ke 'useSession'.
export const useAuth = () => {
  return { 
    user: null, 
    login: () => console.log("Gunakan tombol Login baru"), 
    logout: () => console.log("Gunakan tombol Logout baru") 
  }; 
};