"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax & Reveal for Image
    gsap.fromTo(imageRef.current, 
      { y: 50, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Staggered reveal for text elements
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    tl.fromTo(badgeRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(titleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(lineRef.current,
      { height: 0 },
      { height: "100%", duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo(descRef.current,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="about" className="w-[85%] lg:w-[80%] py-24 md:py-32 mx-auto relative overflow-hidden">
      
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Image */}
        <div className="w-full lg:w-1/2 relative">
          {/* Decorative background element behind image */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl md:rounded-3xl transform -rotate-3 z-0"></div>
          
          <div 
            ref={imageRef}
            className="relative z-10 w-full overflow-hidden shadow-[0_20px_50px_rgba(62,64,149,0.15)] rounded-2xl md:rounded-3xl border border-white/50 bg-white"
          >
            {/* The image component */}
            <div className="relative w-full aspect-[16/10] md:aspect-[4/3]">
              <Image 
                draggable={false}
                src="/About-us pic.png" 
                alt="Foto Bersama PMK Daniel" 
                fill
                className="select-none object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Text */}
        <div ref={textRef} className="w-full lg:w-1/2 flex flex-col items-start">
          
          {/* Badge */}
          <span 
            ref={badgeRef}
            className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-6"
          >
            Siapa Kami
          </span>

          {/* Title */}
          <h2 
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3E4095] mb-8 font-plusJakarta leading-tight"
          >
            Tentang PMK <br className="hidden lg:block" /> Daniel
          </h2>

          {/* Description with Left Border Accent */}
          <div className="relative pl-6 sm:pl-8">
            <div ref={lineRef} className="absolute left-0 top-0 w-1 sm:w-1.5 bg-gradient-to-b from-[#F58732] to-[#3E4095] rounded-full"></div>
            <p 
              ref={descRef}
              className="text-sm sm:text-base font-medium leading-relaxed text-gray-700 text-justify"
            >
              Persekutuan Mahasiswa Kristen Daniel Fakultas Ilmu Komputer Universitas Brawijaya (PMK Daniel FILKOM UB), yang berdiri sejak tahun 2013, bertujuan untuk membentuk mahasiswa Kristen di FILKOM UB agar memiliki karakter Kristus, unggul dibidangnya, serta mampu menjadi berkat dan memberi dampak positif bagi lingkungan sekitarnya.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}