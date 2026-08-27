import PengurusManagementPage from "@/features/admin/pages/pengurus/pengurusManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Kepengurusan",
  description: "Kelola data divisi, komisi, dan struktur anggota kepengurusan PMK Daniel FILKOM UB.",
};

export default function RumahtanggaAllahPage() {
  return <PengurusManagementPage />;
}
