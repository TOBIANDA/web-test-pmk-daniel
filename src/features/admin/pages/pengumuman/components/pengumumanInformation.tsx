import PengumumanCard from "./pengumumanCard";
import { Megaphone, CheckCircle2, Clock, Trash2 } from "lucide-react";

export default function PengumumanInformation() {
    return (
        <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-20">
            <PengumumanCard
                Icon={Megaphone}
                iconColor="text-amber-600"
                description="Total"
                amount={0}
                bgIconColor="bg-bg-iconyellow"
                borderColor="border-border-yellow"
            />
            <PengumumanCard
                Icon={CheckCircle2}
                iconColor="text-emerald-600"
                description="Aktif"
                amount={0}
                bgIconColor="bg-bg-icongreen"
                borderColor="border-border-green"
            />
            <PengumumanCard
                Icon={Clock}
                iconColor="text-blue-600"
                description="Terjadwal"
                amount={0}
                bgIconColor="bg-bg-iconblue"
                borderColor="border-border-blue"
            />
            <PengumumanCard
                Icon={Trash2}
                iconColor="text-rose-600"
                description="Dihapus"
                amount={0}
                bgIconColor="bg-bg-iconred"
                borderColor="border-border-red"
            />
        </div>
    )
}