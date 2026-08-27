"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pengumuman } from "@/types/pengumuman";
import { truncateByWords } from "@/utils/truncate";
import { Calendar, User, Search, Megaphone } from "lucide-react";

interface PengumumanMainProps {
    initialData: Pengumuman[];
}

const CATEGORIES = [
    { label: "Semua", value: "all" },
    { label: "Kegiatan / Ibadah", value: "kegiatan" },
    { label: "Open Recruitment", value: "oprec" },
    { label: "Ulang Tahun", value: "ultah" },
    { label: "Lainnya", value: "lainnya" },
];

export default function PengumumanMainPage({ initialData }: PengumumanMainProps) {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const items = useMemo(() => {
        return (initialData || []).filter((item) => {
            const matchesCategory =
                selectedCategory === "all" || item.category === selectedCategory;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                item.title.toLowerCase().includes(q) ||
                (item.description && item.description.toLowerCase().includes(q)) ||
                (item.author && item.author.toLowerCase().includes(q));
            return matchesCategory && matchesSearch;
        });
    }, [initialData, selectedCategory, searchQuery]);

    return (
        <section className="py-32 sm:py-38 w-[88%] lg:w-[80%] mx-auto min-h-screen font-plusJakarta">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-3">
                    <Megaphone size={14} />
                    <span>Warta & Informasi</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-4 leading-tight tracking-tight">
                    Pengumuman
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-600 max-w-xl">
                    Simak kabar terbaru, warta ibadah, kegiatan fellowship, dan open recruitment di lingkungan PMK Daniel FILKOM UB.
                </p>
            </div>

            {/* Filter & Search Controls */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/25"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari pengumuman..."
                        className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                    />
                </div>
            </div>

            {/* Items Grid */}
            {items.length === 0 ? (
                <div className="w-full py-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Megaphone size={24} />
                    </div>
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                        Belum ada pengumuman untuk kategori ini.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Silakan pilih kategori lain atau bersihkan kata kunci pencarian.
                    </p>
                </div>
            ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 lg:mt-10">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/pengumuman/${item.slug || item.id}`}
                            className="group flex flex-col bg-white rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(62,64,149,0.12)] transition-all duration-500 border border-slate-100 hover:border-primary/30 cursor-pointer block"
                        >
                            {/* Image Aspect Wrapper */}
                            <div className="w-full overflow-hidden rounded-[20px] aspect-[3/4] relative mb-5 bg-slate-100">
                                <Image
                                    draggable={false}
                                    src={item.imageUrl || "/pengumuman/persekutuan-doa-1-2026.jpg"}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt={item.title}
                                    fill
                                    unoptimized
                                    className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Date Badge */}
                                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 text-[11px] font-bold text-primary">
                                    <Calendar size={12} />
                                    <span>{item.datePublished}</span>
                                </div>
                            </div>

                            {/* Info & Title */}
                            <div className="flex flex-col flex-grow px-1">
                                {item.category && (
                                    <span className="text-[11px] font-extrabold uppercase text-secondary tracking-wider mb-1">
                                        {item.category}
                                    </span>
                                )}

                                <h2 className="font-extrabold text-lg sm:text-xl leading-snug line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h2>

                                <p className="mt-3 font-normal text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed flex-grow">
                                    {truncateByWords({ text: item.description || item.content || "", wordLimit: 22 })}
                                </p>

                                {/* Footer Action */}
                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    {item.author ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                                            <User size={12} /> {item.author}
                                        </span>
                                    ) : (
                                        <span />
                                    )}

                                    <span className="font-bold text-xs sm:text-sm text-secondary group-hover:text-primary transition-colors inline-flex items-center gap-1 group-hover:translate-x-1 duration-300">
                                        <span>Baca Selengkapnya</span>
                                        <span>&rarr;</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}