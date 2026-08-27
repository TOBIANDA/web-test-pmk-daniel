import PengumumanMainPage from "@/features/pengumuman/PengumumanMain";
import { pengumumanService } from "@/services/pengumumanService";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Pengumuman",
    description: "Simak warta ibadah, kegiatan fellowship, open recruitment, dan kabar terbaru dari PMK Daniel FILKOM Universitas Brawijaya.",
    openGraph: {
        title: "Pengumuman | PMK Daniel FILKOM UB",
        description: "Simak warta ibadah, kegiatan fellowship, open recruitment, dan kabar terbaru dari PMK Daniel FILKOM Universitas Brawijaya.",
        url: "https://pmkdaniel.site/pengumuman",
    },
};

export default async function PengumumanMain() {
    const data = await pengumumanService.getPengumumanList();
    return <PengumumanMainPage initialData={data} />;
}