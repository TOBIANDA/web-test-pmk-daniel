import PengumumanMainPage from "@/features/pengumuman/PengumumanMain";
import { pengumumanService } from "@/services/pengumumanService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PengumumanMain() {
    const data = await pengumumanService.getPengumumanList();
    return <PengumumanMainPage initialData={data} />;
}