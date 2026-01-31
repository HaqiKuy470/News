import React from 'react';
import Navbar from '@/components/Navbar';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react'; // Penjemahkan Teks Sanity
import { Calendar, User, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AdSpace from '@/components/AdSpace'; // <--- 1. IMPORT IKLAN
import authFloatingBanner from '@/components/AuthFloatingBanner';
import AuthFloatingBanner from '@/components/AuthFloatingBanner';

// --- A. STYLING UNTUK ISI BERITA (PORTABLE TEXT) ---
// Biar tulisan beritanya rapi (ada paragraf, heading, list)
const ptComponents = {
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-slate-900">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-6 mb-3 text-slate-900">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-6 text-lg leading-relaxed text-slate-700">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-indigo-600 pl-4 italic text-slate-600 my-6 bg-slate-50 py-2 pr-2 rounded-r">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-5 mb-6 text-slate-700 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-5 mb-6 text-slate-700 space-y-2">{children}</ol>,
  },
};

// --- B. FUNGSI AMBIL DATA BERITA ---
async function getPost(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      mainImage,
      body,
      publishedAt,
      "authorName": author->name,
      "authorImage": author->image,
      category,
      isPremium
    }
  `;
  return await client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

// --- C. HALAMAN UTAMA ---
export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      <article className="max-w-3xl mx-auto px-4 py-10">

        {/* BREADCRUMB / TOMBOL KEMBALI */}
        <Link href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 mb-8 text-sm font-bold transition-colors">
          <ChevronLeft className="w-4 h-4" /> KEMBALI KE HOME
        </Link>

        {/* HEADER BERITA */}
        <div className="mb-8">
          <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3 block">
            {post.category || "Berita Utama"}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* INFO PENULIS & TANGGAL */}
          <div className="flex items-center justify-between border-y border-slate-100 py-4">
            <div className="flex items-center gap-3">
              {post.authorImage ? (
                <img src={urlFor(post.authorImage).width(100).url()} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">A</div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">{post.authorName || "Redaksi Arshaka"}</p>
                <p className="text-xs text-slate-500">Jurnalis</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-medium flex flex-col items-end gap-1">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
            </div>
          </div>
        </div>

        {/* GAMBAR UTAMA */}
        {post.mainImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
            <img
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ISI BERITA (BODY) */}
        <div className="prose prose-lg prose-indigo max-w-none text-slate-700">
          {post.body ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : (
            <p className="text-slate-400 italic">Isi berita sedang disiapkan...</p>
          )}
        </div>

        {/* --- 2. SLOT IKLAN FOOTER (DI SINI TEMPATNYA!) --- */}
        {/* Muncul pas orang selesai baca, sebelum komentar */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <AdSpace position="footer" />
        </div>

        {/* KOLOM KOMENTAR (Placeholder) */}
        <div className="mt-10 bg-slate-50 p-6 rounded-2xl">
          <h3 className="font-bold text-lg mb-4">Komentar Pembaca</h3>
          <p className="text-slate-500 text-sm">Fitur komentar akan segera hadir.</p>
        </div>

        {/* --- 2. PASANG BANNER DI SINI (PALING BAWAH) --- */}
        <AuthFloatingBanner/>

      </article>
    </div>
  );
}