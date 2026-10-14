import "../globals.css";
import type { Metadata } from "next";
import { BRAND } from "@/lib/copy";

export const metadata: Metadata = {
  title: BRAND,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }], apple: "/apple-touch-icon.png" }
};

export default function RootGateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
