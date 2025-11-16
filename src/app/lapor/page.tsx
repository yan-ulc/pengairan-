"use client";
import { useState } from "react";

export default function LaporPage() {
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // ambil file, tapi kirim hanya nama file (demo)
    const file = data.get("foto") as File | null;
    const foto = file && file.name ? file.name : null;

    const payload = {
      nama: data.get("nama"),
      alamatPelapor: data.get("alamatPelapor"),
      alamatKerusakan: data.get("alamatKerusakan"),
      deskripsi: data.get("deskripsi"),
      foto,
    };

    const res = await fetch("/api/lapor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const rnd = Math.floor(Math.random() * 5) + 3;
      setMsg(`✅ Terima kasih! Laporan Anda tersimpan. Akan dikerjakan ±${rnd} hari kerja.`);
      form.reset();
    } else {
      setMsg("❌ Gagal mengirim laporan. Coba lagi nanti.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-gradient">Form Laporan Kerusakan</h1>
      {msg && (
        <div className="mt-5 border rounded-md bg-green-50 p-3 text-green-700">{msg}</div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <input name="nama" placeholder="Nama pelapor" className="input" required />
        <input name="alamatPelapor" placeholder="Alamat pelapor" className="input" required />
        <input name="alamatKerusakan" placeholder="Lokasi kerusakan" className="input" required />
        <textarea name="deskripsi" placeholder="Deskripsi masalah" className="input" required />
        <input type="file" name="foto" accept="image/*" className="file:btn" />
        <button type="submit" className="btn-primary">Kirim Laporan</button>
      </form>
    </div>
  );
}
