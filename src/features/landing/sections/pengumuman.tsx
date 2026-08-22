"use client";

import { Pengumuman as PengumumanType } from "@/types/pengumuman";
import { truncateByWords } from "@/utils/truncate";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface PengumumanSectionProps {
    data: PengumumanType[];
}

export default function Pengumuman({ data }: PengumumanSectionProps) {
    const previewPengumuman = data.slice(0, 3);
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        // Title animation
        gsap.fromTo(
            [titleRef.current, subtitleRef.current],
            { y: 30, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.2, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            }
        );

        // Cards Staggered Animation
        const cards = gsap.utils.toArray(".pengumuman-card");
        if (cards.length > 0) {
            gsap.fromTo(
                cards,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                    }
                }
            );
        }
    }, { scope: sectionRef });


    return (
        <section ref={sectionRef} className="py-16 md:py-24 w-[85%] lg:w-[80%] mx-auto overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-16">
                <h2 
                    ref={titleRef}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-4 font-plusJakarta leading-tight"
                >
                    Pengumuman
                </h2>
                <p 
                    ref={subtitleRef}
                    className="text-sm sm:text-base font-medium text-gray-700"
                >
                    Simak informasi dan kabar terbaru dari PMK Daniel!
                </p>
            </div>

            {/* Cards Grid: 1 col on mobile/tablet, 3 cols on desktop */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
                {previewPengumuman.map((item) => (
                    <div 
                        key={item.id} 
                        className="pengumuman-card group flex flex-col bg-white rounded-[24px] lg:rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(62,64,149,0.12)] transition-shadow duration-500 border border-gray-100/50"
                    >
                        {/* Image Wrapper */}
                        <div className="w-full overflow-hidden rounded-[16px] lg:rounded-[20px] aspect-[3/4] relative mb-6">
                            <Image
                                draggable={false}
                                src={item.imageUrl}
                                sizes="(max-width: 1024px) 100vw, 33vw"
                                alt={item.title}
                                fill
                                className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                            />
                            
                            {/* Date Badge Overlay */}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                <p className="font-plusJakarta font-bold text-xs text-primary">
                                    {item.datePublished}
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-grow px-2">
                            <Link href={`/pengumuman/${item.id}`} className="group-hover:text-primary transition-colors duration-300">
                                <h3 className="font-plusJakarta font-bold text-xl lg:text-2xl leading-snug line-clamp-2">
                                    {item.title}
                                </h3>
                            </Link>
                            
                            <p className="mt-3 font-plusJakarta font-medium text-sm text-gray-600 line-clamp-3 leading-relaxed flex-grow">
                                {truncateByWords({ text: item.description, wordLimit: 20 })}
                            </p>
                            
                            {/* Action Link */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <Link 
                                    href={`/pengumuman/${item.id}`} 
                                    className="inline-flex items-center gap-2 font-plusJakarta font-bold text-sm text-secondary hover:text-primary transition-colors duration-300"
                                >
                                    Baca Selengkapnya
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}