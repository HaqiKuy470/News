import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { getServerSession } from "next-auth";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN1,
  useCdn: false,
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { bankName, accountNumber, accountHolder } = await req.json();
    const query = `*[_type == "writer" && email == $email][0]`;
    const existingWriter = await writeClient.fetch(query, { email: session.user.email });

    if (existingWriter) {
      await writeClient.patch(existingWriter._id).set({ bankName, accountNumber, accountHolder }).commit();
    } else {
      await writeClient.create({
        _type: 'writer',
        email: session.user.email,
        bankName,
        accountNumber,
        accountHolder,
        walletBalance: 0
      });
    }
    return NextResponse.json({ message: "Sukses" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}