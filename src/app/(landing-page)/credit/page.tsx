import CreditPageMain from "@/features/credit/CreditPageMain";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tim Developer",
    description: "Para pengembang dan perancang di balik website resmi PMK Daniel FILKOM Universitas Brawijaya.",
    openGraph: {
        title: "Tim Developer | PMK Daniel FILKOM UB",
        description: "Para pengembang dan perancang di balik website resmi PMK Daniel FILKOM Universitas Brawijaya.",
        url: "https://pmkdaniel.site/credit",
    },
};

export default function CreditPage() {
    return <CreditPageMain />;
}
