import TentangPageFeature from "@/features/tentang/TentangPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tentang",
    description: "Kenali lebih dekat visi, misi, dan perjalanan PMK Daniel FILKOM UB.",
};

export default function TentangPage() {
    return <TentangPageFeature />;
}