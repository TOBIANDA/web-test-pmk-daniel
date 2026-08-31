"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const dataKegiatan = [
    {
        title: "Persekutuan Doa",
        number: "1",
        images: [
            "/images/persekutuan.webp",
            "/images/persekutuan2.webp",
        ],
        desc: "Merupakan kegiatan ibadah bersama untuk seluruh anggota dan pengurus PMK yang dilaksanakan setiap hari Jumat di masa perkuliahan."
    },
    {
        title: "Camp Daniel",
        number: "2",
        images: [
            "/images/campdaniel.webp",
            "/images/campdaniel2.webp",
            "/images/campdaniel3.webp",
            "/images/campdaniel4.webp",
        ],
        desc: "Kegiatan retret rohani bersama untuk anggota baru PMK Daniel."
    },
    {
        title: "Paskah PMK Daniel",
        number: "3",
        images: [
            "/images/paskahpmk.webp",
            "/images/paskahpmk2.webp",
        ],
        desc: "Ibadah Paskah bersama untuk anggota dan pengurus PMK Daniel."
    },
    {
        title: "Natal PMK Daniel",
        number: "4",
        images: [
            "/images/natal1.webp",
            "/images/natal2.webp",
            "/images/natal3.webp",
            "/images/natal4.webp",
        ],
        desc: "Ibadah Natal bersama untuk anggota dan pengurus PMK Daniel."
    },
];

// Hover-to-Slide Slider with Hand Cursor (cursor-pointer)
function ImageSlider({ images, title }: { images: string[]; title: string }) {
    const [current, setCurrent] = useState(0);
    const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentHoverSideRef = useRef<"left" | "right" | null>(null);

    const hasMultiple = images.length > 1;

    const stepSlide = useCallback((dir: "left" | "right") => {
        setCurrent((prev) => {
            if (dir === "right") {
                return (prev + 1) % images.length;
            } else {
                return (prev - 1 + images.length) % images.length;
            }
        });
    }, [images.length]);

    const stopHover = useCallback(() => {
        currentHoverSideRef.current = null;
        setHoverSide(null);
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        if (hoverIntervalRef.current) {
            clearInterval(hoverIntervalRef.current);
            hoverIntervalRef.current = null;
        }
    }, []);

    const startHover = useCallback((dir: "left" | "right") => {
        if (!hasMultiple) return;
        if (currentHoverSideRef.current === dir) return; // already active on this side

        // Clear previous side timers
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);

        currentHoverSideRef.current = dir;
        setHoverSide(dir);

        // Advance after an intentional, comfortable hover delay (480ms)
        hoverTimerRef.current = setTimeout(() => {
            stepSlide(dir);
            // Continue advancing calmly every 1100ms if cursor stays on this side
            hoverIntervalRef.current = setInterval(() => {
                if (currentHoverSideRef.current) {
                    stepSlide(currentHoverSideRef.current);
                }
            }, 1100);
        }, 480);
    }, [hasMultiple, stepSlide]);

    const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!hasMultiple || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const dir: "left" | "right" = relativeX < rect.width / 2 ? "left" : "right";
        startHover(dir);
    }, [hasMultiple, startHover]);

    const onMouseLeave = useCallback(() => {
        stopHover();
    }, [stopHover]);

    // Touch support for mobile (tap left/right side)
    const onTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (!hasMultiple || !containerRef.current) return;
        const touch = e.changedTouches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = touch.clientX - rect.left;
        const dir: "left" | "right" = relativeX < rect.width / 2 ? "left" : "right";
        stepSlide(dir);
        stopHover();
    }, [hasMultiple, stepSlide, stopHover]);

    useEffect(() => {
        return () => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "image-wrapper relative w-full aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none group",
                hasMultiple ? "cursor-pointer" : "cursor-default"
            )}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onTouchEnd={onTouchEnd}
        >
            {/* Images transition with fade & subtle scale */}
            {images.map((src, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute inset-0 transition-all duration-700 ease-out pointer-events-none",
                        i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                >
                    <Image
                        draggable={false}
                        src={src}
                        alt={`${title} ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="inner-image select-none object-cover"
                    />
                </div>
            ))}

            {/* Hover Side Visual Indicators */}
            {hasMultiple && (
                <>
                    {/* Left half indicator */}
                    <div className={cn(
                        "absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none",
                        hoverSide === "left"
                            ? "bg-secondary text-white scale-110 shadow-lg opacity-100 ring-4 ring-secondary/30"
                            : "bg-black/30 backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-60"
                    )}>
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </div>

                    {/* Right half indicator */}
                    <div className={cn(
                        "absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none",
                        hoverSide === "right"
                            ? "bg-secondary text-white scale-110 shadow-lg opacity-100 ring-4 ring-secondary/30"
                            : "bg-black/30 backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-60"
                    )}>
                        <ChevronRight size={20} strokeWidth={2.5} />
                    </div>

                    {/* Counter / Active Side Badge */}
                    <div className={cn(
                        "absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-300 pointer-events-none",
                        hoverSide ? "bg-secondary/90 shadow-md opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                        {hoverSide && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                        <span>{current + 1} / {images.length}</span>
                    </div>
                </>
            )}

            {/* Clickable Dot Indicators */}
            {hasMultiple && (
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                            className={cn(
                                "rounded-full transition-all duration-300 cursor-pointer p-0",
                                i === current
                                    ? "w-6 h-1.5 bg-white shadow-md"
                                    : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                            )}
                            aria-label={`Foto ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Kegiatan() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

        // Row animations
        itemsRef.current.forEach((el, index) => {
            if (!el) return;
            const isEven = index % 2 === 0;
            const imageWrapper = el.querySelector(".image-wrapper");
            const innerImage = el.querySelector(".inner-image");
            const textContainer = el.querySelector(".text-container");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 75%",
                }
            });

            gsap.set(imageWrapper, {
                clipPath: isEven ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            });
            gsap.set(innerImage, { scale: 1.15 });
            gsap.set(textContainer, { opacity: 0, x: isEven ? 40 : -40 });

            tl.to(imageWrapper, {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                duration: 0.6,
                ease: "power3.inOut"
            })
                .to(innerImage, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.inOut"
                }, "<")
                .to(textContainer, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6");
        });

    }, { scope: sectionRef });

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className="w-[85%] lg:w-[80%] mx-auto py-16 md:py-24 overflow-hidden">

            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                <h2
                    ref={titleRef}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary mb-4 sm:mb-6 font-plusJakarta leading-tight"
                >
                    Kegiatan Kami
                </h2>
                <p
                    ref={subtitleRef}
                    className="text-sm sm:text-base font-medium text-gray-700"
                >
                    Simak kegiatan dan kebersamaan PMK Daniel!
                </p>
            </div>

            {/* Zig-Zag List */}
            <div className="flex flex-col gap-16 md:gap-24 lg:gap-32 w-full mx-auto">
                {dataKegiatan.map((data, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div
                            key={data.number}
                            ref={addToRefs}
                            className={cn(
                                "flex flex-col w-full gap-8 lg:gap-16 items-center",
                                isEven ? "md:flex-row" : "md:flex-row-reverse"
                            )}
                        >
                            {/* Image Side with Hover-to-Slide Slider */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <ImageSlider images={data.images} title={data.title} />
                            </div>

                            {/* Text Side */}
                            <div className={cn(
                                "text-container w-full md:w-1/2 flex flex-col justify-center",
                                isEven ? "items-start text-left md:pl-4 lg:pl-10" : "items-start md:items-end text-left md:text-right md:pr-4 lg:pr-10"
                            )}>
                                {/* Number Badge */}
                                <div className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-md mb-6 md:mb-8">
                                    <span className="font-plusJakarta font-bold text-white text-lg lg:text-xl">
                                        {data.number}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-plusJakarta font-bold text-2xl sm:text-3xl lg:text-4xl text-primary mb-4">
                                    {data.title}
                                </h3>

                                {/* Description */}
                                <p className="font-plusJakarta font-medium text-sm sm:text-base text-gray-700 leading-relaxed max-w-md">
                                    {data.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}