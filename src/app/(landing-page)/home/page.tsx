import LandingPage from "@/features/landing/LandingPage";
import { pengumumanService } from "@/services/pengumumanService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
    const pengumumanData = await pengumumanService.getPengumumanList();
    
    return (
        <main>
            <LandingPage pengumumanData={pengumumanData} />
        </main>
    );
}