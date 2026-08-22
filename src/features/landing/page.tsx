"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Pengumuman as PengumumanType } from "@/types/pengumuman";
import About from "./sections/about";
import CTA from "./sections/cta";
import Hero from "./sections/hero";
import Kegiatan from "./sections/kegiatan";
import Pengumuman from "./sections/pengumuman";
import Sambutan from "./sections/sambutan";

gsap.registerPlugin(useGSAP);

interface LandingPageProps {
    pengumumanData: PengumumanType[];
}

export default function LandingPage({ pengumumanData }: LandingPageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);

    const loaderRef = useRef<HTMLDivElement>(null);
    const topPanelRef = useRef<HTMLDivElement>(null);
    const bottomPanelRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const pmkTextRef = useRef<HTMLHeadingElement>(null);
    const danielTextRef = useRef<HTMLHeadingElement>(null);
    const topSplitRef = useRef<HTMLDivElement>(null);
    const bottomSplitRef = useRef<HTMLDivElement>(null);
    const dotsContainerRef = useRef<HTMLDivElement>(null);
    const blueDotRef = useRef<HTMLDivElement>(null);
    const orangeDotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Prevent scrolling and force window to top
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
        
        // Panels start opening at 1.82s
        const contentTimer = setTimeout(() => {
            setIsContentVisible(true);
            window.scrollTo(0, 0);
        }, 1820); 

        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "";
            window.scrollTo(0, 0);
        }, 2600); 

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(timer);
            document.body.style.overflow = "";
        };
    }, []);

    useGSAP(() => {
        if (!isLoading) return;

        const tl = gsap.timeline();

        // Setup initial states
        gsap.set([topSplitRef.current, bottomSplitRef.current], { width: "0%" });
        gsap.set(logoRef.current, { opacity: 0, scale: 0.9 }); 
        gsap.set([pmkTextRef.current, danielTextRef.current], { opacity: 0, scale: 0.95, filter: "blur(10px)" });
        gsap.set(pmkTextRef.current, { y: 10 });
        gsap.set(danielTextRef.current, { y: -10 });
        
        // Dots start in the exact center
        gsap.set(dotsContainerRef.current, { rotation: 0 });
        gsap.set(blueDotRef.current, { x: 0, y: 0, scale: 0, opacity: 0 });
        gsap.set(orangeDotRef.current, { x: 0, y: 0, scale: 0, opacity: 0 });

        // Phase 1: Dots bloom out from the center (0s -> 0.4s)
        tl.to(blueDotRef.current, { x: -30, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, 0);
        tl.to(orangeDotRef.current, { x: 30, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, 0);

        // Phase 2: Elegant swap/orbit (0.4s -> 0.9s)
        tl.to(dotsContainerRef.current, { rotation: 180, duration: 0.5, ease: "back.inOut(1.2)" }, 0.4);

        // Phase 3: Merge back to center (0.9s -> 1.15s)
        tl.to(blueDotRef.current, { x: 0, duration: 0.25, ease: "power2.in" }, 0.9);
        tl.to(orangeDotRef.current, { x: 0, duration: 0.25, ease: "power2.in" }, 0.9);

        // Phase 4: Impact & Explosion (1.15s -> 1.55s)
        tl.to([blueDotRef.current, orangeDotRef.current], { scale: 0, opacity: 0, duration: 0.2, ease: "power2.out" }, 1.15);
        tl.to([topSplitRef.current, bottomSplitRef.current], { width: "100%", duration: 0.4, ease: "expo.out" }, 1.15);
        tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }, 1.15); 
        
        tl.to([pmkTextRef.current, danielTextRef.current], { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            filter: "blur(0px)",
            duration: 0.4, 
            ease: "expo.out" 
        }, 1.15);

        // Phase 5: Panels slide apart (1.82s -> 2.6s)
        tl.to(topPanelRef.current, { yPercent: -100, duration: 0.78, ease: "power2.inOut" }, 1.82);
        tl.to(bottomPanelRef.current, { yPercent: 100, duration: 0.78, ease: "power2.inOut" }, 1.82);

    }, { scope: loaderRef, dependencies: [isLoading] });

    return (
        <>
            {isLoading && (
                <div
                    ref={loaderRef}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
                >
                    {/* CENTER DOTS (Moved outside panels to avoid being cut in half) */}
                    <div ref={dotsContainerRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] flex items-center justify-center">
                        <div ref={blueDotRef} className="absolute w-5 h-5 rounded-full bg-primary shadow-lg" />
                        <div ref={orangeDotRef} className="absolute w-5 h-5 rounded-full bg-secondary shadow-lg" />
                    </div>

                    {/* TOP PANEL */}
                    <div
                        ref={topPanelRef}
                        className="relative z-20 w-full h-[50vh] bg-background bg-gradient-to-b from-secondary/30 to-primary/30 bg-[length:100%_100vh] bg-top flex justify-center items-end"
                    >
                        {/* Logo attached to the bottom edge of the top panel */}
                        <img 
                            draggable="false"
                            ref={logoRef}
                            src="/logo.png" 
                            alt="Logo PMK" 
                            className="select-none absolute z-[60] object-contain bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)]"
                            style={{ width: "96px", height: "96px", bottom: "-48px", left: "50%", transform: "translate(-50%, 0)" }}
                        />
                        {/* PMK Text */}
                        <h1 
                            ref={pmkTextRef}
                            className="absolute bottom-24 text-4xl sm:text-6xl font-extrabold text-primary font-plusJakarta tracking-[0.3em]"
                        >
                            PMK
                        </h1>

                        {/* Top Half of the Split Line */}
                        <div 
                            ref={topSplitRef}
                            className="absolute bottom-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
                            style={{ left: "50%", transform: "translate(-50%, 0)" }}
                        />
                    </div>

                    {/* BOTTOM PANEL */}
                    <div
                        ref={bottomPanelRef}
                        className="relative w-full h-[50vh] bg-background bg-gradient-to-b from-secondary/30 to-primary/30 bg-[length:100%_100vh] bg-bottom flex justify-center items-start"
                    >
                        {/* DANIEL Text */}
                        <h1 
                            ref={danielTextRef}
                            className="absolute top-24 text-4xl sm:text-6xl font-extrabold text-secondary font-plusJakarta tracking-[0.3em]"
                        >
                            DANIEL
                        </h1>

                        {/* Bottom Half of the Split Line */}
                        <div 
                            ref={bottomSplitRef}
                            className="absolute top-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
                            style={{ left: "50%", transform: "translate(-50%, 0)" }}
                        />
                    </div>
                </div>
            )}

            {/* Page Content */}
            {isContentVisible ? (
                <div className="w-full relative z-10">
                    <Hero />
                    <About />
                    <Sambutan />
                    <Kegiatan />
                    <Pengumuman data={pengumumanData} />
                    <CTA />
                </div>
            ) : (
                /* Placeholder block to push Footer down while panels are closed */
                <div className="w-full h-screen bg-transparent pointer-events-none" />
            )}
        </>
    );
}