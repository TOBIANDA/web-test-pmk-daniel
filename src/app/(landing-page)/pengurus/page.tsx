import PengurusPage from "@/features/pengurus/PengurusPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kepengurusan",
  description: "Struktur Organisasi & Badan Pengurus Harian PMK Daniel FILKOM Universitas Brawijaya.",
};

export default function Page() {
  return <PengurusPage />;
}
