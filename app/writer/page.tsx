"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  PenTool, LayoutDashboard, Wallet, Loader2, 
  CheckCircle, Save, Image as ImageIcon, Send, 
  Clock, XCircle, AlertTriangle, X 
} from "lucide-react";
import { client } from "@/sanity/lib/client";

export default function WriterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // --- STATE UTAMA (Status Akun) ---
  const [writerStatus, setWriterStatus] = useState<'new' | 'pending' | 'approved' | 'rejected' | 'loading'>('loading');
  
  // --- STATE CUSTOM ALERT / MODAL (BIAR GANTENG) ---
  const [modal, setModal] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false, message: '', type: 'success'
  });

  // --- STATE PENDAFTARAN (User Baru) ---
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [identityCard, setIdentityCard] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE DASHBOARD (User Approved) ---
  const [activeTab, setActiveTab] = useState<'write' | 'articles' | 'wallet'>('write');
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<any>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  // Form Artikel
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Teknologi");
  const [body, setBody] = useState("");
  const [articleImage, setArticleImage] = useState<File | null>(null);
  
  // Form Rekening
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // HELPER: TAMPILKAN NOTIFIKASI
  const showNotification = (message: string, type: 'success' | 'error') => {
    setModal({ show: true, message, type });
    // Otomatis tutup setelah 3 detik
    setTimeout(() => setModal({ ...modal, show: false }), 3000);
  };

  // 1. CEK STATUS SAAT LOAD
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.email) checkStatus(session.user.email);
  }, [status, session, router]);

  const checkStatus = async (email: string) => {
    try {
      const query = `*[_type == "writer" && email == $email][0]`;
      const data = await client.fetch(query, { email });

      if (!data) {
        setWriterStatus('new'); 
      } else {
        setWriterStatus(data.status || 'pending');
        
        if (data.status === 'approved') {
            fetchDashboardData(email);
            setWalletData(data);
            if(data.bankName) setBankName(data.bankName);
            if(data.accountNumber) setAccountNumber(data.accountNumber);
            if(data.accountHolder) setAccountHolder(data.accountHolder);
        }
      }
    } catch (err) { 
        console.error(err);
        setWriterStatus('new');
    }
  };

  const fetchDashboardData = async (email: string) => {
      try {
        const queryPosts = `*[_type == "post" && authorEmail == $email] | order(_createdAt desc)`;
        const posts = await client.fetch(queryPosts, { email });
        setMyPosts(posts);
        const total = posts.reduce((acc: number, curr: any) => acc + (curr.earnings || 0), 0);
        setTotalEarnings(total);
      } catch (err) { console.error(err); }
  };

  // 2. FUNGSI DAFTAR (REGISTER)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!identityCard) return showNotification("Wajib upload foto identitas!", "error");

    setIsSubmitting(true);
    try {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("reason", reason);
        formData.append("identityCard", identityCard);

        const res = await fetch("/api/writer/apply", { method: "POST", body: formData });

        if (res.ok) {
            setWriterStatus('pending');
            window.scrollTo(0, 0);
            showNotification("Pendaftaran Berhasil Dikirim!", "success");
        } else {
            showNotification("Gagal mengirim pendaftaran.", "error");
        }
    } catch (err) {
        showNotification("Terjadi kesalahan sistem.", "error");
    } finally {
        setIsSubmitting(false);
    }
  };

  // 3. FUNGSI KIRIM ARTIKEL
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("body", body);
        if (articleImage) formData.append("image", articleImage);

        const res = await fetch("/api/writer/submit", { method: "POST", body: formData });
        
        if (res.ok) { 
            showNotification("Artikel Terkirim ke Redaksi!", "success");
            setTitle(""); setBody(""); setArticleImage(null); 
            fetchDashboardData(session?.user?.email || ""); 
            setActiveTab('articles'); 
        } else {
            showNotification("Gagal mengirim artikel.", "error");
        }
    } catch (err) { console.error(err); } 
    finally { setActionLoading(false); }
  };

  // 4. FUNGSI SIMPAN REKENING
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const res = await fetch("/api/writer/profile", {
            method: "POST",
            body: JSON.stringify({ bankName, accountNumber, accountHolder })
        });
        if (res.ok) showNotification("Data Rekening Berhasil Disimpan!", "success");
        else showNotification("Gagal menyimpan data.", "error");
    } catch (err) { console.error(err); } 
    finally { setActionLoading(false); }
  };

  if (status === "loading" || writerStatus === 'loading') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-indigo-600"/>
            <p className="text-slate-500 font-bold text-sm">Memuat Data Penulis...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <Navbar />

      {/* --- POPUP NOTIFIKASI MEWAH --- */}
      {modal.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 animate-in fade-in zoom-in duration-200">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setModal({...modal, show: false})}></div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative z-10 flex flex-col items-center text-center border border-slate-100">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modal.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    {modal.type === 'success' ? <CheckCircle className="w-8 h-8"/> : <AlertTriangle className="w-8 h-8"/>}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">{modal.type === 'success' ? 'Berhasil!' : 'Gagal!'}</h3>
                <p className="text-slate-500 text-sm mb-6">{modal.message}</p>
                <button onClick={() => setModal({...modal, show: false})} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm w-full hover:bg-slate-800">OK, Mengerti</button>
            </div>
        </div>
      )}

      {/* =========================================================
          SCENARIO 1: FORM PENDAFTARAN
         ========================================================= */}
      {writerStatus === 'new' && (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PenTool className="w-10 h-10 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-black mb-2">Gabung Komunitas Penulis</h1>
                <p className="text-slate-500 mb-8 text-sm max-w-md mx-auto">
                    Lengkapi data diri di bawah ini untuk verifikasi. Data Anda aman bersama kami.
                </p>

                <form onSubmit={handleRegister} className="text-left space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap (Sesuai KTP)</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Identitas (KTP/KTM)</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative group cursor-pointer">
                            <input type="file" required accept="image/*" onChange={(e) => setIdentityCard(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                            <div className="flex flex-col items-center justify-center gap-2">
                                {identityCard ? <span className="text-green-600 font-bold text-sm bg-green-50 px-4 py-1 rounded-full">✅ {identityCard.name}</span> : <><ImageIcon className="w-8 h-8 text-slate-300"/><span className="text-slate-500 text-sm">Klik untuk upload foto kartu</span></>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alasan Bergabung</label>
                        <textarea required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ceritakan motivasi Anda..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 h-28"></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <><Send className="w-4 h-4"/> Kirim Pendaftaran</>}
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* =========================================================
          SCENARIO 2: STATUS PENDING
         ========================================================= */}
      {writerStatus === 'pending' && (
        <div className="max-w-xl mx-auto px-4 py-24 text-center animate-in fade-in">
             <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black mb-3">Sedang Ditinjau</h2>
                <p className="text-slate-500 mb-6">Tim kami sedang memverifikasi data Anda. Mohon tunggu 1x24 Jam.</p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-400 font-mono">STATUS: PENDING_APPROVAL</div>
             </div>
        </div>
      )}

      {/* =========================================================
          SCENARIO 3: STATUS REJECTED
         ========================================================= */}
      {writerStatus === 'rejected' && (
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
             <div className="bg-white p-10 rounded-3xl shadow-sm border border-red-100">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-black mb-3 text-red-600">Pendaftaran Ditolak</h2>
                <p className="text-slate-500 mb-6">Data tidak valid. Silakan coba lagi.</p>
                <button onClick={() => setWriterStatus('new')} className="text-indigo-600 font-bold underline">Daftar Ulang</button>
             </div>
        </div>
      )}

      {/* =========================================================
          SCENARIO 4: DASHBOARD UTAMA (APPROVED)
         ========================================================= */}
      {writerStatus === 'approved' && (
        <main className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">{session?.user?.name?.[0]}</div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900">{session?.user?.name}</h1>
                        <p className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Verified Creator</p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-xs text-slate-400 font-bold uppercase mb-1">Total Pendapatan</div>
                    <div className="text-2xl font-black text-slate-900">Rp {totalEarnings.toLocaleString('id-ID')}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-2 sticky top-24 h-fit">
                    <button onClick={() => setActiveTab('write')} className={`w-full text-left px-4 py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'write' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><PenTool className="w-4 h-4"/> Tulis Artikel</button>
                    <button onClick={() => setActiveTab('articles')} className={`w-full text-left px-4 py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'articles' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard className="w-4 h-4"/> Status Artikel</button>
                    <button onClick={() => setActiveTab('wallet')} className={`w-full text-left px-4 py-4 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}><Wallet className="w-4 h-4"/> Dompet & Rekening</button>
                </div>

                {/* CONTENT */}
                <div className="lg:col-span-3">
                    {/* TAB WRITE */}
                    {activeTab === 'write' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                             <h2 className="text-xl font-black mb-6 flex items-center gap-2"><PenTool className="w-5 h-5 text-indigo-600"/> Tulis Artikel Baru</h2>
                             <form onSubmit={handleSubmitArticle} className="space-y-6">
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Judul</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-xl font-bold border-b-2 py-2 outline-none"/></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-3 rounded-xl"><option>Teknologi</option><option>Bisnis</option><option>Crypto</option><option>Lifestyle</option><option>Lainnya</option></select></div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">Cover</label><input type="file" required onChange={(e) => setArticleImage(e.target.files?.[0] || null)} className="w-full text-sm"/></div>
                                </div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Isi</label><textarea required value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full border p-4 rounded-xl outline-none"></textarea></div>
                                <button disabled={actionLoading} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">{actionLoading ? <Loader2 className="animate-spin"/> : "Kirim"}</button>
                             </form>
                        </div>
                    )}

                    {/* TAB ARTICLES */}
                    {activeTab === 'articles' && (
                         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100"><h2 className="text-xl font-black">Riwayat Tulisan</h2></div>
                            {myPosts.length === 0 ? <div className="p-10 text-center text-slate-400">Belum ada artikel.</div> : 
                                <div className="divide-y divide-slate-100">
                                    {myPosts.map(post => (
                                        <div key={post._id} className="p-6 flex justify-between hover:bg-slate-50">
                                            <div>
                                                <h3 className="font-bold">{post.title}</h3>
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${post._id.startsWith('drafts.') ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{post._id.startsWith('drafts.') ? 'Review' : 'Published'}</span>
                                            </div>
                                            <div className="text-right"><div className="text-[10px] uppercase font-bold text-slate-400">Pendapatan</div><div className="font-black text-indigo-600">{post.earnings ? `Rp ${post.earnings.toLocaleString('id-ID')}` : '-'}</div></div>
                                        </div>
                                    ))}
                                </div>
                            }
                         </div>
                    )}

                    {/* TAB WALLET */}
                    {activeTab === 'wallet' && (
                        <div className="space-y-6">
                             {/* KARTU SALDO + CATATAN WITHDRAW */}
                             <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Saldo Tersedia</p>
                                    <h1 className="text-4xl font-black mb-6">Rp {walletData?.walletBalance?.toLocaleString('id-ID') || 0}</h1>
                                    <div className="flex flex-col items-start gap-2">
                                        <button className="bg-white text-indigo-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 shadow-lg">Ajukan Pencairan (Withdraw)</button>
                                        <p className="text-[10px] text-indigo-200 font-medium bg-white/10 px-2 py-1 rounded">⚠️ Minimal pencairan saldo: <strong>Rp 20.000</strong></p>
                                    </div>
                                </div>
                                <Wallet className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-10 rotate-12"/>
                             </div>

                             {/* FORM REKENING */}
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                                 <h2 className="text-xl font-black mb-6">Rekening Pencairan</h2>
                                 <form onSubmit={handleSaveBank} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-500 uppercase">Bank</label><select value={bankName} onChange={e => setBankName(e.target.value)} className="w-full border p-3 rounded-xl"><option>BCA</option><option>BRI</option><option>Mandiri</option><option>GoPay</option><option>Dana</option></select></div>
                                        <div><label className="text-xs font-bold text-slate-500 uppercase">No. Rekening</label><input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full border p-3 rounded-xl"/></div>
                                    </div>
                                    <div><label className="text-xs font-bold text-slate-500 uppercase">Atas Nama</label><input type="text" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} className="w-full border p-3 rounded-xl"/></div>
                                    <button disabled={actionLoading} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold ml-auto flex items-center gap-2">{actionLoading ? "Menyimpan..." : "Simpan Info"}</button>
                                 </form>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
      )}
    </div>
  );
}