import PengumumanDetailPage from "@/features/pengumuman/pengumumanDetail";
import { pengumumanService } from "@/services/pengumumanService";

interface PengumumanDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PengumumanDetail({ params }: PengumumanDetailPageProps) {
    const { id } = await params;
    const data = await pengumumanService.getPengumumanById(id);
    return <PengumumanDetailPage data={data} />
}