"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Flame, PauseCircle, Sparkles, BookOpen } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const eras = [
    {
        era: "Kelahiran",
        tag: "21 April 2013",
        title: "Sebuah Nama, Sebuah Cerita",
        icon: BookOpen,
        accentFrom: "from-primary",
        accentTo: "to-secondary",
        badgeClass: "bg-primary/10 text-primary border-primary/20",
        iconClass: "bg-primary/10 text-primary",
        points: [
            "Pada tahun 2012, terbentuk Program Teknologi Informasi dan Ilmu Komputer (PTIIK) dari pemisahan Prodi Ilmu Komputer FMIPA dan Teknik Rekayasa Perangkat Lunak FT.",
            "Mahasiswa Kristen di kedua prodi, dibantu UAKK, merintis persekutuan baru di PTIIK.",
            "Akhirnya, pada 21 April 2013, lahirlah Persekutuan Mahasiswa Kristen Daniel — meneladani iman Daniel yang teguh di tengah tantangan zaman."
        ]
    },
    {
        era: "Daniel 1.0",
        tag: "2013 – 2021",
        title: "Era Pengkaderan & Fondasi",
        icon: Flame,
        accentFrom: "from-secondary",
        accentTo: "to-primary",
        badgeClass: "bg-secondary/10 text-secondary border-secondary/20",
        iconClass: "bg-secondary/10 text-secondary",
        points: [
            "Menggunakan sistem pengkaderan tim kecil; pada semester 2 diadakan open recruitment (oprec) untuk memilih anggota tim kecil generasi berikutnya.",
            "Setiap tim kecil terdiri dari tiga orang per angkatan yang berperan sebagai kunci dalam solidaritas dan kepemimpinan angkatan.",
            "Hanya anggota tim kecil yang memiliki hak untuk menjadi ketua atau wakil PMK.",
            "Sistem pengkaderan mengikuti pola yang digunakan oleh PMK Yehezkiel.",
            "Jumlah pengurus dibatasi dan terdiri dari 3 angkatan.",
            "Tidak adanya Majelis Pengarah (Steering Council) seperti saat ini.",
            "Adanya Kegiatan Tengah Minggu (Sharecom/PA)."
        ]
    },
    {
        era: "Fase Hiatus",
        tag: "2021 – 2023",
        title: "PMK Daniel di-take over UAKK UB",
        icon: PauseCircle,
        accentFrom: "from-gray-600",
        accentTo: "to-gray-400",
        badgeClass: "bg-gray-100 text-gray-600 border-gray-200",
        iconClass: "bg-gray-100 text-gray-600",
        points: [
            "PMK Daniel mengalami masa transisi dan kekosongan kepengurusan internal.",
            "Selama periode ini, PMK Daniel di-take over oleh UAKK UB sebagai pengampu sementara.",
            "Menjadi titik balik yang mendorong perlunya transformasi sistem organisasi secara menyeluruh."
        ]
    },
    {
        era: "Daniel 2.0",
        tag: "2023 – Sekarang",
        title: "Regenerasi & Era Baru",
        icon: Sparkles,
        accentFrom: "from-secondary",
        accentTo: "to-primary",
        badgeClass: "bg-secondary/10 text-secondary border-secondary/20",
        iconClass: "bg-secondary/10 text-secondary",
        points: [
            "Pemotongan angkatan fungsionaris aktif dari 3 angkatan menjadi 2 angkatan.",
            "Perubahan sistem PMK yang lebih agile, inklusif, dan fokus pada meritokrasi.",
            "Adanya Steering Council (SC) sebagai pendamping fungsionaris aktif dalam menjalankan PMK.",
            "Fokus pelayanan kepada Mahasiswa Kristen Filkom UB, bukan Program Kerja semata.",
            "Perubahan penomoran Komisi 1 dan 3 menjadi Komisi 1 Pembinaan dan Komisi 3 Acara."
        ]
    }
];

export default function SejarahTentang() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!headerRef.current || !cardsRef.current) return;

        gsap.fromTo(
            headerRef.current.children,
            { y: 25, opacity: 0 },
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

        gsap.fromTo(
            cardsRef.current.children,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardsRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-[88%] lg:w-[82%] max-w-7xl py-20 md:py-28 mx-auto relative overflow-hidden">
            <div className="flex flex-col items-center">

                {/* Header */}
                <div ref={headerRef} className="text-center mb-14 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 border border-secondary/20">
                        Jejak Langkah
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight">
                        Sejarah & Rekam Perjalanan
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed">
                        Dari rintisan sederhana hingga transformasi besar — perjalanan PMK Daniel menempa iman, identitas, dan semangat pelayanan mahasiswa Kristen FILKOM UB.
                    </p>
                </div>

                {/* Timeline Cards Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
                    {eras.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 hover:border-primary/20 p-7 sm:p-8 shadow-[0_15px_40px_rgba(62,64,149,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                        >
                            {/* Top accent bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentFrom} ${item.accentTo}`} />

                            <div>
                                {/* Header row */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${item.iconClass} shrink-0`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <span className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                                                {item.era}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 shrink-0 ml-2">{item.tag}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-extrabold text-primary font-plusJakarta mb-4 group-hover:text-secondary transition-colors leading-snug">
                                    {item.title}
                                </h3>

                                {/* Points */}
                                <ul className="space-y-2.5">
                                    {item.points.map((point, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-2.5">
                                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-gradient-to-br ${item.accentFrom} ${item.accentTo}`} />
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed">{point}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer */}
                            <div className="mt-7 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400">
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
