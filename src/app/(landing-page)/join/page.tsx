import JoinPageMain from "@/features/join/JoinPageMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form & Pendataan",
  description: "Formulir pendaftaran kegiatan, open recruitment panitia, dan pendataan anggota PMK Daniel FILKOM Universitas Brawijaya.",
  openGraph: {
    title: "Form & Pendataan | PMK Daniel FILKOM UB",
    description: "Formulir pendaftaran kegiatan, open recruitment panitia, dan pendataan anggota PMK Daniel FILKOM Universitas Brawijaya.",
    url: "https://pmkdaniel.site/join",
  },
};

export default function JoinPage() {
  return <JoinPageMain />;
}
