import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegorynOS",
  description: "Guard your records. Command your life."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
