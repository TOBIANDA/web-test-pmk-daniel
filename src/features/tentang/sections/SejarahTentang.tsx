"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BookOpen, Flame, PauseCircle, Sparkles, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const eras = [
    {
        num: "01",
        era: "Kelahiran",
        tag: "21 April 2013",
        title: "Sebuah Nama,\nSebuah Cerita",
        icon: BookOpen,
        dark: false,
        accent: "#3E4095",
        points: [
            "Pada tahun 2012, terbentuk Program Teknologi Informasi dan Ilmu Komputer (PTIIK) dari pemisahan Prodi Ilmu Komputer FMIPA dan Teknik Rekayasa Perangkat Lunak FT.",
            "Mahasiswa Kristen di kedua prodi, dibantu UAKK, merintis persekutuan baru di PTIIK.",
            "Akhirnya, pada 21 April 2013, lahirlah Persekutuan Mahasiswa Kristen Daniel — wadah untuk bertumbuh dan bersaksi di dunia teknologi, meneladani iman Daniel yang teguh di tengah tantangan zaman.",
        ],
    },
    {
        num: "02",
        era: "Daniel 1.0",
        tag: "2013 – 2021",
        title: "Era Pengkaderan\n& Fondasi",
        icon: Flame,
        dark: true,
        accent: "#F58732",
        points: [
            "Menggunakan sistem pengkaderan tim kecil; pada semester 2 diadakan open recruitment (oprec) untuk memilih anggota tim kecil generasi berikutnya.",
            "Setiap tim kecil terdiri dari tiga orang per angkatan sebagai kunci solidaritas dan kepemimpinan.",
            "Hanya anggota tim kecil yang memiliki hak menjadi ketua atau wakil PMK.",
            "Sistem pengkaderan mengikuti pola PMK Yehezkiel.",
            "Pengurus terdiri dari 3 angkatan, tanpa Majelis Pengarah (Steering Council).",
            "Adanya Kegiatan Tengah Minggu (Sharecom/PA).",
        ],
    },
    {
        num: "03",
        era: "Fase Hiatus",
        tag: "2021 – 2023",
        title: "Masa Transisi\n& Keheningan",
        icon: PauseCircle,
        dark: false,
        accent: "#6b7280",
        points: [
            "PMK Daniel mengalami masa transisi dan kekosongan kepengurusan internal.",
            "PMK Daniel di-take over sementara oleh UAKK UB.",
            "Menjadi titik balik yang mendorong transformasi sistem organisasi secara menyeluruh.",
        ],
    },
    {
        num: "04",
        era: "Daniel 2.0",
        tag: "2023 – Sekarang",
        title: "Regenerasi\n& Era Baru",
        icon: Sparkles,
        dark: true,
        accent: "#F58732",
        points: [
            "Pemotongan angkatan fungsionaris aktif dari 3 angkatan menjadi 2 angkatan.",
            "Sistem PMK yang lebih agile, inklusif, dan berbasis meritokrasi.",
            "Hadirnya Steering Council (SC) sebagai pendamping fungsionaris aktif.",
            "Fokus pelayanan kepada Mahasiswa Kristen Filkom UB, bukan Program Kerja semata.",
            "Penomoran ulang: Komisi 1 Pembinaan dan Komisi 3 Acara.",
        ],
    },
];

const phases = [
    {
        num: "01",
        period: "2023 – 2024",
        title: "Persiapan &\nFondasi",
        desc: "Fase Persiapan dan Pondasi Dasar Sistem Organisasi dan Regenerasi PMK Daniel.",
        highlight: false,
    },
    {
        num: "02",
        period: "2025 – 2026",
        title: "Pengembangan\nAwal",
        desc: "Fase Pengembangan Awal & Kreativitas Pertama — Pengembangan Circle/KTB dan Pra Alumni.",
        highlight: false,
    },
    {
        num: "03",
        period: "2027 – 2029",
        title: "Penguatan\n& Misi",
        desc: "Fase Penguatan Kreasi & Misi Pelayanan — Penguatan Circle dan Perintisan Daniel Mission Project.",
        highlight: true,
    },
    {
        num: "04",
        period: "2029 – 2033",
        title: "Inovasi &\nIntegrasi",
        desc: "Fase Inovasi & Integrasi Keilmuan — Pengembangan Daniel Mission Project dan Perintisan Daniel Developer.",
        highlight: false,
    },
    {
        num: "05",
        period: "2033 – ...",
        title: "Kemandirian &\nKeberlanjutan",
        desc: "Fase Kemandirian — Self Fundraising System dari Daniel Developer dan Daniel Sovereign Fund.",
        highlight: false,
    },
];

export default function SejarahTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const rjpRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    useGSAP(() => {
        // Header animation
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
                    scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
                }
            );
        }

        // Timeline items
        if (timelineRef.current) {
            gsap.fromTo(
                timelineRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.9, stagger: 0.2, ease: "power3.out",
                    scrollTrigger: { trigger: timelineRef.current, start: "top 80%" },
                }
            );
        }

        // RJP phases
        if (rjpRef.current) {
            gsap.fromTo(
                rjpRef.current.querySelectorAll(".phase-card"),
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
                    scrollTrigger: { trigger: rjpRef.current, start: "top 80%" },
                }
            );
        }
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full">

            {/* ── SEJARAH SECTION ─────────────────────────────── */}
            <section className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-28 mx-auto">

                {/* Header */}
                <div ref={headerRef} className="mb-16 md:mb-20 max-w-3xl">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs mb-5 border border-secondary/20">
                        Jejak Langkah
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary font-plusJakarta leading-[1.1] mb-5">
                        Sejarah &<br />
                        <span className="text-secondary">Rekam Perjalanan</span>
                    </h2>
                    <p className="text-base sm:text-lg font-medium text-gray-500 leading-relaxed max-w-xl">
                        Dari rintisan kecil di tahun 2013 hingga transformasi besar di 2023 — perjalanan PMK Daniel menempa iman, identitas, dan semangat pelayanan.
                    </p>
                </div>

                {/* Vertical Timeline */}
                <div ref={timelineRef} className="relative">

                    {/* Center line (desktop) */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-secondary/30 to-primary/10 -translate-x-1/2" />

                    <div className="flex flex-col gap-0">
                        {eras.map((era, idx) => {
                            const isLeft = idx % 2 === 0;
                            const isOpen = expanded === idx;

                            return (
                                <div key={idx} className="relative group">

                                    {/* Center dot (desktop) */}
                                    <div
                                        className="hidden lg:flex absolute left-1/2 top-10 -translate-x-1/2 z-10 w-5 h-5 rounded-full border-4 border-white shadow-lg items-center justify-center transition-transform duration-300 group-hover:scale-125"
                                        style={{ background: era.accent }}
                                    />

                                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${!isLeft ? "lg:direction-rtl" : ""}`}>

                                        {/* Spacer for opposite side */}
                                        {!isLeft && <div className="hidden lg:block" />}

                                        {/* Card */}
                                        <div className={`${isLeft ? "lg:pr-14" : "lg:pl-14"} py-4`}>
                                            <div
                                                className={`rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer
                                                    ${era.dark
                                                        ? "bg-[#0f1117] border-white/10 hover:border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                                                        : "bg-white border-gray-100 hover:border-primary/20 shadow-[0_15px_50px_rgba(62,64,149,0.07)] hover:shadow-xl"
                                                    }`}
                                                onClick={() => setExpanded(isOpen ? null : idx)}
                                            >
                                                {/* Top accent line */}
                                                <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${era.accent}, ${era.dark ? "#3E4095" : "#F58732"})` }} />

                                                <div className="p-7 sm:p-8">
                                                    {/* Era num + badge row */}
                                                    <div className="flex items-center justify-between mb-5">
                                                        <div className="flex items-center gap-3">
                                                            <span
                                                                className="text-5xl font-black font-plusJakarta leading-none opacity-15 select-none"
                                                                style={{ color: era.accent }}
                                                            >
                                                                {era.num}
                                                            </span>
                                                            <div>
                                                                <span
                                                                    className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
                                                                    style={{ color: era.accent, borderColor: `${era.accent}30`, background: `${era.accent}15` }}
                                                                >
                                                                    {era.era}
                                                                </span>
                                                                <p className={`text-xs font-bold mt-1 ${era.dark ? "text-gray-400" : "text-gray-400"}`}>
                                                                    {era.tag}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`p-2.5 rounded-xl transition-transform duration-300 ${isOpen ? "rotate-0" : ""}`}
                                                            style={{ background: `${era.accent}15`, color: era.accent }}
                                                        >
                                                            <era.icon size={20} />
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3
                                                        className={`text-2xl sm:text-3xl font-extrabold font-plusJakarta leading-tight mb-5 whitespace-pre-line transition-colors duration-300
                                                            ${era.dark ? "text-white" : "text-primary"}`}
                                                    >
                                                        {era.title}
                                                    </h3>

                                                    {/* Points — always show first, expandable for rest */}
                                                    <ul className="space-y-3">
                                                        {era.points.slice(0, isOpen ? era.points.length : 2).map((point, pIdx) => (
                                                            <li key={pIdx} className="flex items-start gap-3">
                                                                <span
                                                                    className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                                                                    style={{ background: era.accent }}
                                                                />
                                                                <p className={`text-sm font-medium leading-relaxed ${era.dark ? "text-gray-300" : "text-gray-600"}`}>
                                                                    {point}
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {/* Expand toggle */}
                                                    {era.points.length > 2 && (
                                                        <button
                                                            className={`mt-5 flex items-center gap-1.5 text-xs font-bold transition-colors duration-200 hover:opacity-80`}
                                                            style={{ color: era.accent }}
                                                        >
                                                            {isOpen ? "Tutup" : `Lihat ${era.points.length - 2} poin lainnya`}
                                                            <ChevronDown
                                                                size={14}
                                                                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Spacer for opposite side */}
                                        {isLeft && <div className="hidden lg:block" />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── RJP SECTION — dark full-width ──────────────── */}
            <section ref={rjpRef} className="w-full bg-[#0f1117] py-20 md:py-28 relative overflow-hidden">

                {/* Background grain/glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
                    {/* Subtle dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                <div className="w-[88%] lg:w-[82%] max-w-7xl mx-auto relative z-10">

                    {/* RJP Header */}
                    <div className="mb-14 md:mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary font-bold tracking-[0.2em] uppercase text-xs mb-5 border border-secondary/25">
                            Visi Jangka Panjang
                        </span>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-plusJakarta leading-[1.1]">
                                Rencana Jangka<br />
                                <span className="text-secondary">Panjang 2023–2033+</span>
                            </h2>
                            <p className="text-sm sm:text-base font-medium text-gray-400 leading-relaxed max-w-xs md:text-right">
                                Lima fase transformasi menuju PMK Daniel yang mandiri, berdampak, dan berkelanjutan.
                            </p>
                        </div>
                    </div>

                    {/* Phase connecting line (desktop) */}
                    <div className="hidden lg:block relative mb-4">
                        <div className="absolute top-5 left-[5%] right-[5%] h-px bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30" />
                    </div>

                    {/* Phase cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
                        {phases.map((phase, idx) => (
                            <div
                                key={idx}
                                className={`phase-card group relative rounded-2xl p-5 sm:p-6 border transition-all duration-500 flex flex-col
                                    ${phase.highlight
                                        ? "bg-secondary border-secondary/40 shadow-[0_20px_50px_rgba(245,135,50,0.25)] scale-[1.02]"
                                        : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                                    }`}
                            >
                                {/* Phase number dot + line */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ring-4 transition-all duration-300
                                            ${phase.highlight
                                                ? "bg-white text-secondary ring-white/30"
                                                : "bg-white/10 text-white ring-white/5 group-hover:bg-white/15"
                                            }`}
                                    >
                                        {phase.num}
                                    </div>
                                    <span className={`text-xs font-bold tracking-widest ${phase.highlight ? "text-white/80" : "text-gray-500"}`}>
                                        PHASE {phase.num}
                                    </span>
                                </div>

                                {/* Period */}
                                <span className={`text-xs font-extrabold mb-2.5 ${phase.highlight ? "text-white/70" : "text-secondary"}`}>
                                    {phase.period}
                                </span>

                                {/* Title */}
                                <h4
                                    className={`text-base sm:text-lg font-extrabold font-plusJakarta leading-snug mb-3 whitespace-pre-line
                                        ${phase.highlight ? "text-white" : "text-white/90"}`}
                                >
                                    {phase.title}
                                </h4>

                                {/* Divider */}
                                <div className={`w-8 h-0.5 mb-3 rounded-full ${phase.highlight ? "bg-white/40" : "bg-white/10"}`} />

                                {/* Description */}
                                <p className={`text-xs leading-relaxed font-medium flex-1 ${phase.highlight ? "text-white/80" : "text-gray-400"}`}>
                                    {phase.desc}
                                </p>

                                {/* Active indicator */}
                                {idx === 1 && (
                                    <div className="mt-4 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Sedang Berjalan</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer tagline */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 font-medium">
                            Rencana Jangka Panjang PMK Daniel 2.0 · Dimulai 2023
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Together to be Better</span>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}
