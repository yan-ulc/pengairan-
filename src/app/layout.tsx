import "leaflet/dist/leaflet.css";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map Picker Example",
  description: "Next.js + Leaflet Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
