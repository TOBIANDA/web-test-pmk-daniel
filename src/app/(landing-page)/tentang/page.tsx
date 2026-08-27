import TentangPageFeature from "@/features/tentang/TentangPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali lebih dekat visi, misi, sejarah, dan nilai-nilai persekutuan PMK Daniel Fakultas Ilmu Komputer Universitas Brawijaya.",
  openGraph: {
    title: "Tentang Kami | PMK Daniel FILKOM UB",
    description: "Kenali lebih dekat visi, misi, sejarah, dan nilai-nilai persekutuan PMK Daniel Fakultas Ilmu Komputer Universitas Brawijaya.",
    url: "https://pmkdaniel.site/tentang",
  },
};

export default function TentangPage() {
  return <TentangPageFeature />;
}
