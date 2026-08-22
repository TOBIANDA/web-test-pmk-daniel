import Image from "next/image";


const dataKegiatan = [
    {
        desc: "Persekutuan Doa",
        number: "01",
        imageUrl: "/images/persekutuan.webp"
    },
    {
        desc: "Doa Pengurus",
        number: "02",
        imageUrl: "/images/doapengurus.webp"
    },
    {
        desc: "Camp Daniel",
        number: "03",
        imageUrl: "/images/campdaniel.webp"
    },
    {
        desc: "Camp Regenerasi",
        number: "04",
        imageUrl: "/images/campregenerasi.webp"
    },
    {
        desc: "Paskah PMK Daniel",
        number: "05",
        imageUrl: "/images/paskahpmk.webp"
    },
    {
        desc: "Natal PMK Daniel",
        number: "06",
        imageUrl: "/images/natalpmk.webp"
    },
]

export default function Kegiatan() {
    return (
        <section className="w-[85%] lg:w-[80%] mx-auto mt-16 lg:mt-32">
            <h1 className="font-plusJakarta font-bold text-primary text-2xl sm:text-3xl md:text-4xl xl:text-[64px]">
                Kegiatan Kami
            </h1>
            <h2 className="font-plusJakarta font-normal text-base sm:text-lg xl:text-2xl mt-2">
                Simak kegiatan dan kebersamaan PMK Daniel!
            </h2>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 xl:gap-8 overflow-hidden mt-16">
                {dataKegiatan.map((data) => (
                    <div key={data.number} className="overflow-hidden w-full flex flex-col ">
                        <div className="relative w-full h-64 sm:h-80 lg:h-98 2xl:h-130 overflow-hidden rounded-[12px] md:rounded-[16px] lg:rounded-[24px] xl:rounded-[32px]">
                            <Image
                                draggable={false}
                                src={data.imageUrl}
                                alt={data.desc}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="select-none object-cover"
                            />
                        </div>

                        <div className="p-7.5 flex items-center gap-8">
                            <p className="font-plusJakarta font-bold lg:text-[15px] ">
                                {data.number}
                            </p>
                            <h3 className="font-plusJakarta font-bold text-2xl lg:text-3xl xl:text-[36px]">
                                {data.desc}
                            </h3>
                        </div>

                        <div className="w-full bg-black h-px" />
                    </div>
                ))}
            </div>

        </section>
    );
}