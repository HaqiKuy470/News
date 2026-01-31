import { NextResponse } from "next/server";
import { client } from '@/sanity/lib/client'
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Validasi Input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Cek apakah email sudah terdaftar?
    const userExists = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
    if (userExists) {
      return NextResponse.json({ message: "Email sudah terdaftar!" }, { status: 400 });
    }

    // 3. Acak Password (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Sanity (Pakai Token Write yang ada di .env.local)
    // Pastikan Mas sudah punya SANITY_API_TOKEN di .env.local yang permission-nya Editor/Write
    await client.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
    }, { token: process.env.SANITY_API_TOKEN }); // Wajib pakai token buat nulis

    return NextResponse.json({ message: "Registrasi Sukses!" }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Gagal mendaftar" }, { status: 500 });
  }
}