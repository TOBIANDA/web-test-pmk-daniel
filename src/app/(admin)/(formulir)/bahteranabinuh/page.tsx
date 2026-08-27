import FormManagementPage from "@/features/admin/pages/forms/formManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kelola Formulir & Tanggapan",
  description: "Form builder dinamis dan ekspor rekap tanggapan responden PMK Daniel FILKOM UB.",
};

export default function BahteranabinuhPage() {
  return <FormManagementPage />;
}
