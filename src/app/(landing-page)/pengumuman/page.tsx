import PengumumanMainPage from "@/features/pengumuman/PengumumanMain";
import { pengumumanService } from "@/services/pengumumanService";

export default async function PengumumanMain() {
    const data = await pengumumanService.getPengumumanList();
    return <PengumumanMainPage data={data} />;
}