"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import About from "./sections/about";
import CTA from "./sections/cta";
import Hero from "./sections/hero";
import Kegiatan from "./sections/kegiatan";
import Pengumuman from "./sections/pengumuman";
import Sambutan from "./sections/sambutan";

export default function LandingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        // Prevent scrolling and force window to top
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
        
        // Panels start opening at 1.82s (0.7 * 2.6s). We mount the page exactly then!
        const contentTimer = setTimeout(() => {
            setIsContentVisible(true);
            window.scrollTo(0, 0);
        }, 1820); 

        const timer = setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "unset";
            window.scrollTo(0, 0);
        }, 2600); 

        return () => {
            clearTimeout(contentTimer);
            clearTimeout(timer);
            document.body.style.overflow = "unset";
        };
    }, []);

    // Normalized Timings (Total: 2.6s)
    // 0.0 - 0.25: Dots slide in
    // 0.25 - 0.35: Dots squish to 0
    // 0.35 - 0.45: Line spreads 0% -> 100%, Text fades in
    // 0.45 - 0.70: Hold and read text
    // 0.70 - 1.00: Panels slide apart revealing homepage

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loader"
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none"
                    >
                        {/* TOP PANEL */}
                        <motion.div
                            className="absolute inset-x-0 top-0 h-[50vh] bg-white flex items-end justify-center overflow-hidden"
                            initial={{ y: "0%" }}
                            animate={{ y: ["0%", "0%", "-100%"] }}
                            transition={{ duration: 2.6, times: [0, 0.7, 1], ease: "easeInOut" }}
                        >
                            {/* Top glowing split line */}
                            <motion.div 
                                className="w-[80%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 2.6, times: [0, 0.4, 0.7], ease: "easeInOut" }}
                            />
                        </motion.div>

                        {/* BOTTOM PANEL */}
                        <motion.div
                            className="absolute inset-x-0 bottom-0 h-[50vh] bg-white flex items-start justify-center overflow-hidden"
                            initial={{ y: "0%" }}
                            animate={{ y: ["0%", "0%", "100%"] }}
                            transition={{ duration: 2.6, times: [0, 0.7, 1], ease: "easeInOut" }}
                        >
                            {/* Bottom glowing split line */}
                            <motion.div 
                                className="w-[80%] h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
                                transition={{ duration: 2.6, times: [0, 0.4, 0.7], ease: "easeInOut" }}
                            />
                        </motion.div>

                        {/* LOGO AND BRANDING CONTAINER (Front Layer) */}
                        <motion.div 
                            className="relative z-[110] flex flex-col items-center justify-center gap-8"
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: [1, 1, 0], scale: [1, 1, 1.5] }} // Zoom in and fade out right before split
                            transition={{ duration: 2.6, times: [0, 0.6, 0.7], ease: "easeInOut" }}
                        >
                            {/* Glowing Aura Behind Logo */}
                            <motion.div 
                                className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[60px]"
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Center Logo */}
                            <motion.img 
                                src="/logo.svg" 
                                alt="Logo PMK Daniel" 
                                className="w-32 h-32 md:w-44 md:h-44 relative z-10 drop-shadow-xl"
                                initial={{ opacity: 0, y: 30, filter: "blur(15px)" }}
                                animate={{ 
                                    opacity: [0, 1, 1], 
                                    y: [30, 0, 0], 
                                    filter: ["blur(15px)", "blur(0px)", "blur(0px)"] 
                                }}
                                transition={{ duration: 2.6, times: [0, 0.3, 1], ease: "easeOut" }}
                            />

                            {/* Organization Name */}
                            <motion.div 
                                className="flex flex-col items-center relative z-10"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: [0, 1, 1], y: [15, 0, 0] }}
                                transition={{ duration: 2.6, times: [0, 0.4, 1], ease: "easeOut" }}
                            >
                                <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-[0.25em] uppercase font-plusJakarta">
                                    PMK Daniel
                                </h1>
                                <p className="text-gray-500 font-semibold tracking-[0.3em] text-xs md:text-sm mt-3 uppercase">
                                    FILKOM UB
                                </p>
                            </motion.div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Content */}
            {isContentVisible ? (
                <div className="w-full relative z-10">
                    <Hero />
                    <About />
                    <Sambutan />
                    <Kegiatan />
                    <Pengumuman />
                    <CTA />
                </div>
            ) : (
                /* Placeholder block to push Footer down while panels are closed */
                <div className="w-full h-screen bg-transparent pointer-events-none" />
            )}
        </>
    );
}