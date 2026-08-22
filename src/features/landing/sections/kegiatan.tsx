"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const dataKegiatan = [
    {
        title: "Persekutuan Doa",
        number: "1",
        imageUrl: "/images/persekutuan.webp",
        desc: "Merupakan kegiatan ibadah bersama untuk seluruh anggota dan pengurus PMK yang dilaksanakan setiap hari Jumat di masa perkuliahan."
    },
    {
        title: "Camp Daniel",
        number: "2",
        imageUrl: "/images/campdaniel.webp",
        desc: "Kegiatan retret rohani bersama untuk anggota baru PMK Daniel."
    },
    {
        title: "Paskah PMK Daniel",
        number: "3",
        imageUrl: "/images/paskahpmk.webp",
        desc: "Ibadah Paskah bersama untuk anggota dan pengurus PMK Daniel."
    },
    {
        title: "Natal PMK Daniel",
        number: "4",
        imageUrl: "/images/natalpmk.webp",
        desc: "Ibadah Natal bersama untuk anggota dan pengurus PMK Daniel."
    },
]

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

            // Set initial state (Mask reveal from sides)
            gsap.set(imageWrapper, {
                clipPath: isEven ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            });
            gsap.set(innerImage, { scale: 1.15 });
            gsap.set(textContainer, { opacity: 0, x: isEven ? 40 : -40 });

            // Animate reveal
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
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 flex justify-center">
                                <div className="image-wrapper relative w-full aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-[24px] lg:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] group">
                                    <Image
                                        draggable={false}
                                        src={data.imageUrl}
                                        alt={data.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="inner-image select-none object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Text Side */}
                            <div className={cn(
                                "text-container w-full md:w-1/2 flex flex-col justify-center",
                                // Left align on mobile for readability, Zig-Zag alignment on tablet/desktop
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