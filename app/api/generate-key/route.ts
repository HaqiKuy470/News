import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Kita butuh Client Khusus yang punya izin "Nulis" (Editor)
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // <--- Token Editor dari ENV
});

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // 1. GENERATE RANDOM KEY
    // Hasilnya kayak: ARS-x82m-99la-22kk
    const randomString = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
    const newApiKey = `ARS-SUPER-${randomString.toUpperCase()}`;

    // 2. SIMPAN KE SANITY
    await writeClient.create({
      _type: 'subscriber',
      name: name || 'Anonymous',
      email: email || 'no-email',
      apiKey: newApiKey,
      status: 'active'
    });

    return NextResponse.json({ success: true, apiKey: newApiKey });

  } catch (error) {
    console.error("Gagal generate key:", error);
    return NextResponse.json({ error: "Gagal membuat key" }, { status: 500 });
  }
}