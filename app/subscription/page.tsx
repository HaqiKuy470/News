"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Check, X, Star, Zap, Terminal, CreditCard, User, 
  Lock, LogIn, AlertTriangle, HelpCircle, CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';

// --- TIPE DATA ---
interface PricingDetail { price: string; label: string; save?: string; }
interface Feature { text: string; available: boolean; }
interface Plan {
  name: string; desc: string; icon: React.ReactNode;
  features: Feature[]; pricing: Record<'monthly' | 'semiannual' | 'yearly', PricingDetail>;
  popular: boolean; needsDiscord?: boolean;
}

declare global { interface Window { snap: any; } }

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'semiannual' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [discordIdInput, setDiscordIdInput] = useState('');

  // STATE MODAL (LOGIN & NOTIFIKASI)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDiscordHelp, setShowDiscordHelp] = useState(false);
  
  // STATE CUSTOM ALERT (PENGGANTI ALERT BROWSER)
  const [alertModal, setAlertModal] = useState<{ show: boolean; type: 'success' | 'error' | 'warning'; message: string }>({
    show: false, type: 'success', message: ''
  });

  // Helper Notifikasi
  const notify = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlertModal({ show: true, message, type });
  };

  const plans: Plan[] = [
    {
      name: "News Premium",
      desc: "Baca berita nyaman tanpa gangguan iklan.",
      icon: <Star className="w-6 h-6 text-indigo-600" />,
      features: [
        { text: "Akses Semua Artikel Premium", available: true },
        { text: "Bebas Iklan (No Ads)", available: true },
        { text: "Dukungan Jurnalis Independen", available: true },
        { text: "Akses Komunitas Discord", available: false },
        { text: "Akses API Berita", available: false },
      ],
      pricing: {
        monthly: { price: "Rp 15.000", label: "/ bulan" },
        semiannual: { price: "Rp 75.000", label: "/ 6 bulan", save: "Hemat 15rb" },
        yearly: { price: "Rp 150.000", label: "/ tahun", save: "Hemat 30rb" },
      },
      popular: false,
      needsDiscord: false,
    },
    {
      name: "Discord VIP News",
      desc: "Diskusi, sinyal, dan update real-time di server private.",
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      features: [
        { text: "Semua Fitur News Premium", available: true },
        { text: "Join Private Discord Server", available: true },
        { text: "Notifikasi Berita Real-time", available: true },
        { text: "Diskusi & Tanya Jawab", available: true },
        { text: "Akses API Berita", available: false },
      ],
      pricing: {
        monthly: { price: "Rp 49.000", label: "/ bulan" },
        semiannual: { price: "Rp 250.000", label: "/ 6 bulan", save: "Hemat 44rb" },
        yearly: { price: "Rp 490.000", label: "/ tahun", save: "Hemat 98rb" },
      },
      popular: true,
      needsDiscord: true,
    },
    {
      name: "Super Ecosystem",
      desc: "Untuk developer & pebisnis yang butuh data mentah.",
      icon: <Terminal className="w-6 h-6 text-indigo-600" />,
      features: [
        { text: "Semua Fitur Discord VIP", available: true },
        { text: "Akses API Public (JSON)", available: true },
        { text: "Request Update via Gmail", available: true },
        { text: "Prioritas Support 24/7", available: true },
        { text: "Commercial License", available: true },
      ],
      pricing: {
        monthly: { price: "Rp 250.000", label: "/ bulan" },
        semiannual: { price: "Rp 1.250.000", label: "/ 6 bulan", save: "Hemat 250rb" },
        yearly: { price: "Rp 2.500.000", label: "/ tahun", save: "Hemat 500rb" },
      },
      popular: false,
      needsDiscord: true,
    },
  ];

  const handlePayment = async (plan: Plan, priceString: string) => {
    // 1. CEK LOGIN
    if (!session) {
        setShowLoginModal(true); 
        return; 
    }

    // 2. VALIDASI DISCORD (LOGIKA UTAMA)
    if (plan.needsDiscord) {
        if (!discordIdInput) {
            notify("Mohon isi Discord User ID Anda terlebih dahulu.", "warning");
            return;
        }
        // Validasi Format Angka
        if (!/^\d{17,20}$/.test(discordIdInput)) {
            notify("Format ID Salah! ID Discord harus berupa angka panjang (bukan username). Cek tutorial di bawah.", "error");
            return;
        }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        body: JSON.stringify({
          planName: plan.name,
          price: priceString,
          duration: billingCycle,
          user: session?.user
        }),
      });

      const { token } = await response.json();

      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: async function (result: any) {
            notify("Pembayaran Berhasil! Memproses paket...", "success");
            
            // Eksekusi Fitur Tambahan
            if (plan.needsDiscord) {
                await activateDiscordRole(plan.name);
            }
            if (plan.name === "Super Ecosystem") {
                await generateUserApiKey();
            }
          },
          onPending: function (result: any) { notify("Menunggu pembayaran...", "warning"); },
          onError: function (result: any) { notify("Pembayaran Gagal!", "error"); },
          onClose: function () { notify("Anda menutup popup sebelum selesai.", "warning"); }
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notify("Terjadi kesalahan sistem.", "error");
    }
    setLoading(false);
  };

  // Fungsi Placeholder (Backend logic)
  const activateDiscordRole = async (packageName: string) => { /* Panggil API Discord */ };
  const generateUserApiKey = async () => { /* Panggil API Key */ };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar />
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      {/* --- 1. MODAL ALERT CUSTOM (PENGGANTI ALERT BROWSER) --- */}
      {alertModal.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setAlertModal({...alertModal, show: false})}></div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-10 flex flex-col items-center text-center border border-slate-100">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                    alertModal.type === 'success' ? 'bg-green-100 text-green-600' : 
                    alertModal.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                    {alertModal.type === 'success' && <CheckCircle className="w-8 h-8"/>}
                    {alertModal.type === 'error' && <X className="w-8 h-8"/>}
                    {alertModal.type === 'warning' && <AlertTriangle className="w-8 h-8"/>}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                    {alertModal.type === 'success' ? 'Berhasil!' : alertModal.type === 'error' ? 'Gagal!' : 'Perhatian'}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">{alertModal.message}</p>
                <button onClick={() => setAlertModal({...alertModal, show: false})} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm w-full hover:bg-slate-800 transition-all">
                    OK, Mengerti
                </button>
            </div>
        </div>
      )}

      {/* --- 2. MODAL LOGIN (JIKA BELUM LOGIN) --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center border border-slate-100">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-red-500" /></div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Login Diperlukan</h3>
            <p className="text-slate-500 text-sm mb-8">Ups! Fitur berlangganan hanya tersedia untuk member terdaftar.</p>
            <div className="space-y-3">
                <Link href="/login" className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl">Login Sekarang</Link>
                <Link href="/register" className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl">Daftar Akun Baru</Link>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-2 block">Automated System</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Langganan & Aktivasi Instan</h1>
        </div>

        {/* --- KOLOM DISCORD (DENGAN PERINGATAN KERAS) --- */}
        <div className="max-w-xl mx-auto mb-12 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all relative overflow-hidden">
             
             {/* Link Join Server (WAJIB ADA) */}
             <div className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-indigo-900 text-sm mb-1">Penting: Wajib Join Server Dulu!</h4>
                    <p className="text-xs text-indigo-700 mb-2">
                        Bot tidak bisa memberi role jika Anda belum masuk ke server Discord kami. 
                    </p>
                    <a 
                        href="https://discord.gg/LINK_SERVER_MAS_DISINI" 
                        target="_blank" 
                        className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                    >
                        Gabung Discord Server <ExternalLink className="w-3 h-3"/>
                    </a>
                </div>
             </div>

             <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Masukkan Discord User ID Anda
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Contoh: 765432109876543210 (Angka Saja)"
                    value={discordIdInput}
                    onChange={(e) => setDiscordIdInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                />
            </div>

            {/* TOMBOL BANTUAN */}
            <button onClick={() => setShowDiscordHelp(!showDiscordHelp)} className="mt-3 text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <HelpCircle className="w-3 h-3" /> Bingung cari ID Discord? Klik tutorial ini.
            </button>

            {/* TUTORIAL SLIDE DOWN */}
            {showDiscordHelp && (
                <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm animate-in slide-in-from-top-2">
                    <h4 className="font-bold text-slate-900 mb-2">Cara Mendapatkan User ID (PC/Laptop):</h4>
                    <ol className="list-decimal ml-4 space-y-1 text-slate-600 text-xs">
                        <li>Buka Discord, masuk ke <strong>User Settings</strong> (Roda Gigi).</li>
                        <li>Pilih menu <strong>Advanced</strong>, aktifkan <strong>Developer Mode</strong>.</li>
                        <li>Klik Kanan profil Anda sendiri di chat, pilih <strong>Copy User ID</strong>.</li>
                        <li>Paste angkanya di kolom atas.</li>
                    </ol>
                </div>
            )}
        </div>

        {/* TOGGLE DURASI */}
        <div className="flex justify-center mb-16">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm inline-flex">
                <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-indigo-600'}`}>Bulanan</button>
                <button onClick={() => setBillingCycle('semiannual')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'semiannual' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-indigo-600'}`}>6 Bulan</button>
                <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-indigo-600'}`}>1 Tahun</button>
            </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {plans.map((plan, index) => {
            const currentPrice = plan.pricing[billingCycle];
            return (
              <div key={index} className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col h-full ${plan.popular ? "border-indigo-600 shadow-2xl scale-105 z-10" : "border-slate-200 hover:border-indigo-300 shadow-lg"}`}>
                {billingCycle !== 'monthly' && currentPrice.save && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">🎉 {currentPrice.save}</div>
                )}
                <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center">{plan.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[40px]">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{currentPrice.price}</span>
                  <span className="text-slate-400 font-medium text-xs">{currentPrice.label}</span>
                </div>
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      {feat.available ? <Check className="w-3 h-3 text-indigo-600 mt-0.5" /> : <X className="w-3 h-3 text-slate-400 mt-0.5" />}
                      <span className={feat.available ? "text-slate-700" : "text-slate-400 decoration-slate-300"}>{feat.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handlePayment(plan, currentPrice.price)}
                  disabled={loading}
                  className={`group w-full py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
                >
                  {!session ? <Lock className='w-4 h-4' /> : <CreditCard className="w-4 h-4" />} 
                  {loading ? 'Processing...' : (!session ? 'Login untuk Berlangganan' : 'Bayar Sekarang')}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}