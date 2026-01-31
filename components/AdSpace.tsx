"use client";

import React, { useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";

// Definisikan tipe window biar TypeScript gak marah
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSpaceProps {
  position: string; // Misal: "header", "sidebar", "footer"
}

const AdSpace = ({ position }: AdSpaceProps) => {
  const { data: session } = useSession();
  // @ts-ignore
  const isPremium = session?.user?.isPremium; 
  const adRef = useRef<boolean>(false);

  // LOGIKA ADSENSE
  useEffect(() => {
    // 1. Kalau user Premium, jangan jalankan script iklan
    if (isPremium) return;

    // 2. Push iklan ke antrian Google (Cuma sekali per komponen mount)
    if (adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adRef.current = true;
    } catch (err) {
      console.error("AdSense Error:", err);
    }
  }, [isPremium]);

  // JIKA PREMIUM -> HILANGKAN TOTAL (Return Null)
  if (isPremium) {
    return null;
  }

  // LOGIKA SLOT ID (Nanti Mas dapat ID ini dari Dashboard AdSense)
  // Mas harus bikin "Ad Unit" dulu di Google AdSense untuk tiap posisi
  let adSlotId = "";
  
  if (position === "header") adSlotId = "1234567890"; // Ganti ID asli Header
  else if (position === "sidebar") adSlotId = "0987654321"; // Ganti ID asli Sidebar
  else adSlotId = "1122334455"; // Default

  return (
    <div className="w-full flex justify-center my-6 overflow-hidden">
      {/* KOTAK IKLAN GOOGLE */}
      <div className="text-center text-[10px] text-slate-300 mb-1">Iklan</div>
      
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1234567890123456" // <--- GANTI PUBLISHER ID MAS
        data-ad-slot={adSlotId} // ID Slot otomatis ganti sesuai posisi
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      
      <div className="mt-1 text-[10px] text-slate-400">
        <a href="/subscription" className="hover:text-indigo-600">Hilangkan Iklan? Gabung Premium</a>
      </div>
    </div>
  );
};

export default AdSpace;