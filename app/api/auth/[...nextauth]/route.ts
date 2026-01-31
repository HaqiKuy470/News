import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from '@/sanity/lib/client';// Sesuaikan path import sanity client Mas

const handler = NextAuth({
    providers: [
        // 1. OPSI LOGIN GOOGLE (Nanti diaktifkan kalau sudah punya Key)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),

        // 2. OPSI LOGIN TESTER (Buat Mas ngetes sekarang)
        // 2. OPSI LOGIN (Database Sanity)
        CredentialsProvider({
            name: "Email Manual",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // 1. CARI USER DI SANITY
                const user = await client.fetch(
                    `*[_type == "user" && email == $email][0]`,
                    { email: credentials.email }
                );

                // 2. JIKA USER DITEMUKAN & PASSWORD COCOK
                if (user && user.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (isValid) {
                        return {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                        };
                    }
                }

                return null; // Login Gagal
            }
        })
    ],
    callbacks: {
        // LOGIKA PENGECEKAN STATUS PREMIUM
        async session({ session }) {
            if (session.user?.email) {
                try {
                    // Cek ke Database Sanity: "Email ini terdaftar sebagai subscriber aktif gak?"
                    // Kita cari di tabel 'subscriber' yang tadi Mas buat
                    const subscriber = await client.fetch(
                        `*[_type == "subscriber" && email == $email && status == "active"][0]`,
                        { email: session.user.email }
                    );

                    // Kalau ketemu, tempelkan status PREMIUM ke sesi user
                    // @ts-ignore
                    session.user.isPremium = !!subscriber; // true kalau ada, false kalau tidak
                    // @ts-ignore
                    session.user.apiKey = subscriber?.apiKey || null;

                } catch (error) {
                    console.error("Gagal cek langganan", error);
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "haqi-sigma23", // Kunci enkripsi
});


export { handler as GET, handler as POST };