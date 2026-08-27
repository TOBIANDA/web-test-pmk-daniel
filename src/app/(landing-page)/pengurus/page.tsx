import PengurusPage from "@/features/pengurus/PengurusPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kepengurusan",
  description: "Struktur Organisasi & Badan Pengurus Harian PMK Daniel FILKOM Universitas Brawijaya.",
  openGraph: {
    title: "Kepengurusan | PMK Daniel FILKOM UB",
    description: "Struktur Organisasi & Badan Pengurus Harian PMK Daniel FILKOM Universitas Brawijaya.",
    url: "https://pmkdaniel.site/pengurus",
  },
};

export default function Page() {
  return <PengurusPage />;
}
