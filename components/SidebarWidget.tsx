"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MessageCircle, Activity, Radar, TrendingUp } from 'lucide-react';

const SidebarWidget = () => {
    const { data: session } = useSession();
    const user = session?.user;
    // @ts-ignore
    const hasDiscordAccess = session?.user?.isPremium;

    // 1. TAMPILAN KHUSUS MEMBER VIP (SUDAH BAYAR)
    if (hasDiscordAccess) {
        return (
            <div className="bg-[#5865F2] text-white rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-indigo-500/30 group">
                {/* Hiasan Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black leading-none">VIP SERVER</h3>
                            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mt-1">Status: Active ✅</p>
                        </div>
                    </div>

                    {/* List Fitur Sesuai Screenshot Server */}
                    <div className="space-y-2 mb-6 bg-black/10 p-3 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                            <Activity className="w-3 h-3 text-green-300" />
                            <span>Alpha Coin Tracker</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                            <Radar className="w-3 h-3 text-red-300" />
                            <span>Whale Alerts & Radar</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-indigo-100">
                            <TrendingUp className="w-3 h-3 text-amber-300" />
                            <span>Gold & Crypto Signals</span>
                        </div>
                    </div>

                    {/* Tombol Masuk */}
                    <a
                        href="https://discord.gg/GANTI_LINK_INVITE_MAS_DISINI" // <--- GANTI LINK INI
                        target="_blank"
                        className="block w-full bg-white text-[#5865F2] font-black py-3 rounded-xl hover:bg-indigo-50 transition-all text-center shadow-lg transform hover:-translate-y-1"
                    >
                        LAUNCH DISCORD 🚀
                    </a>
                    <p className="text-center text-[10px] text-indigo-200 mt-2 opacity-80">
                        Logged in as: {user?.name}
                    </p>
                </div>
            </div>
        );
    }

    // 2. TAMPILAN UNTUK USER BIASA (TEASER AGAR PENASARAN)
    return (
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-40"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE DATA</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Premium Access</span>
                </div>

                <h3 className="text-xl font-black mb-2 leading-tight">
                    Dapatkan Sinyal <br /> <span className="text-indigo-400">Alpha Tracker</span> Realtime
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Jangan cuma baca berita. Lihat pergerakan <strong>Whale & Smart Money</strong> langsung dari server private kami.
                </p>

                {/* Preview Channel (Biar makin percaya) */}
                <div className="flex gap-2 mb-6 overflow-hidden opacity-50 grayscale">
                    <div className="bg-slate-800 px-2 py-1 rounded text-[10px]">#coin-tracker</div>
                    <div className="bg-slate-800 px-2 py-1 rounded text-[10px]">#whale-alerts</div>
                    <div className="bg-slate-800 px-2 py-1 rounded text-[10px]">#gold-signal</div>
                </div>

                <Link href="/subscription" className="block w-full">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-900/50">
                        Buka Akses Discord 🔒
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SidebarWidget;