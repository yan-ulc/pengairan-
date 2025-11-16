import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const laporan = pgTable("laporan", {
  id: serial("id").primaryKey(),
  nama: text("nama").notNull(),
  alamatPelapor: text("alamat_pelapor").notNull(),
  alamatKerusakan: text("alamat_kerusakan").notNull(),
  deskripsi: text("deskripsi").notNull(),
  foto: text("foto"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
