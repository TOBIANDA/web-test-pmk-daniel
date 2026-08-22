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
  title: "PMK Daniel",
  description: "PMK Daniel",
};

import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", plusJakarta.variable)}
    >
      <body className="selection:bg-primary selection:text-secondary">
        <SmoothScroll>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
