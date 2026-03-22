import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import Providers from "@/components/Providers";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
