"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const eras = [
    {
        num: "01",
        tag: "Kelahiran",
        period: "21 April 2013",
        title: "Sebuah Nama, Sebuah Cerita",
        intro: "Dari pemisahan dua prodi di Universitas Brawijaya, lahirlah sebuah komunitas iman yang meneladani keberanian tokoh Daniel.",
        points: [
            "Pada tahun 2012, terbentuk Program Teknologi Informasi dan Ilmu Komputer (PTIIK) dari pemisahan Prodi Ilmu Komputer FMIPA dan Teknik Rekayasa Perangkat Lunak FT.",
            "Mahasiswa Kristen di kedua prodi, dibantu UAKK, merintis persekutuan baru di PTIIK.",
            "Akhirnya, pada 21 April 2013, lahirlah Persekutuan Mahasiswa Kristen Daniel — wadah bertumbuh dan bersaksi di dunia teknologi, meneladani iman Daniel yang teguh di tengah tantangan zaman.",
        ],
    },
    {
        num: "02",
        tag: "Daniel 1.0",
        period: "2013 – 2021",
        title: "Era Pengkaderan & Fondasi",
        intro: "Delapan tahun membangun karakter, solidaritas angkatan, dan identitas pelayanan melalui sistem tim kecil.",
        points: [
            "Menggunakan sistem pengkaderan tim kecil; pada semester 2 diadakan open recruitment (oprec) untuk memilih anggota tim kecil generasi berikutnya.",
            "Setiap tim kecil terdiri dari tiga orang per angkatan sebagai kunci solidaritas dan kepemimpinan.",
            "Hanya anggota tim kecil yang memiliki hak menjadi ketua atau wakil PMK.",
            "Sistem pengkaderan mengikuti pola PMK Yehezkiel.",
            "Pengurus terdiri dari 3 angkatan; tidak ada Majelis Pengarah (Steering Council).",
            "Adanya Kegiatan Tengah Minggu (Sharecom/PA).",
        ],
    },
    {
        num: "03",
        tag: "Fase Hiatus",
        period: "2021 – 2023",
        title: "Masa Transisi & Keheningan",
        intro: "Sebuah periode gelap yang menjadi titik balik paling bermakna dalam perjalanan PMK Daniel.",
        points: [
            "PMK Daniel mengalami masa transisi dan kekosongan kepengurusan internal.",
            "PMK Daniel di-take over sementara oleh UAKK UB.",
            "Menjadi katalis yang mendorong lahirnya transformasi sistem organisasi secara menyeluruh.",
        ],
    },
    {
        num: "04",
        tag: "Daniel 2.0",
        period: "2023 – Sekarang",
        title: "Regenerasi & Era Baru",
        intro: "PMK Daniel bangkit dengan sistem yang lebih agile, inklusif, dan berfokus pada pertumbuhan orang — bukan program.",
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
        title: "Persiapan & Fondasi",
        desc: "Fase Persiapan dan Pondasi Dasar Sistem Organisasi dan Regenerasi PMK Daniel.",
        active: false,
        done: true,
    },
    {
        num: "02",
        period: "2025 – 2026",
        title: "Pengembangan Awal",
        desc: "Pengembangan Circle/KTB dan Pra Alumni sebagai kreativitas pertama pelayanan.",
        active: true,
        done: false,
    },
    {
        num: "03",
        period: "2027 – 2029",
        title: "Penguatan & Misi",
        desc: "Penguatan Circle dan Perintisan Daniel Mission Project sebagai langkah konkret ke luar.",
        active: false,
        done: false,
    },
    {
        num: "04",
        period: "2029 – 2033",
        title: "Inovasi & Integrasi",
        desc: "Pengembangan prestasi Daniel Mission Project dan Perintisan Daniel Developer.",
        active: false,
        done: false,
    },
    {
        num: "05",
        period: "2033 – ...",
        title: "Kemandirian",
        desc: "Self Fundraising System dari Daniel Developer dan Daniel Sovereign Fund.",
        active: false,
        done: false,
    },
];

export default function SejarahTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    useGSAP(() => {
        // Section headers
        gsap.utils.toArray<HTMLElement>(".era-row").forEach((row) => {
            gsap.fromTo(
                row,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: row, start: "top 85%" },
                }
            );
        });

        // RJP header
        gsap.fromTo(".rjp-header",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".rjp-header", start: "top 85%" } }
        );

        // RJP phase items
        gsap.utils.toArray<HTMLElement>(".phase-item").forEach((item, i) => {
            gsap.fromTo(
                item,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: "power3.out",
                    scrollTrigger: { trigger: ".rjp-phases", start: "top 85%" },
                }
            );
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full">

            {/* ─── SEJARAH ──────────────────────────────────── */}
            <section className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-28 mx-auto">

                {/* Section label + title */}
                <div className="era-row mb-16 md:mb-20 border-b border-gray-200 pb-10">
                    <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-4">
                        Jejak Langkah
                    </p>
                    <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-primary font-plusJakarta leading-[1.05] tracking-tight">
                        Sejarah &<br />Rekam Perjalanan
                    </h2>
                </div>

                {/* Era rows */}
                <div className="space-y-0">
                    {eras.map((era, idx) => {
                        const isOpen = expanded === idx;
                        const isLast = idx === eras.length - 1;

                        return (
                            <div
                                key={idx}
                                className={`era-row group ${!isLast ? "border-b border-gray-100" : ""}`}
                            >
                                {/* Clickable row header */}
                                <button
                                    onClick={() => setExpanded(isOpen ? null : idx)}
                                    className="w-full text-left py-8 md:py-10 grid grid-cols-12 gap-6 items-start cursor-pointer focus:outline-none"
                                >
                                    {/* Era number — large editorial */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <span
                                            className="text-5xl md:text-6xl font-black font-plusJakarta leading-none select-none transition-colors duration-300"
                                            style={{ color: isOpen ? "#F58732" : "#E5E7EB" }}
                                        >
                                            {era.num}
                                        </span>
                                    </div>

                                    {/* Tag + Period */}
                                    <div className="col-span-10 lg:col-span-2 pt-1 flex flex-col gap-1">
                                        <p className="text-xs font-extrabold tracking-widest text-secondary uppercase">
                                            {era.tag}
                                        </p>
                                        <p className="text-xs font-medium text-gray-400 tracking-wide">
                                            {era.period}
                                        </p>
                                    </div>

                                    {/* Title + Intro */}
                                    <div className="col-span-12 lg:col-span-7 lg:col-start-4">
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary font-plusJakarta leading-snug mb-2 group-hover:text-secondary transition-colors duration-300">
                                            {era.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                            {era.intro}
                                        </p>
                                    </div>

                                    {/* Toggle indicator */}
                                    <div className="hidden lg:flex col-span-2 justify-end pt-1">
                                        <div
                                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:border-secondary"
                                            style={isOpen ? { background: "#F58732", borderColor: "#F58732" } : {}}
                                        >
                                            <svg
                                                width="12" height="12" viewBox="0 0 12 12" fill="none"
                                                className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                                            >
                                                <line x1="6" y1="0" x2="6" y2="12" stroke={isOpen ? "white" : "#9CA3AF"} strokeWidth="1.5" />
                                                <line x1="0" y1="6" x2="12" y2="6" stroke={isOpen ? "white" : "#9CA3AF"} strokeWidth="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Expandable points */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[600px] opacity-100 pb-8 md:pb-10" : "max-h-0 opacity-0"}`}
                                >
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-12 lg:col-span-9 lg:col-start-4">
                                            {/* Orange accent rule */}
                                            <div className="w-8 h-0.5 bg-secondary mb-6" />
                                            <ul className="space-y-4">
                                                {era.points.map((point, pIdx) => (
                                                    <li key={pIdx} className="flex items-start gap-4">
                                                        <span className="text-xs font-extrabold text-gray-300 mt-0.5 shrink-0 w-5 text-right">
                                                            {String(pIdx + 1).padStart(2, "0")}
                                                        </span>
                                                        <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                                                            {point}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── RJP ─────────────────────── full-width brand blue ── */}
            <section className="w-full bg-primary py-20 md:py-28 relative overflow-hidden">

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "64px 64px",
                    }}
                />

                {/* Orange corner accent */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-tl-[120px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-48 h-48 bg-secondary/5 rounded-br-full pointer-events-none" />

                <div className="w-[88%] lg:w-[82%] max-w-7xl mx-auto relative z-10">

                    {/* RJP Header */}
                    <div className="rjp-header mb-14 md:mb-16 border-b border-white/15 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-xs font-extrabold tracking-[0.3em] text-secondary uppercase mb-4">
                                Visi Jangka Panjang
                            </p>
                            <h2 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold text-white font-plusJakarta leading-[1.05] tracking-tight">
                                Rencana Jangka<br />
                                Panjang <span className="text-secondary">2023–2033+</span>
                            </h2>
                        </div>
                        <p className="text-sm font-medium text-white/50 leading-relaxed max-w-xs">
                            Lima fase transformasi menuju PMK Daniel yang mandiri, berdampak, dan berkelanjutan.
                        </p>
                    </div>

                    {/* Phase list */}
                    <div className="rjp-phases space-y-0">
                        {phases.map((phase, idx) => {
                            const isLast = idx === phases.length - 1;
                            return (
                                <div
                                    key={idx}
                                    className={`phase-item grid grid-cols-12 gap-4 py-7 md:py-8 items-start ${!isLast ? "border-b border-white/10" : ""} group`}
                                >
                                    {/* Phase number */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <span className={`text-4xl md:text-5xl font-black font-plusJakarta leading-none select-none ${phase.active ? "text-secondary" : "text-white/15"}`}>
                                            {phase.num}
                                        </span>
                                    </div>

                                    {/* Period */}
                                    <div className="col-span-10 lg:col-span-2 pt-1">
                                        <p className={`text-xs font-extrabold tracking-widest uppercase ${phase.active ? "text-secondary" : "text-white/40"}`}>
                                            {phase.period}
                                        </p>
                                        {phase.active && (
                                            <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest mt-1">
                                                ● Berjalan
                                            </p>
                                        )}
                                        {phase.done && (
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                                                ✓ Selesai
                                            </p>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="col-span-12 lg:col-span-3 lg:col-start-4 pt-0.5">
                                        <h4 className={`text-base sm:text-lg font-extrabold font-plusJakarta leading-snug ${phase.active ? "text-white" : "text-white/60 group-hover:text-white/80 transition-colors"}`}>
                                            {phase.title}
                                        </h4>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                                        {/* Orange separator on active */}
                                        {phase.active && <div className="w-6 h-0.5 bg-secondary mb-3" />}
                                        <p className={`text-sm font-medium leading-relaxed ${phase.active ? "text-white/80" : "text-white/40 group-hover:text-white/60 transition-colors"}`}>
                                            {phase.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                        <p className="text-xs font-medium text-white/30 tracking-wide">
                            PMK Daniel FILKOM UB · Rencana Jangka Panjang 2.0
                        </p>
                        <p className="text-xs font-extrabold text-secondary/60 uppercase tracking-widest">
                            Together to be Better
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
