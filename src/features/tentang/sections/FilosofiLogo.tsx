"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const symbols = [
    {
        num: "01",
        title: "Bentuk Lingkaran",
        desc: "Melambangkan keseimbangan dan integrasi antara iman dan ilmu.",
    },
    {
        num: "02",
        title: "Bentuk Pecahan Lingkaran",
        desc: "Menggambarkan pixel yang melambangkan identitas Fakultas Ilmu Komputer (FILKOM).",
    },
    {
        num: "03",
        title: "Tumpukan Buku di Bawah Alkitab Terbuka",
        desc: "Melambangkan mahasiswa PMK Daniel yang profesional dan hidup berdasarkan Firman Tuhan.",
    },
    {
        num: "04",
        title: "Salib",
        desc: "Melambangkan hubungan pribadi dengan Tuhan.",
    },
    {
        num: "05",
        title: "Jaringan yang Mengarah Keluar",
        desc: "Melambangkan bahwa PMK Daniel memberikan dampak positif bagi lingkungan sekitarnya.",
    },
];

const colors = [
    {
        swatch: "#F58732",
        name: "Jingga",
        context: "Warna Jingga & Biru melambangkan PMK Daniel berada di lingkungan Fakultas Ilmu Komputer Universitas Brawijaya.",
        meaning: "Mencerminkan sukacita dan semangat dalam melayani Kristus, mengingatkan kita untuk selalu bersukacita dalam Tuhan dan hidup dalam terang-Nya.",
        refs: ["Filipi 4:4", "Efesus 5:8"],
    },
    {
        swatch: "#3E4095",
        name: "Biru",
        context: "Kedua warna bersama-sama mengungkapkan semangat mahasiswa Kristen yang dipenuhi oleh kasih, kebenaran, dan damai Tuhan.",
        meaning: "Melambangkan kesetiaan dan kebenaran, mencerminkan janji Allah yang setia dan panggilan kita untuk hidup dalam damai sejahtera-Nya.",
        refs: ["Mazmur 89:2", "Kolose 3:15"],
    },
];

export default function FilosofiLogo() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>(".fl-row").forEach((el) => {
            gsap.fromTo(el,
                { y: 35, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }
            );
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-28 mx-auto">

            {/* ── Section header ──────────────── */}
            <div className="fl-row mb-12 md:mb-16 border-b border-gray-200 pb-10">
                <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-4">Identitas Visual</p>
                <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-primary font-plusJakarta leading-[1.05] tracking-tight">
                    Filosofi Lambang<br />&amp; Makna Warna
                </h2>
            </div>

            {/* ── Two-column: Logo | Symbol list ── */}
            <div className="fl-row grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-20 items-start">

                {/* Left: Logo */}
                <div className="lg:col-span-4 flex flex-col items-start gap-6">
                    <div className="relative w-44 h-44 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                        <Image
                            src="/logo.png"
                            alt="Logo PMK Daniel"
                            fill
                            unoptimized
                            priority
                            className="object-contain p-5"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-primary font-plusJakarta">PMK Daniel FILKOM</h3>
                        <p className="text-sm text-gray-400 font-medium mt-0.5">Universitas Brawijaya</p>
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs">
                        Setiap elemen visual dalam lambang PMK Daniel mengandung makna teologis, komitmen pelayanan, dan identitas akademik.
                    </p>
                </div>

                {/* Right: Symbol list */}
                <div className="lg:col-span-8 space-y-0">
                    {symbols.map((s, i) => (
                        <div
                            key={i}
                            className={`grid grid-cols-12 gap-4 py-5 ${i < symbols.length - 1 ? "border-b border-gray-100" : ""} group`}
                        >
                            <div className="col-span-2 lg:col-span-1 pt-0.5">
                                <span className="text-2xl font-black font-plusJakarta leading-none text-gray-100 group-hover:text-secondary/30 transition-colors select-none">
                                    {s.num}
                                </span>
                            </div>
                            <div className="col-span-10 lg:col-span-11">
                                <h4 className="text-sm sm:text-base font-extrabold text-primary font-plusJakarta group-hover:text-secondary transition-colors mb-1">
                                    {s.title}
                                </h4>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Color section ─── two columns, separated by vertical rule ── */}
            <div className="fl-row border-t border-gray-200">
                <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mt-10 mb-8">Makna Warna</p>

                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-gray-100">
                    {colors.map((c, i) => (
                        <div
                            key={i}
                            className={`py-8 md:py-10 ${i === 0 ? "md:pr-12 md:border-r border-gray-100" : "md:pl-12"}`}
                        >
                            {/* Color swatch + name */}
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-10 h-10 rounded-full shrink-0"
                                    style={{ background: c.swatch }}
                                />
                                <div>
                                    <p className="text-base font-extrabold text-primary font-plusJakarta leading-none">
                                        Warna {c.name}
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                                        {c.refs.join(" · ")}
                                    </p>
                                </div>
                            </div>

                            {/* Context note */}
                            <p className="text-xs font-medium text-gray-400 leading-relaxed mb-3 italic">
                                {c.context}
                            </p>

                            {/* Orange separator */}
                            <div className="w-6 h-px bg-secondary mb-4" />

                            {/* Meaning */}
                            <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                {c.meaning}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Full-width footer note */}
                <div className="border-t border-gray-100 pt-8 mt-2">
                    <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-3xl">
                        Kedua warna ini bersama-sama mengungkapkan semangat mahasiswa Kristen yang dipenuhi oleh kasih, kebenaran, dan damai Tuhan dalam persekutuan di PMK Daniel.
                    </p>
                </div>
            </div>

        </section>
    );
}
