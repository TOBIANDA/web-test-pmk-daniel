"use client";

import React, { useState, useEffect } from "react";
import EmptyPage from "@/components/EmptyState";
import { ArrowLeft, Loader2, Calendar, Clock, MapPin, User, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { pengumumanService } from "@/services/pengumumanService";
import { Pengumuman } from "@/types/pengumuman";

export default function PengumumanDetailAdmin({ id }: { id: string }) {
    const [blog, setBlog] = useState<Pengumuman | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDetail() {
            try {
                const data = await pengumumanService.getPengumumanById(id);
                if (data) {
                    setBlog(data);
                }
            } catch (err) {
                console.error("Failed to load pengumuman detail", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!blog) return <EmptyPage />;

    const fullText = blog.description || blog.content || "";
    const timeMatch = fullText.match(/pukul\s+([0-9.:\s]+(?:WIB|WITA|WIT)?)/i) ||
                      fullText.match(/jam\s+([0-9.:\s]+(?:WIB|WITA|WIT)?)/i);
    const extractedTime = timeMatch ? timeMatch[0] : "10.30 WIB / Sesuai Jadwal";

    const locMatch = fullText.match(/(?:di|tempat:?)\s+(GKM\s*[0-9.]+|Gedung\s+[A-Za-z0-9.]+|Ruang\s+[A-Za-z0-9.]+|FILKOM\s+[A-Za-z0-9.]+)/i);
    const extractedLoc = locMatch ? locMatch[0] : "GKM FILKOM UB";

    return (
        <section className="w-full min-h-screen py-8 sm:py-12 px-4 sm:px-8 lg:px-12 font-plusJakarta text-slate-900 bg-background">
            {/* Header Navigation */}
            <div className="flex items-center gap-2 mb-8">
                <Link
                    href={"/limarotiduaikan"}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer group"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    <span className="hover:underline">Kembali ke Kelola Pengumuman</span>
                </Link>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl">
                {/* Left Column: Poster with 3:4 aspect ratio & padding */}
                <div className="lg:col-span-5 bg-white rounded-[24px] lg:rounded-[32px] p-4 sm:p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="relative w-full aspect-[3/4] rounded-[16px] lg:rounded-[20px] overflow-hidden bg-gray-50 shadow-inner">
                        <Image
                            src={blog.imageUrl || "/pengumuman/persekutuan-doa-1-2026.jpg"}
                            alt={blog.title}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-7 flex flex-col">
                    <span className="font-plusJakarta font-bold text-xs sm:text-sm text-secondary uppercase tracking-wider">
                        {blog.category ? blog.category : "PENGUMUMAN"}
                    </span>

                    <h1 className="font-plusJakarta font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight tracking-tight mt-2">
                        {blog.title}
                    </h1>

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
                        {blog.views !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <Eye size={15} className="text-primary" />
                                <span>{blog.views} kali dilihat</span>
                            </div>
                        )}
                    </div>

                    {/* Highlight Box (Brand Primary & Secondary) */}
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

                    <div className="font-plusJakarta font-normal text-base sm:text-lg text-gray-700 leading-relaxed sm:leading-loose whitespace-pre-line">
                        {fullText}
                    </div>
                </div>
            </div>
        </section>
    );
}