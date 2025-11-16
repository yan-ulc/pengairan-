// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  { label: "Beranda", href: "/", disabled: false },
  { label: "Profil", href: "#", disabled: true },
  { label: "PPID", href: "#", disabled: true },
  { label: "Informasi Publik", href: "#", disabled: true },
  { label: "Layanan Publik", href: "#", disabled: true },
  { label: "Pustaka Digital", href: "#", disabled: true },
  { label: "Open Data", href: "#", disabled: true },
  { label: "Produk Hukum", href: "#", disabled: true },
  { label: "Galeri", href: "#", disabled: true },
  { label: "Pengumuman", href: "#", disabled: true },
  { label: "Berita", href: "#", disabled: true },
  { label: "Inovasi", href: "#", disabled: true },
  { label: "Sosial Media", href: "#", disabled: true },
  { label: "Kontak Kami", href: "#", disabled: true },
  // Tambahan real feature:
  { label: "Lapor", href: "/lapor", disabled: false }, // hanya ini aktif selain Beranda
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-green-600 grid place-content-center text-white font-bold">
            DA
          </div>
          <div className="leading-tight">
            <div className="font-semibold">DINAS PENGAIRAN ACEH</div>
            <div className="text-xs text-slate-500">Official Website (clone)</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          {menus.map((m) => {
            const active = pathname === m.href;
            const base =
              "px-3 py-1.5 rounded-md text-sm transition";
            if (m.disabled)
              return (
                <span
                  key={m.label}
                  className={base + " text-slate-400 cursor-not-allowed opacity-60"}
                  title="Formalitas (non-aktif)"
                >
                  {m.label}
                </span>
              );
            return (
              <Link
                key={m.label}
                href={m.href}
                className={
                  base +
                  (active
                    ? " bg-green-600 text-white"
                    : " hover:bg-slate-100 text-slate-700")
                }
              >
                {m.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
