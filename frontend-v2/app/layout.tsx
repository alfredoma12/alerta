import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlertaCiudadana — Denuncias colectivas de Chile",
  description:
    "Plataforma ciudadana para reportar robos, estafas, fraudes digitales y vehículos robados. Anónima, verificada y gratuita.",
  keywords: ["denuncia", "robo", "estafa", "fraude", "Chile", "alerta ciudadana"],
  openGraph: {
    title: "AlertaCiudadana",
    description: "Denuncia colectiva ciudadana de Chile",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-background text-foreground font-body antialiased">{children}</body>
    </html>
  );
}
