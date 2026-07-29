"use client";

import { motion } from "framer-motion";
import AssembleHeroText from "./AssembleHeroText";

export default function Hero() {
  return (
    // REVISI 1: Background memutar gradasi utuh agar porsi warna tetap sama
    <section className="relative flex flex-col items-center justify-center min-h-[100vh] px-4 pt-24 pb-24 text-center overflow-hidden bg-white">
      
      {/* Huge Rotating Gradient Background - Matches the original image and spins smoothly */}
      <motion.div 
        className="absolute w-[200vmax] h-[200vmax] bg-gradient-to-r from-[#E2E2EF] from-20% via-[#FFFFFF] via-50% to-[#FFEED0] to-80% z-0"
        style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Abstract Animated Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3E4095" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#3E4095" stopOpacity="1" />
            <stop offset="100%" stopColor="#F58732" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F58732" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#F58732" stopOpacity="1" />
            <stop offset="100%" stopColor="#3E4095" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <motion.path 
          d="M-200 600 C 200 400, 600 800, 1000 500 S 1400 300, 1600 400"
          stroke="url(#lineGrad1)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.path 
          d="M-200 300 C 300 500, 700 100, 1100 400 S 1400 600, 1600 500"
          stroke="url(#lineGrad2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 7, delay: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 mb-6 text-lg font-bold tracking-widest text-black-500 uppercase"
      >
        PMK Daniel FILKOM UB
      </motion.p>

      {/* Judul Utama (Tagline) with Futuristic Vector Assemble Effect */}
      <AssembleHeroText />

      {/* padding vertikal (py-4) - Marquee effect (Pure CSS for zero lag) */}
     <div className="absolute bottom-0 left-0 flex w-full py-4 overflow-hidden bg-white border-t border-b border-gray-200 z-10">
        <style>{`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-marquee-smooth {
            animation: marquee 25s linear infinite;
            will-change: transform;
          }
        `}</style>
        <div className="flex items-center w-max whitespace-nowrap animate-marquee-smooth">
          {/* Duplicate content to create a seamless infinite loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <span className="px-8 text-sm font-medium text-gray-800 md:text-base">
                "Tuhan adalah gembalaku, takkan kekurangan aku." — Mazmur 23:1 
              </span>
              
              <img 
                src="/icon-cross.svg" 
                alt="Pembatas Ayat" 
                className="inline-block w-5 h-auto opacity-80 invert" 
              /> 
              
              <span className="px-8 text-sm font-medium text-gray-800 md:text-base">
                "Jangan takut, sebab Aku menyertai engkau." — Yesaya 41:10
              </span>

              {/* Cross image at the end of the block so it loops smoothly to the next block */}
              <img 
                src="/icon-cross.svg" 
                alt="Pembatas Ayat" 
                className="inline-block w-5 h-auto opacity-80 invert" 
              /> 
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}