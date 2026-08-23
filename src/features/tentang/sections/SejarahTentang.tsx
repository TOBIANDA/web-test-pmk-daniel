"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Calendar, Shield, Flag } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const timelineData = [
    {
        tag: "2013",
        title: "Pendirian & Panggilan Awal",
        desc: "PMK Daniel didirikan pada tahun 2013 sebagai jawaban atas kebutuhan kerohanian mahasiswa Kristen Fakultas Ilmu Komputer Universitas Brawijaya.",
        icon: Calendar,
    },
    {
        tag: "Filosofi Nama",
        title: "Integritas Tokoh Daniel",
        desc: "Nama 'Daniel' dipilih untuk mengingatkan setiap anggota akan pentingnya mempertahankan iman dengan hikmat dan keberanian di tengah tantangan zaman.",
        icon: Shield,
    },
    {
        tag: "Kini & Nanti",
        title: "Pelayanan yang Berdampak",
        desc: "Hingga kini, PMK Daniel konsisten menyelenggarakan persekutuan rutin, pembinaan rohani, dan program keberdampakan sosial bagi sivitas akademika FILKOM UB.",
        icon: Flag,
    }
];

export default function SejarahTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!gridRef.current) return;

        gsap.fromTo(
            gridRef.current.children,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
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
                        Jejak Langkah
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        Sejarah & Rekam Perjalanan
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                        Rekam jejak komitmen pembinaan rohani dan pelayanan mahasiswa Kristen sejak awal berdirinya fakultas.
                    </p>
                </div>

                {/* Timeline Cards Grid */}
                <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                    {timelineData.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-8 shadow-[0_15px_40px_rgba(62,64,149,0.08)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                                        {item.tag}
                                    </span>
                                    <div className="p-3 rounded-2xl bg-secondary/10 text-secondary font-bold">
                                        <item.icon size={20} />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-primary font-plusJakarta mb-3 group-hover:text-secondary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
                                <span>PMK Daniel</span>
                                <span>FILKOM UB</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
