import EmptyPage from "@/components/emptyState";
import { dataPengumuman } from "@/dataDummy/pengumuman";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PengumumanDetailPageProps {
    id: string;
}


export default function PengumumanDetailPage({ id }: PengumumanDetailPageProps) {
    const blog = dataPengumuman.find((item) => item.id === id);

    if (!blog) return <EmptyPage />

    return (
        <section className="py-38 px-4 sm:px-8 md:px-12 lg:px-16 w-full min-h-dvh">
            <Link href="/pengumuman">
                <div className="flex items-center gap-2 cursor-pointer">
                    <ArrowLeft size={24} />
                    <h2 className="font-plusJakarta font-medium text-base sm:text-lg xl:text-2xl hover:underline">
                        Back
                    </h2>
                </div>
            </Link>
            <article>
                <h1 className="font-plusJakarta mt-2 font-extrabold text-2xl sm:text-3xl md:text-4xl xl:text-[64px]">
                    {blog.title}
                </h1>
                <h3 className="font-plusJakarta font-medium text-base sm:text-xl lg:text-2xl">
                    PENGUMUMAN
                </h3>
                <h4 className="mt-6 font-plusJakarta font-medium ">
                    Diunggah {blog.datePublished}
                </h4>

                <div className="w-full h-[40vh] sm:h-[55vh] md:h-[65vh] lg:h-[80vh] rounded-xl relative mt-8 md:mt-12 lg:mt-16 overflow-hidden">
                    <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        sizes="100vw"
                        fill
                        unoptimized
                        className="object-cover"
                        priority={true} 
                    />
                </div>

                <p className="mt-8 md:mt-12 lg:mt-16 xl:mt-16 font-plusJakarta font-normal leading-7 text-base md:text-lg xl:text-xl">
                    {blog.description}
                </p>
            </article>


        </section>
    )
}