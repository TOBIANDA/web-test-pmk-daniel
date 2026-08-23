"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Target, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const misiData = [
    {
        num: "01",
        title: "Pembinaan Iman & Karakter",
        desc: "Mengadakan persekutuan dan pemahaman Alkitab yang terstruktur untuk membentuk mahasiswa Kristen berintegritas tinggi."
    },
    {
        num: "02",
        title: "Persekutuan & Dukungan Persaudaraan",
        desc: "Menyediakan wadah persekutuan yang saling mendukung, menguatkan, dan melayani dalam kasih Kristus di FILKOM UB."
    },
    {
        num: "03",
        title: "Pengembangan Talenta & Keberdampakan",
        desc: "Mendorong penerapan ilmu komputasi dan teknologi untuk memberi kontribusi nyata bagi masyarakat dan lingkungan kampus."
    }
];

export default function VisiMisiTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const visiRef = useRef<HTMLDivElement>(null);
    const misiRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.fromTo(visiRef.current,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );

        if (misiRef.current) {
            gsap.fromTo(misiRef.current.children,
                { y: 35, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: misiRef.current,
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
                        Arah Strategis
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        Visi & Misi Organisasi
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
                    
                    {/* Visi Card */}
                    <div 
                        ref={visiRef} 
                        style={{
                            backgroundColor: '#2D2E6F',
                            backgroundImage: 'radial-gradient(at 0% 0%, rgba(245, 135, 50, 0.5) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(62, 64, 149, 0.95) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(245, 135, 50, 0.4) 0px, transparent 55%), radial-gradient(at 0% 100%, rgba(62, 64, 149, 0.95) 0px, transparent 60%)'
                        }}
                        className="lg:col-span-5 text-white p-8 sm:p-10 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(62,64,149,0.25)] flex flex-col justify-between relative overflow-hidden group border border-white/20"
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-8 backdrop-blur-md border border-white/30">
                                <Target size={24} />
                            </div>
                            
                            <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 block">
                                Pernyataan Visi
                            </span>
                            
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-plusJakarta leading-tight mb-4">
                                Menjadi Persekutuan Mahasiswa Kristen yang Berakar Kuat & Berdampak
                            </h3>

                            <p className="text-sm font-medium text-white/95 leading-relaxed">
                                Mewujudkan mahasiswa Kristen FILKOM UB yang memiliki kedalaman iman, keunggulan akademis & karya teknologi, serta menjadi terang di tengah masyarakat.
                            </p>
                        </div>

                        <div className="relative z-10 mt-10 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-white/90">
                            <span>Arah Pergerakan Pelayanan</span>
                            <ArrowUpRight size={18} />
                        </div>
                    </div>

                    {/* Misi List */}
                    <div ref={misiRef} className="lg:col-span-7 flex flex-col justify-between gap-4">
                        {misiData.map((misi, idx) => (
                            <div 
                                key={idx}
                                className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-[0_15px_40px_rgba(62,64,149,0.06)] hover:shadow-lg transition-all duration-300 flex items-start gap-5 group"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 mt-0.5 font-extrabold text-sm shadow-md">
                                    {misi.num}
                                </div>
                                <div>
                                    <h4 className="text-lg font-extrabold text-primary font-plusJakarta mb-1 group-hover:text-secondary transition-colors">
                                        {misi.title}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                        {misi.desc}
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
