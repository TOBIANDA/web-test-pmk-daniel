import { Pengumuman } from "@/types/pengumuman";
import { truncateByWords } from "@/utils/truncate";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PengumumanMainPageProps {
    data: Pengumuman[];
}

export default function PengumumanMainPage({ data }: PengumumanMainPageProps) {
    return (
        <section className="py-38 w-[85%] lg:w-[80%] mx-auto">
            <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                    <ArrowLeft size={24} />
                    <h2 className="font-plusJakarta font-medium text-base sm:text-lg xl:text-2xl hover:underline">
                        Back
                    </h2>
                </div>
            </Link>
            <h1 className="font-plusJakarta mt-2 font-extrabold text-2xl sm:text-3xl md:text-4xl xl:text-[64px]">
                PENGUMUMAN
            </h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-14 ">
                {data.map((item) => (
                    <div key={item.id} className="flex flex-col items-center border border-black/10 p-6 rounded-[12px] md:rounded-[24px] lg:rounded-[30px] xl:rounded-[32px] w-full">
                        <div className="w-full">
                            <div className="rounded-[16px] lg:rounded-[20px] overflow-hidden aspect-[3/4] w-full relative">
                                <Image
                                    draggable={false}
                                    src={item.imageUrl}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                                    alt={item.title}
                                    fill
                                    className="select-none object-cover" />
                            </div>
                            <Link href={`/pengumuman/${item.id}`}>
                                <h3 className="font-plusJakarta hover:underline font-extrabold md:text-xl lg:text-2xl xl:text-[32px] mt-6">
                                    {item.title}
                                </h3>
                            </Link>
                            <p className="mt-3 font-plusJakarta font-normal text-xs lg:text-base">
                                {item.datePublished}
                            </p>
                            <p className="mt-4 font-plusJakarta font-normal text-[14px] md:text-base">
                                {truncateByWords({ text: item.description, wordLimit: 20 })}
                            </p>
                            <div className="text-right mt-4 ">
                                <Link href='/pengumuman' className="font-plusJakarta hover:underline font-normal text-[14px] md:text-base lg:text-[16px]">
                                    See more &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}