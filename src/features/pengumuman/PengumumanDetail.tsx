"use client";

import React, { useRef, useState } from "react";
import EmptyPage from "@/components/EmptyState";
import { Pengumuman } from "@/types/pengumuman";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    Eye,
    Share2,
    Check,
    ZoomIn,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface PengumumanDetailPageProps {
    data: Pengumuman | undefined;
}

export default function PengumumanDetailPage({ data: blog }: PengumumanDetailPageProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const posterRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [copied, setCopied] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // GSAP Entrance Animations
    useGSAP(() => {
        if (!blog) return;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (posterRef.current) {
            tl.fromTo(
                posterRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                0
            );
        }

        if (contentRef.current) {
            tl.fromTo(
                contentRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
                0.15
            );
        }
    }, { scope: sectionRef, dependencies: [blog] });

    if (!blog) return <EmptyPage />;

    const posterImage = blog.imageUrl || "/pengumuman/persekutuan-doa-1-2026.jpg";
    const fullText = blog.description || blog.content || "";

    // Extract time & location if mentioned in text
    const timeMatch = fullText.match(/pukul\s+([0-9.:\s]+(?:WIB|WITA|WIT)?)/i) ||
                      fullText.match(/jam\s+([0-9.:\s]+(?:WIB|WITA|WIT)?)/i);
    const extractedTime = timeMatch ? timeMatch[0] : "10.30 WIB / Sesuai Jadwal";

    const locMatch = fullText.match(/(?:di|tempat:?)\s+(GKM\s*[0-9.]+|Gedung\s+[A-Za-z0-9.]+|Ruang\s+[A-Za-z0-9.]+|FILKOM\s+[A-Za-z0-9.]+)/i);
    const extractedLoc = locMatch ? locMatch[0] : "GKM FILKOM UB";

    const handleShare = async () => {
        const shareUrl = typeof window !== "undefined" ? window.location.href : "";
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: `Pengumuman PMK Daniel: ${blog.title}`,
                    url: shareUrl,
                });
                return;
            } catch (e) {}
        }

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section
            ref={sectionRef}
            className="py-32 sm:py-38 w-[88%] lg:w-[80%] max-w-6xl mx-auto min-h-screen font-plusJakarta"
        >
            {/* Back Button */}
            <div className="mb-8">
                <Link
                    href="/pengumuman"
                    className="inline-flex items-center gap-2 font-medium text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer group"
                >
                    <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                    <span className="hover:underline">Kembali ke Pengumuman</span>
                </Link>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                {/* ==============================================================
                    KOLOM KIRI: POSTER DENGAN ASPECT RATIO 3:4 & PADDING ELEGAN
                ============================================================== */}
                <div
                    ref={posterRef}
                    className="lg:col-span-5 lg:sticky lg:top-28"
                >
                    <div className="bg-white rounded-[24px] lg:rounded-[32px] p-4 sm:p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(62,64,149,0.1)] transition-shadow duration-500">
                        {/* Poster Frame (3:4 Ratio) */}
                        <div
                            onClick={() => setIsLightboxOpen(true)}
                            className="relative w-full aspect-[3/4] rounded-[16px] lg:rounded-[20px] overflow-hidden bg-gray-50 cursor-pointer group"
                        >
                            <Image
                                draggable={false}
                                src={posterImage}
                                alt={blog.title}
                                fill
                                unoptimized
                                priority
                                className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Date Badge Overlay */}
                            <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
                                <p className="font-plusJakarta font-bold text-xs text-primary">
                                    {blog.datePublished}
                                </p>
                            </div>

                            {/* Zoom Hint */}
                            <div className="absolute bottom-3.5 right-3.5 bg-black/50 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                <ZoomIn size={12} />
                                <span>Perbesar</span>
                            </div>
                        </div>

                        {/* Action Under Poster */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            {blog.views !== undefined && blog.views > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Eye size={14} className="text-primary" />
                                    <span>{blog.views} kali dilihat</span>
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400 font-medium">PMK Daniel FILKOM UB</span>
                            )}

                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="text-emerald-600" />
                                        <span className="text-emerald-600">Tautan Tersalin</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={14} />
                                        <span>Bagikan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ==============================================================
                    KOLOM KANAN: KONTEN & DETAIL INFORMASI (PALET PRIMARY & SECONDARY)
                ============================================================== */}
                <div ref={contentRef} className="lg:col-span-7 flex flex-col">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2">
                        <span className="font-plusJakarta font-bold text-xs sm:text-sm text-secondary uppercase tracking-wider">
                            {blog.category ? blog.category : "PENGUMUMAN"}
                        </span>
                    </div>

                    {/* Judul Utama */}
                    <h1 className="font-plusJakarta font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] text-foreground leading-tight tracking-tight mt-2">
                        {blog.title}
                    </h1>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium py-4 border-y border-gray-100 my-5">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={15} className="text-primary" />
                            <span>{blog.datePublished}</span>
                        </div>
                        {blog.author && (
                            <div className="flex items-center gap-1.5">
                                <User size={15} className="text-primary" />
                                <span>Oleh {blog.author}</span>
                            </div>
                        )}
                    </div>

                    {/* Unified Information Highlight Box (Brand Primary & Secondary) */}
                    <div className="bg-primary/5 border border-primary/15 rounded-[20px] p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-white text-primary shadow-xs shrink-0 mt-0.5">
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                                    Waktu / Jam
                                </p>
                                <p className="font-bold text-sm text-foreground mt-0.5">
                                    {extractedTime}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-white text-primary shadow-xs shrink-0 mt-0.5">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-primary/70 uppercase tracking-wider">
                                    Tempat / Lokasi
                                </p>
                                <p className="font-bold text-sm text-foreground mt-0.5">
                                    {extractedLoc}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Deskripsi Lengkap */}
                    <div className="font-plusJakarta font-normal text-base sm:text-lg text-gray-700 leading-relaxed sm:leading-loose whitespace-pre-line">
                        {fullText}
                    </div>
                </div>
            </div>

            {/* Lightbox Fullscreen Modal */}
            {isLightboxOpen && (
                <div
                    onClick={() => setIsLightboxOpen(false)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-xl w-full max-h-[85vh] flex flex-col items-center cursor-default"
                    >
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute -top-11 right-0 text-white hover:text-gray-300 p-1.5 rounded-full bg-white/10 transition-colors"
                        >
                            <X size={22} />
                        </button>

                        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-black">
                            <Image
                                src={posterImage}
                                alt={blog.title}
                                fill
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}