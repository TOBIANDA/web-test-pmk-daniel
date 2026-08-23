"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { BookOpen, Cpu, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const logoBreakdown = [
    {
        title: "Salib & Mahkota",
        category: "Spiritual Integrity",
        desc: "Kristus sebagai fondasi utama pelayanan serta keteguhan iman dan hikmat tokoh Daniel.",
        icon: ShieldCheck,
        accent: "text-primary bg-primary/10"
    },
    {
        title: "Sirkuit & Pixel",
        category: "Technology & Computing",
        desc: "Menggambarkan identitas akademik mahasiswa Fakultas Ilmu Komputer (FILKOM UB).",
        icon: Cpu,
        accent: "text-secondary bg-secondary/10"
    },
    {
        title: "Alkitab Terbuka",
        category: "Wisdom & Truth",
        desc: "Penyatuan antara kebenaran Alkitabiah sebagai panduan hidup dan keunggulan pengetahuan.",
        icon: BookOpen,
        accent: "text-primary bg-primary/10"
    }
];

export default function FilosofiLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftCardRef = useRef<HTMLDivElement>(null);
    const rightListRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.fromTo(leftCardRef.current,
            { scale: 0.96, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );

        if (rightListRef.current) {
            gsap.fromTo(rightListRef.current.children,
                { y: 35, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: rightListRef.current,
                        start: "top 80%",
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-[85%] lg:w-[80%] py-24 md:py-32 mx-auto relative overflow-hidden">
            <div className="flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6">
                        Identitas Visual
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        Filosofi Logo & Makna Warna
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                        Simbol teologis dan identitas akademik yang terpatri dalam setiap sudut lambang PMK Daniel.
                    </p>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
                    
                    {/* Left Column: Interactive Logo Showcase Card */}
                    <div 
                        ref={leftCardRef}
                        className="lg:col-span-5 bg-gradient-to-br from-primary/5 via-white to-secondary/5 border border-primary/20 p-8 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(62,64,149,0.12)] flex flex-col justify-between relative overflow-hidden text-center"
                    >
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative w-36 h-36 mb-6 p-4 bg-white rounded-full shadow-lg ring-4 ring-primary/10 flex items-center justify-center">
                                <Image 
                                    src="/logo.png" 
                                    alt="Logo PMK Daniel" 
                                    fill 
                                    className="object-contain p-2" 
                                />
                            </div>

                            <h3 className="text-2xl font-extrabold text-primary font-plusJakarta mb-1">
                                PMK Daniel FILKOM
                            </h3>
                            <span className="text-xs font-bold text-gray-500 mb-8">
                                Universitas Brawijaya
                            </span>
                        </div>

                        {/* Color Palette Cards */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                            
                            <div className="p-4 rounded-2xl bg-white border border-primary/20 shadow-sm text-left">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm" />
                                    <span className="text-xs font-extrabold text-primary">Biru PMK</span>
                                </div>
                                <p className="text-xs font-medium text-gray-600 leading-snug">
                                    Integritas, hikmat, & kedalaman iman.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-secondary/20 shadow-sm text-left">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-3.5 h-3.5 rounded-full bg-secondary shadow-sm" />
                                    <span className="text-xs font-extrabold text-secondary">Oranye PMK</span>
                                </div>
                                <p className="text-xs font-medium text-gray-600 leading-snug">
                                    Kehangatan persekutuan & semangat.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Symbol Cards List */}
                    <div ref={rightListRef} className="lg:col-span-7 flex flex-col justify-between gap-4">
                        {logoBreakdown.map((elem, idx) => (
                            <div 
                                key={idx}
                                className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-[0_15px_40px_rgba(62,64,149,0.06)] hover:shadow-lg transition-all duration-300 flex items-start gap-5 group"
                            >
                                <div className={`p-3.5 rounded-2xl shrink-0 font-bold ${elem.accent}`}>
                                    <elem.icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-lg font-extrabold text-primary font-plusJakarta group-hover:text-secondary transition-colors">
                                            {elem.title}
                                        </h4>
                                        <span className="text-xs font-extrabold text-gray-400">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-secondary block mb-2">
                                        {elem.category}
                                    </span>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                        {elem.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}
