// app/api/laporan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nama,
      umur,
      alamat,
      email,
      nomor_telpon,
      jenis_kerusakan,
      foto_url,
      latitude,
      longitude,
    } = body;

    // Validasi data
    if (!nama || !umur || !alamat || !email || !nomor_telpon || !jenis_kerusakan || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      INSERT INTO laporan_kerusakan (
        nama, umur, alamat, email, nomor_telpon, jenis_kerusakan, foto_url, latitude, longitude
      ) VALUES (
        ${nama}, ${umur}, ${alamat}, ${email}, ${nomor_telpon}, ${jenis_kerusakan}, ${foto_url}, ${latitude}, ${longitude}
      )
      RETURNING id
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Laporan berhasil dikirim',
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting laporan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim laporan' },
      { status: 500 }
    );
  }
}