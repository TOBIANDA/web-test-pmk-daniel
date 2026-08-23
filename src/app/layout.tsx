import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plusJakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pmkdaniel.com"),
  title: {
    default: "PMK Daniel FILKOM UB",
    template: "%s | PMK Daniel FILKOM UB",
  },
  description: "Persekutuan Mahasiswa Kristen (PMK) Daniel Fakultas Ilmu Komputer Universitas Brawijaya. Menjangkau, membina, dan mengutus mahasiswa untuk menjadi saksi Kristus.",
  keywords: ["PMK Daniel", "FILKOM UB", "Kerohanian Kristen", "Universitas Brawijaya", "Mahasiswa Kristen UB", "PMK UB"],
  authors: [{ name: "PMK Daniel FILKOM UB" }],
  creator: "PMK Daniel FILKOM UB",
  publisher: "PMK Daniel FILKOM UB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "PMK Daniel FILKOM UB",
    description: "Persekutuan Mahasiswa Kristen (PMK) Daniel Fakultas Ilmu Komputer Universitas Brawijaya.",
    url: "https://pmkdaniel.com",
    siteName: "PMK Daniel FILKOM UB",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Logo PMK Daniel",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMK Daniel FILKOM UB",
    description: "Persekutuan Mahasiswa Kristen (PMK) Daniel Fakultas Ilmu Komputer Universitas Brawijaya.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { SmoothScroll } from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn("antialiased", plusJakarta.variable)}
    >
      <body className="selection:bg-primary selection:text-secondary">
        <SmoothScroll>
            <main className="flex-1 flex flex-col">
              <Navbar />
              {children}
              <Footer />
            </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
