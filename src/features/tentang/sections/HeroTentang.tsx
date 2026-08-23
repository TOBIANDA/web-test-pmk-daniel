"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

export default function HeroTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!contentRef.current) return;

        gsap.fromTo(
            contentRef.current.children,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                delay: 0.1
            }
        );
    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="relative w-full h-dvh min-h-dvh bg-white flex items-center justify-center overflow-hidden pt-20 border-b border-gray-100"
        >
            {/* Soft Ambient Blur Orbs */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-[85%] lg:w-[80%] max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left Column: Hero Text */}
                <div ref={contentRef} className="lg:col-span-7 flex flex-col items-start text-left">
                    
                    {/* Badge Pill - Matching Landing Page */}
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6">
                        Tentang Kami
                    </span>

                    {/* Headline - Matching Landing Page Typography */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-6 font-plusJakarta leading-tight">
                        Memimpin dengan Hikmat, <br />
                        <span className="text-secondary">Melayani dengan Kasih</span>
                    </h1>

                    {/* Description with Left Border Accent */}
                    <div className="relative pl-6 sm:pl-8 mb-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b from-secondary to-primary rounded-full" />
                        <p className="text-sm sm:text-base font-medium leading-relaxed text-gray-700">
                            Persekutuan Mahasiswa Kristen Daniel Fakultas Ilmu Komputer Universitas Brawijaya (PMK Daniel FILKOM UB) hadir sejak tahun 2013 sebagai rumah bertumbuh secara rohani, akademis, dan karakter.
                        </p>
                    </div>

                </div>

                {/* Right Column: Hero Visual - Matching Landing Page Card & Radius */}
                <div className="lg:col-span-5 relative w-full">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl md:rounded-3xl transform -rotate-3 z-0" />
                    
                    <div className="relative z-10 w-full overflow-hidden shadow-[0_20px_50px_rgba(62,64,149,0.15)] rounded-2xl md:rounded-3xl border border-white/50 bg-white">
                        <div className="relative w-full aspect-[4/3]">
                            <Image 
                                draggable={false}
                                src="/About-us pic.png" 
                                alt="PMK Daniel Photo" 
                                fill
                                className="select-none object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
