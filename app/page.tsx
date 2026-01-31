import Navbar from '@/components/Navbar';
import AdSpace from '@/components/AdSpace';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PlayCircle, Radio, Calendar } from 'lucide-react';

// 1. AMBIL DATA DARI SANITY (BERITA + LIVE TV)
async function getData() {
  const query = `
    {
      "posts": *[_type == "post"] | order(publishedAt desc)[0...10] {
        title, 
        "slug": slug.current, 
        mainImage, 
        category, 
        publishedAt,
        "preview": body[0].children[0].text
      },
      "live": *[_type == "livestream"][0] { 
        title, 
        description, 
        videoId, 
        nextProgram 
      }
    }
  `;
  // Revalidate tiap 30 detik biar kalau ganti video cepat berubah
  return await client.fetch(query, {}, { next: { revalidate: 30 } });
}

export default async function Home() {
  const data = await getData();
  const posts = data.posts;
  const liveTV = data.live;

  // LOGIKA PEMBAGIAN BERITA (CNBC STYLE)
  const mainStory = posts?.[0];           
  const sideStories = posts?.slice(1, 3) || []; 
  const bottomStories = posts?.slice(3, 6) || [];

  // LOGIKA LIVE TV (FALLBACK DEFAULT KALAU SANITY KOSONG)
  const videoId = liveTV?.videoId || "bNyUyrvbCx4"; // Default Al Jazeera/CNN kalau kosong
  const liveTitle = liveTV?.title || "Siaran Langsung Arshaka TV 24 Jam";
  const liveDesc = liveTV?.description || "Saksikan update berita terkini dari seluruh dunia, disiarkan langsung tanpa henti.";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      {/* =========================================
          SECTION 1: LIVE STREAMING DINAMIS
          (Background Gelap Cinematic)
         ========================================= */}
      <section className="bg-slate-950 pt-6 pb-12 border-b-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-4">
            
            {/* Header Live */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-wider flex items-center gap-2">
                        LIVE TV <span className="text-slate-500 font-medium text-sm hidden md:inline-block">| Arshaka Streaming</span>
                    </h2>
                </div>
                <div className="bg-white/10 text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2">
                    <Radio className="w-4 h-4" /> ON AIR
                </div>
            </div>

            {/* Video Player Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
                
                {/* KOLOM KIRI: VIDEO PLAYER (Youtube) */}
                <div className="lg:col-span-2">
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-slate-800 relative group">
                        <iframe 
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1`} 
                            title="Live Streaming"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* KOLOM KANAN: INFO ACARA (Data dari Sanity) */}
                <div className="hidden lg:flex flex-col justify-between bg-slate-900 rounded-xl p-6 border border-slate-800 h-full">
                    <div>
                        <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-2 block animate-pulse">SEDANG TAYANG</span>
                        <h1 className="text-white text-2xl font-bold leading-snug mb-4">
                            {liveTitle}
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {liveDesc}
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Info Next Program */}
                        {liveTV?.nextProgram && (
                             <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500">
                                <span className="text-slate-500 text-[10px] font-bold uppercase">SELANJUTNYA</span>
                                <h4 className="text-white font-bold text-sm">{liveTV.nextProgram}</h4>
                            </div>
                        )}
                       
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50">
                            <PlayCircle className="w-5 h-5" /> Tonton Full Screen
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </section>

      {/* =========================================
          SECTION 2: BERITA TEKS (LAYOUT CNBC)
         ========================================= */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Iklan Header */}
        <AdSpace position="header" />

        <div className="mb-8 flex items-center gap-3">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Berita Terkini</h2>
        </div>

        {(!posts || posts.length === 0) ? (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                <p>Belum ada berita yang dipublish. Silakan buat di Sanity Studio.</p>
            </div>
        ) : (
            <>
                {/* GRID UTAMA (2 Kolom Kiri, 1 Kolom Kanan) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 border-b border-slate-200 pb-12">
                
                {/* KOLOM KIRI (JATAH 2 KOLOM) - BERITA UTAMA */}
                <div className="lg:col-span-2">
                    {mainStory && (
                    <Link href={`/news/${mainStory.slug}`} className="group block h-full">
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100 shadow-sm">
                        {mainStory.mainImage && (
                            <img
                            src={urlFor(mainStory.mainImage).width(800).url()}
                            alt={mainStory.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-1 text-xs font-black uppercase tracking-widest text-indigo-800 rounded shadow-lg">
                            {mainStory.category || "Headline"}
                        </div>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3 group-hover:text-indigo-700 transition-colors text-slate-900">
                        {mainStory.title}
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed line-clamp-2">
                        {mainStory.preview}...
                        </p>
                        <div className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(mainStory.publishedAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </Link>
                    )}
                </div>

                {/* KOLOM KANAN (JATAH 1 KOLOM) - BERITA SAMPING */}
                <div className="flex flex-col gap-8 h-full">
                    {sideStories.map((post: any, index: number) => (
                    <Link href={`/news/${post.slug}`} key={index} className="group block flex-1 border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                        <div className="aspect-[3/2] rounded-lg overflow-hidden bg-slate-100 mb-3 shadow-sm">
                        {post.mainImage && (
                            <img
                            src={urlFor(post.mainImage).width(400).height(250).url()}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        )}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">
                            {post.category || "Terpopuler"}
                        </div>
                        <h3 className="text-lg font-bold leading-snug group-hover:text-indigo-600 transition-colors line-clamp-3 text-slate-900">
                        {post.title}
                        </h3>
                    </Link>
                    ))}
                </div>

                </div>

                {/* SECTION 3: DERETAN BAWAH (PILIHAN REDAKSI) */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                    <h3 className="text-xl font-bold text-slate-900">Pilihan Redaksi</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {bottomStories.map((post: any, index: number) => (
                        <Link href={`/news/${post.slug}`} key={index} className="group block">
                            <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3 relative shadow-sm">
                                {post.mainImage && (
                                    <img
                                    src={urlFor(post.mainImage).width(400).url()}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mb-1">{new Date(post.publishedAt).toLocaleDateString('id-ID')}</div>
                            <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-indigo-600 transition-colors text-slate-900 line-clamp-2">
                                {post.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </>
        )}

        {/* Iklan Footer */}
        <div className="my-10 border-t border-slate-200 pt-10">
            <AdSpace position="footer" />
        </div>

      </main>
      
      <footer className="bg-slate-900 text-white py-12 text-center border-t border-slate-800">
        <p className="opacity-50 text-sm">© 2026 Arshaka News Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}