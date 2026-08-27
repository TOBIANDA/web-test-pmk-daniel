import LandingPage from "@/features/landing/LandingPage";
import { pengumumanService } from "@/services/pengumumanService";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Beranda",
    description: "Persekutuan Mahasiswa Kristen (PMK) Daniel Fakultas Ilmu Komputer Universitas Brawijaya. Menjangkau, membina, dan mengutus mahasiswa untuk menjadi saksi Kristus.",
    openGraph: {
        title: "Beranda | PMK Daniel FILKOM UB",
        description: "Persekutuan Mahasiswa Kristen (PMK) Daniel Fakultas Ilmu Komputer Universitas Brawijaya.",
        url: "https://pmkdaniel.site/home",
    },
};

export default async function HomePage() {
    const pengumumanData = await pengumumanService.getPengumumanList();
    
    return (
        <main>
            <LandingPage pengumumanData={pengumumanData} />
        </main>
    );
}