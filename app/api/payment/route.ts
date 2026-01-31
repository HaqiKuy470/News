import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
    isProduction: false, // Ganti 'true' kalau sudah live
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

export async function POST(request: Request) {
    try {
        const { planName, price, duration, user } = await request.json();

        // Buat Order ID Unik (Misal: ARS-173823-999)
        const orderId = `ARS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Bersihkan format harga (Rp 15.000 -> 15000)
        const grossAmount = parseInt(price.replace(/[^0-9]/g, ''));

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount,
            },
            customer_details: {
                first_name: user?.name || "Guest",
                email: "customer@example.com", // Nanti bisa ambil dari input user
            },
            item_details: [
                {
                    id: planName.replace(/\s/g, '_').toLowerCase(),
                    price: grossAmount,
                    quantity: 1,
                    name: `${planName} (${duration})`,
                },
            ],
        };

        const token = await snap.createTransaction(parameter);

        return NextResponse.json({ token: token.token });

    } catch (error) {
        console.error("Midtrans Error:", error);
        return NextResponse.json({ error: "Gagal memproses pembayaran" }, { status: 500 });
    }
}