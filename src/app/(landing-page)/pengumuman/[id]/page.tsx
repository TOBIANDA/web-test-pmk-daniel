import PengumumanDetailPage from "@/features/pengumuman/PengumumanDetail";
import { pengumumanService } from "@/services/pengumumanService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PengumumanDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PengumumanDetail({ params }: PengumumanDetailPageProps) {
    const { id } = await params;
    const data = await pengumumanService.getPengumumanById(id);
    return <PengumumanDetailPage data={data} />;
}