"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const dataKetua = [
    {
        nama: "Bastian Nevan Baruch",
        jabatan: "Ketua Umum PMK Daniel 2026",
        imgUrl: "/images/bastian.webp",
        quote: "Shalom teman-teman semua, selamat datang di keluarga besar PMK Daniel FILKOM UB. Kita sangat bersyukur atas penyertaan Tuhan sehingga kita bisa berkumpul dan melayani bersama di kampus ini. PMK Daniel bukan sekadar komunitas biasa, tapi rumah rohani tempat kita bisa bertumbuh, berbagi beban, dan saling menguatkan. Mari melangkah bersama membawa terang kasih Kristus. Tuhan Yesus memberkati."
    },
    {
        nama: "Christo Alfredo Sitorus",
        jabatan: "Wakil Ketua Umum PMK Daniel 2026",
        imgUrl: "/images/christo.webp",
        quote: "Shalom dan selamat bergabung bersama kita di PMK Daniel FILKOM UB. Masa perkuliahan pasti punya banyak tantangan, makanya kita hadir sebagai keluarga yang siap mendukung satu sama lain. Semoga teman-teman merasa nyaman di sini dan rindu untuk ikut ambil bagian dalam berbagai pelayanan. Tetap semangat kuliahnya dan biarlah hidup kita terus menjadi berkat buat sesama mahasiswa."
    }
]

export default function Sambutan() {
    const sectionRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
            }
        });

        tl.fromTo(badgeRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
        .fromTo(titleRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        )
        .fromTo(descRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        )
        .fromTo(cardsRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
            "-=0.2"
        );
    }, { scope: sectionRef });

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className={cn("w-[85%] lg:w-[80%] mx-auto py-16 md:py-24")}>
            
            <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
                {/* Consistent Badge */}
                <span 
                    ref={badgeRef}
                    className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6"
                >
                    Pimpinan Kami
                </span>
                
                {/* Consistent Typography Title */}
                <h2 
                    ref={titleRef}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-6 font-plusJakarta leading-tight"
                >
                    Kata Sambutan
                </h2>
                
                <p 
                    ref={descRef}
                    className="text-sm sm:text-base font-medium text-gray-600 max-w-2xl"
                >
                    Mengenal lebih dekat visi dan misi pelayanan dari Ketua dan Wakil Ketua Umum PMK Daniel 2026.
                </p>
            </div>

            {/* Grid 1 col for Mobile & Tablet (iPad), 2 cols for Desktop (lg/xl) */}
            <div className={cn(
                "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto"
            )}>
                {dataKetua.map((data, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <div 
                            key={data.nama} 
                            ref={addToRefs}
                            onClick={() => setActiveIndex(isActive ? null : index)}
                            className={cn(
                                "group relative w-full overflow-hidden bg-gray-900 flex flex-col justify-end cursor-pointer",
                                "min-h-[350px] lg:min-h-[400px] xl:min-h-[420px]",
                                "rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]", // Consistent corner radius
                                "hover:shadow-[0_20px_50px_rgba(62,64,149,0.15)] transition-shadow duration-500",
                                isActive && "shadow-[0_20px_50px_rgba(62,64,149,0.15)]"
                            )}
                        >
                            {/* Background Image */}
                            <Image 
                                draggable={false} 
                                src={data.imgUrl} 
                                alt={data.nama} 
                                fill 
                                className={cn(
                                    "select-none object-cover object-[50%_25%] absolute transition-transform duration-1000 ease-in-out opacity-90",
                                    isActive ? "scale-[1.03] opacity-100" : "group-hover:scale-[1.03] group-hover:opacity-100"
                                )} 
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            
                            {/* 
                                Dynamic Gradient Overlay:
                                Darker gradient reveals when clicked or hovered to ensure the paragraph is readable.
                            */}
                            <div className={cn(
                                "absolute inset-0 transition-opacity duration-500",
                                isActive 
                                    ? "bg-gradient-to-t from-black via-black/80 to-transparent opacity-95"
                                    : "bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-95 lg:group-hover:bg-gradient-to-t lg:group-hover:from-black lg:group-hover:via-black/80 lg:group-hover:to-transparent"
                            )}></div>

                            {/* Content Container */}
                            <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end text-left">
                                
                                {/* Revealable Quote Area */}
                                <div className={cn(
                                    "flex flex-col transition-all duration-700 ease-in-out transform",
                                    isActive 
                                        ? "translate-y-0 opacity-100" 
                                        : "translate-y-8 opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                                )}>
                                    <div className="text-secondary/80 text-4xl sm:text-5xl font-serif leading-none mb-3">
                                        &ldquo;
                                    </div>
                                    <p className="font-plusJakarta font-medium text-white/95 text-xs sm:text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 text-justify">
                                        {data.quote}
                                    </p>
                                </div>

                                {/* Author Info */}
                                <div className={cn(
                                    "flex flex-col border-l-4 border-secondary pl-4 transition-transform duration-700 ease-in-out",
                                    isActive ? "-translate-y-2" : "translate-y-0 lg:group-hover:-translate-y-2"
                                )}>
                                    <h3 className={cn(
                                        "font-plusJakarta font-bold text-white mb-1",
                                        "text-xl sm:text-2xl lg:text-3xl"
                                    )}>
                                        {data.nama}
                                    </h3>
                                    <p className={cn(
                                        "font-plusJakarta font-medium text-secondary",
                                        "text-sm sm:text-base"
                                    )}>
                                        {data.jabatan}
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    );
                })}
            </div>

        </section>
    );
}