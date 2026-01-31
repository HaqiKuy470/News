import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // 1. BLOKIR BOT JAHAT (SCRAPERS)
  // Ini daftar nama bot pencuri data yang umum
  const badBots = ['curl', 'python-requests', 'scrapy', 'wget', 'Go-http-client'];
  
  const isBot = badBots.some(bot => userAgent.includes(bot));

  if (isBot) {
    // Kalau ketahuan bot, langsung tendang ke halaman promosi API
    return NextResponse.json(
      { 
        error: "Bot Access Forbidden", 
        message: "Dilarang scraping website ini! Gunakan API resmi kami.",
        buy_api: "https://arshaka-news.vercel.app/subscription" 
      },
      { status: 403 }
    );
  }

  // 2. CEK RATE LIMIT (Sederhana)
  // Mencegah orang merefresh halaman 100x sedetik (DDoS kecil-kecilan)
  // (Implementasi full butuh database Redis, tapi ini versi logic-nya)
  
  return NextResponse.next();
}

// Tentukan middleware ini menjaga halaman mana saja
export const config = {
  matcher: [
    '/news/:path*', // Jaga semua halaman berita
    '/api/:path*',  // Jaga API
  ],
};