import Navbar from "@/components/Navbar";
import { Users, Target, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {/* HEADER HERO */}
      <div className="bg-indigo-900 text-white py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Membangun Informasi, <br/>Mencerdaskan Bangsa</h1>
        <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
          Arshaka News hadir sebagai pelopor jurnalisme data yang akurat, tajam, dan berimbang di era digital.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        
        {/* VISI MISI */}
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Visi Kami</h3>
                <p className="text-slate-500 text-sm">Menjadi media rujukan utama yang menyajikan kebenaran data di tengah arus informasi.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Komunitas</h3>
                <p className="text-slate-500 text-sm">Membangun ekosistem pembaca yang kritis dan komunitas diskusi yang sehat.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Integritas</h3>
                <p className="text-slate-500 text-sm">Menjunjung tinggi kode etik jurnalistik dan independensi redaksi.</p>
            </div>
        </div>

        {/* TIM REDAKSI (Contoh) */}
        <div>
            <h2 className="text-3xl font-black text-center mb-10">Tim Redaksi</h2>
            <div className="flex flex-wrap justify-center gap-8">
                {/* Mas Haqi sebagai CEO */}
                <div className="text-center">
                    <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Haqi" alt="CEO" />
                    </div>
                    <h4 className="font-bold text-lg">Moh Dhiyaulhaq</h4>
                    <span className="text-indigo-600 text-sm font-bold tracking-wider">FOUNDER & CEO</span>
                </div>
                
                {/* Tim Lain (Placeholder) */}
                <div className="text-center">
                    <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Editor" />
                    </div>
                    <h4 className="font-bold text-lg">Sarah Wijaya</h4>
                    <span className="text-slate-500 text-sm font-bold tracking-wider">EDITOR IN CHIEF</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}