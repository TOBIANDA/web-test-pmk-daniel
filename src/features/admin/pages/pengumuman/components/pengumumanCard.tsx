import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PengumumanCardProps {
    Icon: LucideIcon;
    iconColor?: string;
    description: string;
    amount: number;
    borderColor: string;
    bgIconColor: string;
}

export default function PengumumanCard({ Icon, iconColor, description, amount, borderColor, bgIconColor }: PengumumanCardProps) {
    return (
        <Card className={`${borderColor} border w-full`}>
            <CardContent className="flex items-center gap-5">
                <div className={`${bgIconColor} rounded-full p-2.5 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColor || "text-slate-700"}`} />
                </div>
                <div>
                    <h2 className="font-plusJakarta font-normal text-sm md:text-base">
                        {description}
                    </h2>
                    <p className="font-plusJakarta font-semibold text-lg md:text-2xl">
                        {amount}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}