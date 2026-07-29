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
                        {/* THE SLIDING LOGO */}
                        <motion.div
                            className="fixed z-[110] flex items-center justify-center p-2"
                            initial={{ 
                                top: "50%", left: "50%", x: "-50%", y: "-50%", 
                                width: "160px", height: "160px",
                                opacity: 0,
                                filter: "blur(10px)"
                            }}
                            animate={{ 
                                top: ["50%", "50%", "50%", "50%", "36px", "36px"], 
                                left: ["50%", "50%", "50%", "50%", "calc(max(2.5vw, 50vw - 512px) + 24px)", "calc(max(2.5vw, 50vw - 512px) + 24px)"],
                                x: ["-50%", "-50%", "-50%", "-50%", "0%", "0%"],
                                y: ["-50%", "-50%", "-50%", "-50%", "0%", "0%"],
                                width: ["160px", "160px", "160px", "160px", "48px", "48px"],
                                height: ["160px", "160px", "160px", "160px", "48px", "48px"],
                                opacity: [0, 0, 1, 1, 1, 0],
                                filter: ["blur(10px)", "blur(10px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]
                            }}
                            transition={{ duration: 2.6, times: [0, 0.35, 0.45, 0.7, 0.99, 1], ease: "easeInOut" }}
                        >
                            {/* Logo Image */}
                            <img src="/logo.png" alt="Logo PMK" className="w-[80%] h-[80%] object-contain relative z-10 bg-white rounded-full" />
                        </motion.div>
                        {/* TOP PANEL */}
                        <motion.div
                            className="relative w-full h-[50vh] bg-background bg-gradient-to-b from-secondary/30 to-primary/30 bg-[length:100%_100vh] bg-top flex justify-center items-end"
                            initial={{ y: "0%" }}
                            animate={{ y: ["0%", "0%", "-100%"] }}
                            transition={{ duration: 2.6, times: [0, 0.7, 1], ease: "easeInOut" }}
                        >
                            {/* PMK Text */}
                            <motion.h1 
                                className="absolute bottom-8 text-4xl sm:text-6xl font-extrabold text-primary font-plusJakarta tracking-[0.3em]"
                                initial={{ opacity: 0, y: 15, scale: 0.8, filter: "blur(10px)" }}
                                animate={{ 
                                    opacity: [0, 0, 1, 1], 
                                    y: [15, 15, 0, 0],
                                    scale: [0.8, 0.8, 1, 1],
                                    filter: ["blur(10px)", "blur(10px)", "blur(0px)", "blur(0px)"]
                                }}
                                transition={{ duration: 2.6, times: [0, 0.35, 0.45, 1], ease: "easeOut" }}
                            >
                                PMK
                            </motion.h1>

                            {/* Top Half of the Split Line */}
                            <motion.div 
                                className="absolute bottom-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
                                style={{ left: "50%", x: "-50%" }}
                                initial={{ width: "0%" }}
                                animate={{ width: ["0%", "0%", "100%", "100%"] }}
                                transition={{ duration: 2.6, times: [0, 0.35, 0.45, 1], ease: "easeInOut" }}
                            />
                            
                            {/* Blue Dot (Left) */}
                            <motion.div
                                className="absolute w-6 h-6 rounded-full bg-primary z-10"
                                style={{ left: "50%", marginLeft: "-12px", bottom: "-12px" }}
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ 
                                    x: [-100, 0, 0, 0], 
                                    scale: [1, 1, 0, 0],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{ duration: 2.6, times: [0, 0.1, 0.25, 0.35], ease: "easeInOut" }}
                            />
                        </motion.div>

                        {/* BOTTOM PANEL */}
                        <motion.div
                            className="relative w-full h-[50vh] bg-background bg-gradient-to-b from-secondary/30 to-primary/30 bg-[length:100%_100vh] bg-bottom flex justify-center items-start"
                            initial={{ y: "0%" }}
                            animate={{ y: ["0%", "0%", "100%"] }}
                            transition={{ duration: 2.6, times: [0, 0.7, 1], ease: "easeInOut" }}
                        >
                            {/* DANIEL Text */}
                            <motion.h1 
                                className="absolute top-8 text-4xl sm:text-6xl font-extrabold text-secondary font-plusJakarta tracking-[0.3em]"
                                initial={{ opacity: 0, y: -15, scale: 0.8, filter: "blur(10px)" }}
                                animate={{ 
                                    opacity: [0, 0, 1, 1], 
                                    y: [-15, -15, 0, 0],
                                    scale: [0.8, 0.8, 1, 1],
                                    filter: ["blur(10px)", "blur(10px)", "blur(0px)", "blur(0px)"]
                                }}
                                transition={{ duration: 2.6, times: [0, 0.35, 0.45, 1], ease: "easeOut" }}
                            >
                                DANIEL
                            </motion.h1>

                            {/* Bottom Half of the Split Line */}
                            <motion.div 
                                className="absolute top-0 h-[2px] bg-gradient-to-r from-primary to-secondary"
                                style={{ left: "50%", x: "-50%" }}
                                initial={{ width: "0%" }}
                                animate={{ width: ["0%", "0%", "100%", "100%"] }}
                                transition={{ duration: 2.6, times: [0, 0.35, 0.45, 1], ease: "easeInOut" }}
                            />
                            
                            {/* Orange Dot (Right) */}
                            <motion.div
                                className="absolute w-6 h-6 rounded-full bg-secondary z-10"
                                style={{ left: "50%", marginLeft: "-12px", top: "-12px" }}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ 
                                    x: [100, 0, 0, 0], 
                                    scale: [1, 1, 0, 0],
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{ duration: 2.6, times: [0, 0.1, 0.25, 0.35], ease: "easeInOut" }}
                            />
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