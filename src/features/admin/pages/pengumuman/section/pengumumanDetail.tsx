"use client";

import React, { useState, useEffect } from "react";
import EmptyPage from "@/components/EmptyState";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
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

    return (
        <section className="w-full min-h-screen py-[73px] px-6 md:px-[70px] bg-background">
            <div className="flex items-center gap-2">
                <Link
                    href={"/limarotiduaikan"}
                    className="flex items-center gap-1.5 text-black transition-colors border-b border-transparent hover:border-current pb-0.5"
                >
                    <ArrowLeft size={20} className="mt-1" />
                    <p className="font-plusJakarta font-medium text-base sm:text-xl leading-none">
                        Kembali ke Kelola Pengumuman
                    </p>
                </Link>
            </div>

            <h1 className="mt-6 text-primary text-xl md:text-2xl lg:text-3xl xl:text-[40px] font-plusJakarta font-bold">
                Tampilan Detail Pengumuman
            </h1>

            <h2 className="font-plusJakarta font-extrabold text-xl md:text-2xl lg:text-3xl xl:text-[36px] mt-6 text-foreground">
                {blog.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-semibold text-xs uppercase tracking-wide">
                    PENGUMUMAN
                </span>
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Diunggah {blog.datePublished}</span>
                </div>
            </div>

            <div className="w-full h-[400px] md:h-[500px] relative mt-8 rounded-2xl overflow-hidden shadow-md bg-neutral-100">
                <Image
                    src={blog.imageUrl || "/images/persekutuan.webp"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="mt-8 max-w-4xl font-plusJakarta text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line">
                {blog.description}
            </div>
        </section>
    );
}