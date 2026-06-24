import { cn } from "@/lib/utils";
import Image from "next/image";

const dataKetua = [
    {
        nama: "Bastian Nevan Baruch",
        jabatan: "Ketua Umum PMK Daniel 2026",
        imgUrl: "/images/bastian.webp"
    },
    {
        nama: "Christo Alfredo Sitorus",
        jabatan: "Wakil Ketua Umum PMK Daniel 2026",
        imgUrl: "/images/christo.webp"
    }
]

export default function Sambutan() {
    return (
        <section className="w-full py-16 sm:py-24 md:py-32 lg:py-38 px-4 sm:px-8 md:px-12 lg:px-16">
            <h1 className="font-plusJakarta font-bold text-primary text-2xl sm:text-3xl md:text-4xl xl:text-[64px]">
                Kata Sambutan
            </h1>
            <h2 className="font-plusJakarta font-normal text-base sm:text-lg xl:text-2xl mt-2">
                Ketua dan Wakil Ketua Umum PMK Daniel 2026
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4 sm:gap-6 lg:gap-8 relative mt-8 sm:mt-12 lg:mt-14 xl:h-110 2xl:h-130 overflow-hidden">
                {dataKetua.map((data) => (
                    <div key={data.nama} className="w-full h-80 sm:h-96 lg:h-110 relative overflow-hidden rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]">
                        <Image src={data.imgUrl} alt={data.nama} fill className="object-cover absolute" />
                        <h3 className={cn(
                            "absolute bottom-14 sm:bottom-16 lg:bottom-20 left-4 sm:left-6 lg:left-10 z-10",
                            "font-plusJakarta font-bold text-white text-lg sm:text-xl lg:text-2xl xl:text-[40px]"
                        )}>
                            {data.nama}
                        </h3>
                        <p className="absolute z-10 bottom-6 sm:bottom-8 lg:bottom-10 left-4 sm:left-6 lg:left-10 font-plusJakarta font-normal text-white text-sm sm:text-base lg:text-xl xl:text-2xl">
                            {data.jabatan}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    );
}