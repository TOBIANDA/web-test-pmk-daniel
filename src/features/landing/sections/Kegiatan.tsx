"use client";

import React, { useRef, useState, useCallback } from "react";
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
            "/images/natalpmk.webp",
        ],
        desc: "Ibadah Natal bersama untuk anggota dan pengurus PMK Daniel."
    },
];

// Premium Intuitive Image Slider with Hand Cursor, Click Navigation & Swipe
function ImageSlider({ images, title }: { images: string[]; title: string }) {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartXRef = useRef<number>(0);

    const hasMultiple = images.length > 1;

    const prevSlide = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const nextSlide = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrent((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goTo = useCallback((index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrent(index);
    }, []);

    // Click on image halves (left = prev, right = next)
    const onCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!hasMultiple || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        if (relativeX < rect.width / 2) {
            prevSlide();
        } else {
            nextSlide();
        }
    }, [hasMultiple, prevSlide, nextSlide]);

    // Touch swipe support for mobile
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartXRef.current = e.touches[0].clientX;
    }, []);

    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!hasMultiple) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartXRef.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }, [hasMultiple, prevSlide, nextSlide]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "image-wrapper relative w-full aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none",
                hasMultiple ? "cursor-pointer group" : ""
            )}
            onClick={onCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Images transition */}
            {images.map((src, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none",
                        i === current ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Image
                        draggable={false}
                        src={src}
                        alt={`${title} ${i + 1}`}
                        fill
                        className="inner-image select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>
            ))}

            {/* Clickable Arrow Controls */}
            {hasMultiple && (
                <>
                    {/* Previous Button (Left) */}
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                        aria-label="Foto sebelumnya"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>

                    {/* Next Button (Right) */}
                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-primary flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                        aria-label="Foto berikutnya"
                    >
                        <ChevronRight size={22} strokeWidth={2.5} />
                    </button>

                    {/* Counter Badge */}
                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {current + 1} / {images.length}
                    </div>

                    {/* Clickable Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={(e) => goTo(i, e)}
                                className={cn(
                                    "rounded-full transition-all duration-300 cursor-pointer",
                                    i === current
                                        ? "w-6 h-2 bg-white shadow-sm"
                                        : "w-2 h-2 bg-white/50 hover:bg-white/90"
                                )}
                                aria-label={`Buka foto ke-${i + 1}`}
                            />
                        ))}
                    </div>
                </>
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
                            {/* Image Side with Clean Slider */}
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