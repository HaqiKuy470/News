import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script"; // <--- 1. IMPORT INI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arshaka News",
  description: "Portal Berita Ekonomi dan Bisnis Terupdate",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
            {/* 2. PASANG SCRIPT ADSENSE DI SINI */}
            {/* Ganti 'ca-pub-XXXXXXXXXXXXXXXX' dengan Publisher ID Mas nanti */}
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}