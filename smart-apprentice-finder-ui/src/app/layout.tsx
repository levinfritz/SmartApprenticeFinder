import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smart Apprentice Finder | KI-gestützte Lehrstellensuche",
  description: "Finde mit künstlicher Intelligenz die perfekte Lehrstelle in der Schweiz. Personalisierte Empfehlungen basierend auf deinen Interessen und Fähigkeiten.",
  keywords: ["Lehrstelle", "Schweiz", "KI", "Berufswahl", "Ausbildung"],
  authors: [{ name: "Smart Apprentice Finder Team" }],
  openGraph: {
    title: "Smart Apprentice Finder",
    description: "KI-gestützte Lehrstellensuche für die Schweiz",
    type: "website",
    locale: "de_CH",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-animated-gradient min-h-screen`}
        suppressHydrationWarning
      >
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
