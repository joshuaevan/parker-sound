import type { Metadata, Viewport } from "next";
import { Boogaloo, Nunito } from "next/font/google";
import "./globals.css";

const boogaloo = Boogaloo({ subsets: ["latin"], weight: "400", variable: "--font-boogaloo" });
const nunito = Nunito({ subsets: ["latin"], weight: ["800"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Silly Board",
  description: "Tap a button, make noise, repeat.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Silly Board",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0d0d1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${boogaloo.variable} ${nunito.variable}`}>
      <body className="bg-[#0d0d1a] antialiased">{children}</body>
    </html>
  );
}
