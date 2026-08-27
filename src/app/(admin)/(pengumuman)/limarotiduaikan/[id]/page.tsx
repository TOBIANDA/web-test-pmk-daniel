import PengumumanDetailAdmin from "@/features/admin/pages/pengumuman/section/pengumumanDetail";
import { pengumumanService } from "@/services/pengumumanService";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface LimarotiduaikanDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LimarotiduaikanDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const data = await pengumumanService.getPengumumanById(id);
        if (data?.title) {
            return {
                title: `Detail: ${data.title} (Admin)`,
                description: `Pratinjau administrasi pengumuman ${data.title}`,
            };
        }
    } catch {}
    return {
        title: "Detail Pengumuman Admin",
        description: "Pratinjau administrasi pengumuman PMK Daniel FILKOM UB",
    };
}

export default async function LimarotiduaikanDetailPage({ params }: LimarotiduaikanDetailPageProps) {
    const { id } = await params;
    return <PengumumanDetailAdmin id={id} />;
}
