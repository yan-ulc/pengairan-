import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { laporan } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Data diterima:", body);

    const { nama, alamatPelapor, alamatKerusakan, deskripsi, foto } = body;

    console.log("🗄️ Menyimpan ke database...");
    await db.insert(laporan).values({
      nama,
      alamatPelapor,
      alamatKerusakan,
      deskripsi,
      // ✅ pastikan yang disimpan hanya string
      foto: typeof foto === "string" ? foto : null,
    });

    console.log("✅ Laporan tersimpan!");
    return NextResponse.json({ message: "Laporan berhasil disimpan." }, { status: 201 });
  } catch (error) {
    console.error("❌ Gagal simpan laporan:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
