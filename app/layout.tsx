import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "./components/Cart/CartDrawer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { validateEnv } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Opcional pero recomendable: usar una variable de entorno
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.proyecto-cumbre.es";
validateEnv();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Proyecto Cumbre",
  description: "Aventuras de montaña, rutas y experiencias únicas.",
  openGraph: {
    title: "Proyecto Cumbre",
    description: "Vive la montaña con Proyecto Cumbre.",
    url: "https://www.proyecto-cumbre.es",
    siteName: "Proyecto Cumbre",
    images: [
      {
        url: "/quienes-bg.jpg", // se resolverá como absoluta usando metadataBase
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CartDrawer />
        <SpeedInsights />
      </body>
    </html>
  );
}
