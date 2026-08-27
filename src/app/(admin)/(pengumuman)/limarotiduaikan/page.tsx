import PengumumanManagementPage from "@/features/admin/pages/pengumuman/pengumumanManagementPage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Kelola Pengumuman",
    description: "Kelola dan publikasikan warta kegiatan, ibadah, dan pengumuman PMK Daniel FILKOM UB.",
};

export default function LimarotiduaikanPage() {
    return <PengumumanManagementPage />;
}
