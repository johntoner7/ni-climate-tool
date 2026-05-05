import type { Metadata } from "next";
import Link from "next/link";
import { geistSans, geistMono } from "@/lib/fonts";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const TITLE = "Climate Gap NI";
const DESCRIPTION =
  "Northern Ireland has cut greenhouse gas emissions by 31.5% since 1990. But agricultural emissions are not decreasing at the same rate. An interactive scrollytelling piece.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://climategapni.com"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <nav className="sticky top-0 z-20 bg-[#FFF9F5] border-b border-[#e8e0d8] px-8 lg:px-16 py-3 flex items-center justify-between">
            <Link href="/" className="text-xs tracking-widest uppercase text-[#666666] hover:text-[#1a1a1a] transition-colors">
              Climate Gap NI
            </Link>
            <a href="https://rivers.climategapni.com" className="text-xs text-[#666666] hover:text-[#1a1a1a] transition-colors">
              Rivers Map →
            </a>
          </nav>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
