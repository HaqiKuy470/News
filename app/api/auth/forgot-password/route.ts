import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { Resend } from "resend";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Pastikan sudah npm install bcryptjs

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, type, otp, newPassword } = await req.json();

    // === SCENARIO 1: REQUEST OTP ===
    if (type === "request") {
      // Cek User
      const user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
      if (!user) return NextResponse.json({ message: "Email tidak terdaftar" }, { status: 404 });

      // Generate OTP
      const code = crypto.randomInt(100000, 999999).toString();
      const expiry = Date.now() + 300000; // 5 Menit

      // Simpan ke DB
      await client.patch(user._id)
        .set({ resetToken: code, resetTokenExpiry: expiry })
        .commit({ token: process.env.SANITY_API_TOKEN });

      // Kirim Email (Gunakan Domain yang sudah diverifikasi di BAB 1)
      await resend.emails.send({
        from: 'Arshaka Security <no-reply@auth.arshakanews.com>', // SESUAIKAN SUBDOMAIN
        to: email,
        subject: 'Reset Password - Kode OTP',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Permintaan Reset Password</h2>
            <p>Gunakan kode berikut untuk mengganti password Anda:</p>
            <h1 style="background: #f4f4f5; padding: 10px; display: inline-block; letter-spacing: 5px;">${code}</h1>
            <p>Kode berlaku selama 5 menit. Jangan berikan kode ini ke siapapun.</p>
          </div>
        `
      });

      return NextResponse.json({ message: "OTP Terkirim" });
    }

    // === SCENARIO 2: RESET PASSWORD ===
    if (type === "reset") {
      const user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });

      // Validasi
      if (!user || user.resetToken !== otp) {
        return NextResponse.json({ message: "Kode OTP Salah" }, { status: 400 });
      }
      if (Date.now() > user.resetTokenExpiry) {
        return NextResponse.json({ message: "Kode OTP Kadaluarsa" }, { status: 400 });
      }

      // Update Password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await client.patch(user._id)
        .set({ password: hashedPassword })
        .unset(['resetToken', 'resetTokenExpiry']) // Hapus token bekas
        .commit({ token: process.env.SANITY_API_TOKEN });

      return NextResponse.json({ message: "Password Berhasil Diganti" });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}