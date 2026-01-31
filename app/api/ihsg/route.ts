import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2'; // 1. Import Class (Pakai Kurung Kurawal)

// 2. Buat Instance Baru (Wajib di Versi 3)
const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey'], // Konfigurasi pindah ke sini
});

export async function GET() {
  try {
    // 3. Ambil Data IHSG (Kode: ^JKSE)
    const quote = await yahooFinance.quote('^JKSE');

    return NextResponse.json({
      price: quote.regularMarketPrice,
      changePercent: quote.regularMarketChangePercent,
      lastUpdate: quote.regularMarketTime,
    });
  } catch (error) {
    console.error("Gagal ambil IHSG:", error);
    
    // Fallback Data (Jika API Error / Limit)
    return NextResponse.json({
      price: 7300.25, // Contoh angka dummy
      changePercent: 0.15,
      lastUpdate: new Date()
    });
  }
}