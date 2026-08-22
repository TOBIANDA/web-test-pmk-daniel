import LandingPage from "@/features/landing/page";
import { pengumumanService } from "@/services/pengumumanService";

export default async function HomePage() {
    const pengumumanData = await pengumumanService.getPengumumanList();
    
    return (
        <main>
            <LandingPage pengumumanData={pengumumanData} />
        </main>
    )
}