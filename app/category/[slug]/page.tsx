import React from 'react';
import Navbar from '@/components/Navbar';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSpace from '@/components/AdSpace';

// 1. AMBIL DATA BERITA SESUAI KATEGORI
async function getData(slug: string) {
    // Query 1: Berita di kategori ini (Diurutkan terbaru)
    const queryCategory = `
    *[_type == "post" && category == $slug] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      mainImage,
      category,
      isPremium,
      publishedAt,
      "preview": body[0].children[0].text
    }
  `;

    // Query 2: Berita Terpopuler (Kita ambil 5 berita acak/terbaru global buat sidebar)
    const queryTrending = `
    *[_type == "post"] | order(publishedAt desc)[0...5] {
      title, "slug": slug.current, category
    }
  `;

    const categoryPosts = await client.fetch(queryCategory, { slug }, { next: { revalidate: 30 } });
    const trendingPosts = await client.fetch(queryTrending, {}, { next: { revalidate: 30 } });

    return { categoryPosts, trendingPosts };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { categoryPosts, trendingPosts } = await getData(slug);

    // Kalau kategori tidak ada / salah ketik
    if (!categoryPosts) return notFound();

    // --- LOGIKA PEMBAGIAN BERITA (STYLE KOMPAS) ---
    // Berita 1: Headline Besar
    const headline = categoryPosts[0];
    // Berita 2-5: Grid Kecil di bawah Headline
    const subNews = categoryPosts.slice(1, 5);
    // Berita 6 dst: List memanjang ke bawah (Feed)
    const feedNews = categoryPosts.slice(5);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Navbar />

            {/* HEADER KATEGORI */}
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
                        Kanal <span className="text-indigo-600">{slug}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                        <span>Home</span>
                        <span>/</span>
                        <span className="capitalize text-indigo-600 font-bold">{slug}</span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                
                {/* IKLAN ATAS */}
                <AdSpace position="header" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">

                    {/* === KOLOM KIRI (BERITA) - Mengambil 8 Kolom === */}
                    <div className="lg:col-span-8">
                        
                        {categoryPosts.length > 0 ? (
                            <>
                                {/* 1. HEADLINE BESAR (KOMPAS STYLE) */}
                                {headline && (
                                    <div className="mb-10 group cursor-pointer">
                                        <Link href={`/news/${headline.slug}`}>
                                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                                                {headline.mainImage && (
                                                    <img
                                                        src={urlFor(headline.mainImage).width(800).url()}
                                                        alt={headline.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                )}
                                                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                                                    HEADLINE
                                                </div>
                                            </div>
                                            <h2 className="text-3xl font-black leading-tight mb-3 group-hover:text-indigo-700 transition-colors">
                                                {headline.title}
                                            </h2>
                                            <p className="text-slate-500 text-lg line-clamp-2 mb-3">
                                                {headline.preview}...
                                            </p>
                                            <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(headline.publishedAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* 2. SUB-NEWS GRID (Berita Kecil-Kecil di Bawahnya) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-8">
                                    {subNews.map((post: any, index: number) => (
                                        <Link href={`/news/${post.slug}`} key={index} className="flex gap-4 group cursor-pointer">
                                            {/* Gambar Kecil (Thumbnail) */}
                                            <div className="w-24 h-24 md:w-32 md:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                                {post.mainImage && (
                                                    <img
                                                        src={urlFor(post.mainImage).width(200).height(150).url()}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                )}
                                            </div>
                                            {/* Judul */}
                                            <div>
                                                <h3 className="font-bold text-sm md:text-base leading-snug mb-2 group-hover:text-indigo-600 line-clamp-3">
                                                    {post.title}
                                                </h3>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">
                                                    {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                
                                {/* 3. FEED BERITA SISANYA (List ke bawah) */}
                                {feedNews.length > 0 && (
                                    <div className="mt-10 space-y-8 border-t border-slate-200 pt-8">
                                        <h3 className="font-black text-xl uppercase tracking-widest text-indigo-900 border-l-4 border-indigo-600 pl-3">
                                            Indeks {slug}
                                        </h3>
                                        {feedNews.map((post: any, index: number) => (
                                            <Link href={`/news/${post.slug}`} key={index} className="flex flex-col md:flex-row gap-6 group">
                                                <div className="md:w-60 aspect-[3/2] rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                     {post.mainImage && (
                                                        <img src={urlFor(post.mainImage).width(300).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                     )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold group-hover:text-indigo-600 mb-2">{post.title}</h3>
                                                    <p className="text-slate-500 text-sm line-clamp-2">{post.preview}...</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-20 text-center bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-slate-500">Belum ada berita di kategori <span className="font-bold text-indigo-600">{slug}</span>.</p>
                            </div>
                        )}
                    </div>

                    {/* === KOLOM KANAN (SIDEBAR) - Mengambil 4 Kolom === */}
                    <aside className="lg:col-span-4 space-y-10">
                        
                        {/* WIDGET TERPOPULER */}
                        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                                <TrendingUp className="w-5 h-5 text-red-600" />
                                <h3 className="font-black text-lg uppercase">Terpopuler</h3>
                            </div>
                            <div className="space-y-6">
                                {trendingPosts.map((post: any, index: number) => (
                                    <Link href={`/news/${post.slug}`} key={index} className="flex gap-4 group items-start">
                                        <div className="text-4xl font-black text-slate-200 group-hover:text-indigo-100 transition-colors leading-none -mt-1">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">{post.category || "Umum"}</div>
                                            <h4 className="font-bold text-sm leading-snug group-hover:text-indigo-600">
                                                {post.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* IKLAN SIDEBAR (STICKY) */}
                        <div className="sticky top-24">
                            <div className="text-[10px] text-center text-slate-300 mb-1">Advertisement</div>
                            <AdSpace position="sidebar" />
                        </div>

                    </aside>

                </div>

                {/* IKLAN BAWAH */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <AdSpace position="footer" />
                </div>

            </main>
        </div>
    );
}