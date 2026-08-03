import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://strike-editor-portfolio.strike2911.chatgpt.site";
const socialImage = `${siteUrl.replace(/\/$/, "")}/og.png?v=20260803-trust`;

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
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Strike — video editor de shorts, videos largos y motion",
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
