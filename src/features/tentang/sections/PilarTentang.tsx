"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Heart, Star, Sparkles, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PilarTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!gridRef.current) return;

        gsap.fromTo(
            gridRef.current.children,
            { y: 45, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.18,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-[85%] lg:w-[80%] py-24 md:py-32 mx-auto relative overflow-hidden">
            <div className="flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-16 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6">
                        Pilar Utama
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        3 Nilai Pembentuk Karakter
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                        Prinsip inti yang melandasi setiap gerakan, budaya, dan pelayanan persekutuan kami.
                    </p>
                </div>

                {/* Bento Grid with Guaranteed Inline Wavy Mesh Gradients */}
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                    
                    {/* Bento Card 1: Karakter Kristus (7 Columns) */}
                    <div 
                        style={{
                            backgroundColor: '#2D2E6F',
                            backgroundImage: 'radial-gradient(at 0% 0%, rgba(245, 135, 50, 0.5) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(62, 64, 149, 0.95) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(245, 135, 50, 0.4) 0px, transparent 55%), radial-gradient(at 0% 100%, rgba(62, 64, 149, 0.95) 0px, transparent 60%)'
                        }}
                        className="lg:col-span-7 text-white p-8 sm:p-10 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(62,64,149,0.3)] flex flex-col justify-between relative overflow-hidden group border border-white/20"
                    >
                        <span className="absolute -bottom-10 -right-6 text-[12rem] font-extrabold text-white/5 font-plusJakarta select-none pointer-events-none">
                            01
                        </span>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3.5 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-md">
                                    <Heart size={26} />
                                </div>
                                <span className="text-xs font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                                    Spiritual Integrity
                                </span>
                            </div>

                            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                                Pilar 01
                            </span>
                            
                            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-plusJakarta mb-4">
                                Karakter Kristus
                            </h3>

                            <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed max-w-xl">
                                Membangun pertumbuhan rohani yang teguh, meneladani kasih, kerendahan hati, kejujuran, dan integritas Yesus Kristus dalam seluruh aktivitas kampus.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-white/90">
                            <span>Landasan Spiritualitas</span>
                            <div className="flex items-center gap-1 text-secondary font-bold group-hover:translate-x-1 transition-transform">
                                <span>PMK Daniel</span>
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Bento Card 2: Unggul Berkarya (5 Columns) */}
                    <div className="lg:col-span-5 bg-white p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-[0_20px_50px_rgba(62,64,149,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                        <span className="absolute -bottom-6 -right-2 text-[10rem] font-extrabold text-gray-100 font-plusJakarta select-none pointer-events-none">
                            02
                        </span>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary">
                                    <Star size={26} />
                                </div>
                                <span className="text-xs font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full bg-secondary/10 text-secondary">
                                    Excellence
                                </span>
                            </div>

                            <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">
                                Pilar 02
                            </span>

                            <h3 className="text-2xl font-extrabold text-primary font-plusJakarta mb-3 group-hover:text-secondary transition-colors">
                                Unggul Berkarya
                            </h3>

                            <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                Mengembangkan disiplin dan ketekunan untuk meraih prestasi akademis serta karya komputasi bermutu tinggi sebagai wujud ibadah.
                            </p>
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
                            <span>Akademis & Teknologi</span>
                            <ArrowUpRight size={16} className="text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Bento Card 3: Menjadi Berkat (12 Columns) */}
                    <div 
                        style={{
                            backgroundColor: '#2D2E6F',
                            backgroundImage: 'radial-gradient(at 0% 0%, rgba(245, 135, 50, 0.5) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(62, 64, 149, 0.95) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(245, 135, 50, 0.4) 0px, transparent 55%), radial-gradient(at 0% 100%, rgba(62, 64, 149, 0.95) 0px, transparent 60%)'
                        }}
                        className="lg:col-span-12 text-white p-8 sm:p-10 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(62,64,149,0.25)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden group border border-white/20"
                    >
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 rounded-2xl bg-white/20 text-white backdrop-blur-md">
                                    <Sparkles size={22} />
                                </div>
                                <span className="text-xs font-extrabold tracking-widest uppercase px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                                    Social Impact — Pilar 03
                                </span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-plusJakarta mb-3">
                                Menjadi Berkat bagi Sesama
                            </h3>

                            <p className="text-sm font-medium text-white/95 leading-relaxed">
                                Mengabdikan potensi diri dan inovasi teknologi komputasi untuk memberikan kontribusi nyata, kehangatan persekutuan, dan menjadi terang di lingkungan kampus FILKOM UB serta masyarakat luas.
                            </p>
                        </div>

                        <div className="relative z-10 shrink-0">
                            <div className="px-6 py-3.5 rounded-full bg-white text-primary font-bold text-xs sm:text-sm tracking-wide shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
                                <span>Nilai Utama PMK Daniel</span>
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
