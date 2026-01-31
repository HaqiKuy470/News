import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { getServerSession } from "next-auth";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN1, // Pakai Token WRITER
  useCdn: false,
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    // Terima Data Form (Multipart) karena ada file
    const formData = await req.formData();
    const fullName = formData.get("fullName") as string;
    const reason = formData.get("reason") as string;
    const identityFile = formData.get("identityCard") as File;

    if (!fullName || !reason || !identityFile) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Upload Foto Identitas ke Sanity Assets
    const buffer = await identityFile.arrayBuffer();
    const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
      filename: `ktp-${session.user.email}-${identityFile.name}`
    });

    // 2. Buat Data Writer Baru
    await writeClient.create({
      _type: 'writer',
      email: session.user.email,
      fullName: fullName,
      status: 'pending',
      applicationReason: reason,
      identityCard: {
        _type: 'image',
        asset: { _type: "reference", _ref: asset._id }
      },
      walletBalance: 0
    });

    return NextResponse.json({ message: "Sukses Mendaftar" });
  } catch (error) {
    console.error("Gagal Daftar:", error);
    return NextResponse.json({ message: "Error Server" }, { status: 500 });
  }
}