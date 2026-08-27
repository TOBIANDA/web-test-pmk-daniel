"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
    CircleDot,
    Layers,
    BookOpen,
    Plus,
    Network,
    Sparkles,
    Flame,
    Shield,
    BookMarked
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const symbolBreakdown = [
    {
        title: "Bentuk Lingkaran",
        category: "Keseimbangan & Integrasi",
        desc: "Melambangkan keseimbangan dan integrasi antara iman dan ilmu.",
        icon: CircleDot,
        accent: "text-primary bg-primary/10 border-primary/20",
    },
    {
        title: "Bentuk Pecahan Lingkaran",
        category: "Identitas FILKOM",
        desc: "Menggambarkan pixel yang melambangkan identitas Fakultas Ilmu Komputer (FILKOM).",
        icon: Layers,
        accent: "text-secondary bg-secondary/10 border-secondary/20",
    },
    {
        title: "Tumpukan Buku di Bawah Alkitab Terbuka",
        category: "Profesionalisme & Firman",
        desc: "Melambangkan mahasiswa PMK Daniel yang profesional dan hidup berdasarkan Firman Tuhan.",
        icon: BookOpen,
        accent: "text-primary bg-primary/10 border-primary/20",
    },
    {
        title: "Salib",
        category: "Hubungan Pribadi",
        desc: "Melambangkan hubungan pribadi dengan Tuhan.",
        icon: Plus,
        accent: "text-secondary bg-secondary/10 border-secondary/20",
    },
    {
        title: "Jaringan yang Mengarah Keluar",
        category: "Dampak & Pengaruh",
        desc: "Melambangkan bahwa PMK Daniel memberikan dampak positif bagi lingkungan sekitarnya.",
        icon: Network,
        accent: "text-primary bg-primary/10 border-primary/20",
    },
];

export default function FilosofiLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftCardRef = useRef<HTMLDivElement>(null);
    const rightListRef = useRef<HTMLDivElement>(null);
    const bottomCardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.fromTo(
            leftCardRef.current,
            { scale: 0.96, opacity: 0, y: 20 },
            {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
            }
        );

        if (rightListRef.current) {
            gsap.fromTo(
                rightListRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: rightListRef.current,
                        start: "top 80%",
                    },
                }
            );
        }

        if (bottomCardRef.current) {
            gsap.fromTo(
                bottomCardRef.current,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bottomCardRef.current,
                        start: "top 85%",
                    },
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-28 mx-auto relative overflow-hidden">
            <div className="flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-14 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 border border-secondary/20">
                        <Sparkles size={14} />
                        Identitas Visual
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        Filosofi Lambang & Makna Warna
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                        Setiap elemen visual dalam lambang PMK Daniel mengandung makna teologis, komitmen pelayanan, dan identitas akademik.
                    </p>
                </div>

                {/* Main Grid: Left Logo & Color Summary, Right 5 Symbol Elements */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch mb-8">
                    
                    {/* Left Column: Logo Showcase & Meaning of Colors */}
                    <div 
                        ref={leftCardRef}
                        className="lg:col-span-5 bg-gradient-to-br from-primary/5 via-white to-secondary/5 border border-primary/20 p-6 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(62,64,149,0.08)] flex flex-col justify-between relative overflow-hidden"
                    >
                        {/* Logo Header */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="relative w-40 h-40 mb-5 p-3.5 bg-white rounded-full shadow-lg ring-4 ring-primary/10 flex items-center justify-center">
                                <Image 
                                    src="/logo.png" 
                                    alt="Logo PMK Daniel" 
                                    fill 
                                    unoptimized
                                    priority
                                    className="object-contain p-2" 
                                />
                            </div>

                            <h3 className="text-2xl font-extrabold text-primary font-plusJakarta mb-1">
                                PMK Daniel FILKOM
                            </h3>
                            <span className="text-xs font-bold text-gray-500 mb-6 tracking-wide">
                                Universitas Brawijaya
                            </span>

                            {/* FILKOM Environment Banner */}
                            <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-secondary/10 via-primary/10 to-primary/15 border border-primary/20 text-left mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex -space-x-1">
                                        <span className="w-3 h-3 rounded-full bg-secondary inline-block ring-2 ring-white" />
                                        <span className="w-3 h-3 rounded-full bg-primary inline-block ring-2 ring-white" />
                                    </div>
                                    <span className="text-xs font-extrabold text-primary">Warna Jingga & Biru</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                    Melambangkan PMK Daniel berada di lingkungan Fakultas Ilmu Komputer Universitas Brawijaya.
                                </p>
                            </div>
                        </div>

                        {/* Color Cards Breakdown */}
                        <div className="relative z-10 space-y-4 pt-2">
                            
                            {/* Jingga Card */}
                            <div className="p-4 rounded-2xl bg-white border border-secondary/25 shadow-sm hover:shadow-md transition-shadow text-left">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-full bg-secondary shadow-sm" />
                                        <span className="text-xs font-extrabold text-secondary tracking-wide uppercase">Warna Jingga</span>
                                    </div>
                                    <Flame size={15} className="text-secondary" />
                                </div>
                                <p className="text-xs font-medium text-gray-600 leading-relaxed mb-2.5">
                                    Mencerminkan sukacita dan semangat dalam melayani Kristus, mengingatkan kita untuk selalu bersukacita dalam Tuhan dan hidup dalam terang-Nya.
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                                        <BookMarked size={10} /> Filipi 4:4
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                                        <BookMarked size={10} /> Efesus 5:8
                                    </span>
                                </div>
                            </div>

                            {/* Biru Card */}
                            <div className="p-4 rounded-2xl bg-white border border-primary/25 shadow-sm hover:shadow-md transition-shadow text-left">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm" />
                                        <span className="text-xs font-extrabold text-primary tracking-wide uppercase">Warna Biru</span>
                                    </div>
                                    <Shield size={15} className="text-primary" />
                                </div>
                                <p className="text-xs font-medium text-gray-600 leading-relaxed mb-2.5">
                                    Melambangkan kesetiaan dan kebenaran, mencerminkan janji Allah yang setia dan panggilan kita untuk hidup dalam damai sejahtera-Nya.
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        <BookMarked size={10} /> Mazmur 89:2
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        <BookMarked size={10} /> Kolose 3:15
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: 5 Symbol Cards List */}
                    <div ref={rightListRef} className="lg:col-span-7 flex flex-col justify-between gap-3.5">
                        {symbolBreakdown.map((elem, idx) => (
                            <div 
                                key={idx}
                                className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 hover:border-primary/30 p-5 sm:p-6 shadow-[0_10px_30px_rgba(62,64,149,0.05)] hover:shadow-lg transition-all duration-300 flex items-start gap-4 sm:gap-5 group"
                            >
                                <div className={`p-3 sm:p-3.5 rounded-2xl shrink-0 font-bold border ${elem.accent} group-hover:scale-105 transition-transform duration-300`}>
                                    <elem.icon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-base sm:text-lg font-extrabold text-primary font-plusJakarta group-hover:text-secondary transition-colors">
                                            {elem.title}
                                        </h4>
                                        <span className="text-xs font-extrabold text-gray-300 group-hover:text-primary transition-colors">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <span className="text-xs font-bold text-secondary block mb-1.5">
                                        {elem.category}
                                    </span>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                                        {elem.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom Card: Kesatuan & Harmoni Kedua Warna */}
                <div 
                    ref={bottomCardRef}
                    className="w-full bg-gradient-to-r from-primary via-primary/95 to-[#2d2e70] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/10"
                >
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-3xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-secondary font-bold text-xs uppercase tracking-wider mb-2.5">
                                <Sparkles size={13} />
                                Harmoni Warna & Semangat
                            </div>
                            <h4 className="text-lg sm:text-xl font-extrabold font-plusJakarta text-white mb-2">
                                Kesatuan Semangat Mahasiswa Kristen
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                                Kedua warna ini bersama-sama mengungkapkan semangat mahasiswa Kristen yang dipenuhi oleh kasih, kebenaran, dan damai Tuhan dalam persekutuan di PMK Daniel.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                            <span className="w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-white/50" />
                            <span className="text-xs font-bold text-white tracking-wide">Jingga & Biru</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
