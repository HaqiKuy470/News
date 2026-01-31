import Navbar from "@/components/Navbar";
import { TrendingUp, Users, MousePointer } from "lucide-react";

export default function AdvertisePage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-2 block">Arshaka Media Kit</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Jangkau Jutaan Pembaca <br />Masa Depan</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Promosikan brand Anda di platform berita teknologi & bisnis dengan pertumbuhan tercepat di Indonesia.
                    </p>
                </div>

                {/* STATISTIK STATIS (Biar Keren) */}
                <div className="grid grid-cols-3 gap-4 mb-16">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                        <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                        <div className="text-3xl font-black text-slate-900">50K+</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Pembaca Bulanan</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                        <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-3xl font-black text-slate-900">1.2M</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">Pageviews</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
                        <MousePointer className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                        <div className="text-3xl font-black text-slate-900">4.5%</div>
                        <div className="text-xs font-bold text-slate-400 uppercase">CTR Rata-rata</div>
                    </div>
                </div>

                {/* PILIHAN SLOT IKLAN */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Slot Tersedia</h2>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-300 transition-all">
                        <div>
                            <h3 className="font-bold text-lg">Header Leaderboard (728x90)</h3>
                            <p className="text-slate-500 text-sm">Posisi paling premium di atas setiap halaman.</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-900">Rp 5 Juta</span>
                            <span className="text-xs text-slate-400">/ Bulan</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-300 transition-all">
                        <div>
                            <h3 className="font-bold text-lg">Sidebar Sticky (300x600)</h3>
                            <p className="text-slate-500 text-sm">Iklan vertikal yang mengikuti scroll pembaca.</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-900">Rp 3 Juta</span>
                            <span className="text-xs text-slate-400">/ Bulan</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-300 transition-all">
                        <div>
                            <h3 className="font-bold text-lg">Footer (300x600)</h3>
                            <p className="text-slate-500 text-sm">Iklan vertikal yang mengikuti scroll pembaca.</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-slate-900">Rp 3 Juta</span>
                            <span className="text-xs text-slate-400">/ Bulan</span>
                        </div>
                    </div>
                    {/* CONTACT ACTION */}
                    <div className="bg-slate-900 text-white p-8 rounded-3xl text-center mt-12">
                        <h2 className="text-2xl font-bold mb-4">Tertarik Bekerjasama?</h2>
                        <p className="text-slate-400 mb-8">Hubungi tim marketing kami untuk penawaran khusus.</p>
                        <a href="mailto:ads@arshaka.com" className="inline-block bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors">
                            Hubungi via Email
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}