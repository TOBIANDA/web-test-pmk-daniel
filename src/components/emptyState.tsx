import Image from "next/image";

export default function EmptyPage() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-[70vh] ">
            <div className="relative w-90 h-90 md:w-100 md:h-100 lg:w-109.5 lg:h-102.75">
                <Image draggable={false} src='/images/empty.webp' alt='Empty' fill className="select-none" />
            </div>
            <p className="mt-6 font-plusJakarta font-normal lg:text-2xl md:text-xl text-base text-center">
                Data belum tersedia/tidak ditemukan. Silahkan cek kembali.
            </p>
        </div>
    )
}