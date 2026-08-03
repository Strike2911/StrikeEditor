import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://strike-editor-portfolio.strike2911.chatgpt.site";
const socialGif = `${siteUrl.replace(/\/$/, "")}/og.gif?v=20260803-motion2`;
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png?v=20260803-motion2`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Strike — Editor de video & motion",
  description:
    "Edición de video con ritmo, narrativa y motion design para creadores que quieren hacer que cada segundo cuente.",
  icons: {
    icon: `${basePath}/favicon.png`,
    shortcut: `${basePath}/favicon.png`,
  },
  openGraph: {
    title: "Strike — Video editor",
    description:
      "Shorts, videos largos y motion para creadores de contenido.",
    images: [
      {
        url: socialGif,
        width: 960,
        height: 504,
        type: "image/gif",
        alt: "Strike — reel animado de video editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strike — Video editor",
    description:
      "Shorts, videos largos y motion para creadores de contenido.",
    images: [socialImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
