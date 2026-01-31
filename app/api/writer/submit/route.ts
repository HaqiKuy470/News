import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { getServerSession } from "next-auth";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN1, // Pastikan token ada di .env.local
  useCdn: false,
});

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const bodyText = formData.get("body") as string;
    const imageFile = formData.get("image") as File;

    let imageAsset = null;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const asset = await writeClient.assets.upload('image', Buffer.from(buffer), { filename: imageFile.name });
      imageAsset = asset._id;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await writeClient.create({
      _type: 'post',
      title: title,
      slug: { current: `${slug}-${Date.now()}` },
      category: category,
      publishedAt: new Date().toISOString(),
      authorEmail: session.user.email, // Simpan email penulis
      mainImage: imageAsset ? { _type: 'image', asset: { _type: "reference", _ref: imageAsset } } : undefined,
      body: [{ _type: 'block', children: [{ _type: 'span', text: bodyText }], style: 'normal' }],
      isPremium: false,
    });

    return NextResponse.json({ message: "Sukses" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}