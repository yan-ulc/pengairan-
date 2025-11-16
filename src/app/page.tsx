// app/page.tsx
import Link from "next/link";

const tiles = [
  { title: "Lapor", desc: "Laporkan kerusakan fasilitas pengairan.", href: "/lapor", active: true },
  { title: "Profil", desc: "Informasi profil (non-aktif).", href: "#", active: false },
  { title: "PPID", desc: "Transparansi informasi (non-aktif).", href: "#", active: false },
  { title: "Layanan Publik", desc: "Daftar layanan (non-aktif).", href: "#", active: false },
  { title: "Open Data", desc: "Data terbuka (non-aktif).", href: "#", active: false },
  { title: "Berita", desc: "Kabar terbaru (non-aktif).", href: "#", active: false },
];

export default function Home() {
  return (
    <>
      {/* Hero ala slider/header */}
      <section
        className="relative h-[340px] md:h-[420px] grid place-content-center text-center text-white"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 px-4">
          <div className="text-4xl md:text-5xl font-semibold">Informasi Pengairan Aceh</div>
          <p className="mt-3 text-slate-200">Cuaca, informasi, dan pelaporan kerusakan fasilitas.</p>

          {/* Search strip dummy */}
          <div className="mt-6 mx-auto max-w-3xl flex">
            <input
              className="flex-1 rounded-l-md px-4 py-3 text-slate-800"
              placeholder="Ketik untuk mencari… (dummy)"
            />
            <button className="rounded-r-md px-4 py-3 bg-green-600 hover:bg-green-700">
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* Tiles dashboard */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((t) =>
            t.active ? (
              <Link
                key={t.title}
                href={t.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition"
              >
                <div className="text-lg font-semibold group-hover:text-green-700">{t.title}</div>
                <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
              </Link>
            ) : (
              <div
                key={t.title}
                className="rounded-xl border border-slate-200 bg-white p-5 opacity-60 pointer-events-none select-none"
                title="Formalitas (non-aktif)"
              >
                <div className="text-lg font-semibold">{t.title}</div>
                <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
