"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const visiComponents = [
    {
        keyword: "Suci",
        label: "Sarjana komputer yang hidup dalam Firman Tuhan",
        desc: "Mengacu pada pengembangan karakter spiritual yang kuat — mahasiswa yang menjadikan Firman Tuhan sebagai landasan hidup di tengah dunia akademis.",
    },
    {
        keyword: "Sarjana",
        label: "Profesional",
        desc: "Mengarah pada peningkatan kompetensi akademik dan keterampilan di bidang komputer, membentuk sarjana yang kompeten secara profesional.",
    },
    {
        keyword: "Setia",
        label: "Menjadi garam dan terang dunia",
        desc: "Berkaitan dengan kontribusi positif dan berpengaruh di masyarakat — membawa dampak nyata sebagai mahasiswa Kristen yang berdampak.",
    },
];

const misiData = [
    {
        num: "01",
        keyword: "Menang",
        title: "Membentuk mahasiswa Kristen yang memprioritaskan Tuhan dalam kehidupannya",
        ref: "Matius 6:33",
        core: "Memelihara kehidupan rohani yang aktif melalui doa, persekutuan, dan pembacaan Alkitab. Mengambil keputusan yang selaras dengan prinsip-prinsip Alkitab.",
        goal: "Menciptakan individu dengan komitmen spiritual yang kuat, yang memprioritaskan kehendak Tuhan dalam setiap aspek kehidupannya.",
    },
    {
        num: "02",
        keyword: "Bina",
        title: "Membentuk mahasiswa Kristen menjadi sarjana Komputer yang berkualitas",
        ref: "Kolose 3:23–24",
        core: "Menggabungkan profesionalisme dan spiritualitas — mahasiswa mengembangkan keterampilan teknis yang mumpuni sambil mematuhi prinsip-prinsip Firman Tuhan.",
        goal: "Menciptakan sarjana komputer yang kompeten secara profesional dan memiliki integritas serta etika yang sesuai dengan nilai-nilai Kristiani.",
    },
    {
        num: "03",
        keyword: "Utus",
        title: "Membentuk mahasiswa Kristen yang mampu menjadi berkat bagi sekitarnya",
        ref: "Matius 5:13–16",
        core: "Menekankan tanggung jawab sosial dan pengaruh positif — mahasiswa aktif dalam pelayanan sosial dan tindakan yang menunjukkan kasih Kristus kepada orang lain.",
        goal: "Menciptakan individu yang berperan aktif memberikan dampak positif bagi masyarakat dan menjadi berkat bagi orang-orang di sekitar.",
    },
];

export default function VisiMisiTentang() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>(".vm-row").forEach((el) => {
            gsap.fromTo(el,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }
            );
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full">

            {/* ── VISI ─────────────────────────── */}
            <section className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-24 mx-auto">

                {/* Section label + title */}
                <div className="vm-row mb-12 md:mb-16 border-b border-gray-200 pb-10">
                    <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-4">Arah Strategis</p>
                    <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-primary font-plusJakarta leading-[1.05] tracking-tight">
                        Visi & Misi<br />Organisasi
                    </h2>
                </div>

                {/* Vision statement — large pull-quote */}
                <div className="vm-row mb-14 md:mb-16">
                    <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-6">Visi</p>
                    <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-plusJakarta leading-snug border-l-4 border-secondary pl-6 sm:pl-8 mb-8 max-w-4xl">
                        "Terwujudnya sarjana komputer yang hidup dalam Firman Tuhan, profesional serta menjadi garam dan terang dunia."
                    </blockquote>
                    <p className="text-sm text-gray-500 font-medium pl-6 sm:pl-8 max-w-2xl leading-relaxed">
                        Visi PMK Daniel memiliki tiga komponen utama yang saling melengkapi, mencerminkan pengembangan mahasiswa secara holistik — spiritual, akademis, dan sosial.
                    </p>
                </div>

                {/* Vision components — three columns separated by rules */}
                <div className="vm-row grid grid-cols-1 md:grid-cols-3 border-t border-gray-200">
                    {visiComponents.map((v, i) => (
                        <div
                            key={i}
                            className={`py-8 md:py-10 pr-8 ${i < 2 ? "md:border-r border-gray-200" : ""} ${i > 0 ? "md:pl-8 md:pr-8" : ""} ${i === 2 ? "md:pl-8 md:pr-0" : ""} border-b md:border-b-0 border-gray-100 last:border-b-0`}
                        >
                            <p className="text-xs font-extrabold tracking-widest text-secondary uppercase mb-3">{v.keyword}</p>
                            <h3 className="text-base sm:text-lg font-extrabold text-primary font-plusJakarta leading-snug mb-3">{v.label}</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MISI — dark full-width ──────── */}
            <section className="w-full bg-primary py-20 md:py-28 relative overflow-hidden">

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />
                {/* Orange accent corner */}
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 rounded-tl-[140px] pointer-events-none" />

                <div className="w-[88%] lg:w-[82%] max-w-7xl mx-auto relative z-10">

                    {/* Misi header */}
                    <div className="vm-row mb-12 md:mb-14 border-b border-white/15 pb-10">
                        <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-4">Misi</p>
                        <p className="text-sm font-medium text-white/50 max-w-lg leading-relaxed">
                            Tiga misi ini berfokus pada pengembangan mahasiswa secara holistik — spiritual, akademis, dan sosial — agar menjadi pemimpin yang menginspirasi dan menjadi berkat bagi orang lain.
                        </p>
                    </div>

                    {/* Misi rows */}
                    <div className="space-y-0">
                        {misiData.map((m, i) => (
                            <div key={i} className={`vm-row grid grid-cols-12 gap-4 md:gap-8 py-8 md:py-10 ${i < misiData.length - 1 ? "border-b border-white/10" : ""} group`}>

                                {/* Number + keyword */}
                                <div className="col-span-2 lg:col-span-1">
                                    <span className="text-5xl font-black font-plusJakarta leading-none text-white/10 select-none group-hover:text-white/20 transition-colors">
                                        {m.num}
                                    </span>
                                </div>

                                <div className="col-span-10 lg:col-span-2 pt-1">
                                    <p className="text-xs font-extrabold tracking-widest text-secondary uppercase mb-1">{m.keyword}</p>
                                    <p className="text-xs text-white/30 font-medium">{m.ref}</p>
                                </div>

                                {/* Title */}
                                <div className="col-span-12 lg:col-span-4 lg:col-start-4 pt-0.5">
                                    <h3 className="text-base sm:text-lg font-extrabold text-white font-plusJakarta leading-snug">
                                        {m.title}
                                    </h3>
                                </div>

                                {/* Description split */}
                                <div className="col-span-12 lg:col-span-5 lg:col-start-8 space-y-3">
                                    <div className="w-6 h-px bg-secondary" />
                                    <p className="text-sm font-medium text-white/60 leading-relaxed">{m.core}</p>
                                    <p className="text-xs font-medium text-white/35 leading-relaxed italic">{m.goal}</p>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Footer note */}
                    <div className="vm-row mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-xs text-white/25 font-medium">PMK Daniel FILKOM UB · Dasar Perencanaan Program</p>
                        <p className="text-xs font-extrabold text-secondary/50 uppercase tracking-widest">Menang · Bina · Utus</p>
                    </div>

                </div>
            </section>

        </div>
    );
}
