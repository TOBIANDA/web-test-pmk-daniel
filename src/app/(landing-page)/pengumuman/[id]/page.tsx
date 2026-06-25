import PengumumanDetailPage from "@/features/pengumuman/pengumumanDetail";

interface PengumumanDetailPageProps {
    params: Promise<{ id: string }>;
}


export default async function PengumumanDetail({ params }: PengumumanDetailPageProps) {
    const { id } = await params;
    return <PengumumanDetailPage id={id} />
}