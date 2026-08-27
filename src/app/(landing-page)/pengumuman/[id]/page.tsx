import PengumumanDetailPage from "@/features/pengumuman/PengumumanDetail";
import { pengumumanService } from "@/services/pengumumanService";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PengumumanDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PengumumanDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const data = await pengumumanService.getPengumumanById(id);

    if (!data) {
        return {
            title: "Pengumuman Tidak Ditemukan",
            description: "Pengumuman yang Anda cari tidak ditemukan atau telah dihapus.",
        };
    }

    const plainDesc = data.description || data.content || "Informasi dan warta kegiatan PMK Daniel FILKOM UB.";
    const truncatedDesc = plainDesc.length > 160 ? plainDesc.substring(0, 157) + "..." : plainDesc;

    return {
        title: data.title,
        description: truncatedDesc,
        openGraph: {
            title: `${data.title} | PMK Daniel FILKOM UB`,
            description: truncatedDesc,
            url: `https://pmkdaniel.site/pengumuman/${data.slug || data.id}`,
            images: data.imageUrl
                ? [
                      {
                          url: data.imageUrl,
                          alt: data.title,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: `${data.title} | PMK Daniel FILKOM UB`,
            description: truncatedDesc,
            images: data.imageUrl ? [data.imageUrl] : undefined,
        },
    };
}

export default async function PengumumanDetail({ params }: PengumumanDetailPageProps) {
    const { id } = await params;
    const data = await pengumumanService.getPengumumanById(id);
    return <PengumumanDetailPage data={data} />;
}