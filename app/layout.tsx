import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Strike — Editor de video & motion",
    description:
      "Edición de video con ritmo, narrativa y motion design para creadores que quieren hacer que cada segundo cuente.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "Strike — Cada segundo cuenta",
      description:
        "Shorts, videos largos y motion design para creadores de contenido.",
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Strike — Cada segundo cuenta",
      description:
        "Shorts, videos largos y motion design para creadores de contenido.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
