"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// ─── Config ───────────────────────────────────────────────────────────────────
const BLUE = "#3E4095";
const ORANGE = "#F58732";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const TEXT_LINE1 = "Together to be";
const TEXT_LINE2 = "Better.";

export default function AssembleHeroText() {
  const [displayText1, setDisplayText1] = useState<string[]>(Array(TEXT_LINE1.length).fill('\u00A0'));
  const [displayText2, setDisplayText2] = useState<string[]>(Array(TEXT_LINE2.length).fill('\u00A0'));
  
  const svgRef = useRef<SVGSVGElement>(null);
  const blueGradRef = useRef<SVGLinearGradientElement>(null);
  const orangeGradRef = useRef<SVGLinearGradientElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const staggerMs = 100;
    const scrambleDuration = 1500; // Must match the stroke duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let allDone = true;

      const nextText1 = TEXT_LINE1.split('').map((char, i) => {
        if (char === ' ') return ' ';
        const charStartTime = i * staggerMs;
        const charEndTime = charStartTime + scrambleDuration;
        
        if (elapsed < charStartTime) {
          allDone = false;
          return '\u00A0';
        }
        if (elapsed >= charEndTime) {
          return char;
        }
        allDone = false;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      const nextText2 = TEXT_LINE2.split('').map((char, i) => {
        if (char === ' ') return ' ';
        const globalI = i + TEXT_LINE1.length;
        const charStartTime = globalI * staggerMs;
        const charEndTime = charStartTime + scrambleDuration;
        
        if (elapsed < charStartTime) {
          allDone = false;
          return '\u00A0';
        }
        if (elapsed >= charEndTime) {
          return char;
        }
        allDone = false;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplayText1(nextText1);
      setDisplayText2(nextText2);

      if (allDone) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    // 1. Float Hero Animation
    gsap.to(svgRef.current, {
      y: -8,
      duration: 5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // 2. Linear Gradient Animations (Shine Effect)
    const grads = [blueGradRef.current, orangeGradRef.current];
    gsap.to(grads, {
      attr: { x1: 2000, x2: 3000 },
      duration: 12,
      repeat: -1,
      ease: "none"
    });

    // 3. Letters Animation (Stroke Draw, Fill, Glow)
    const blueLetters = gsap.utils.toArray('.sketch-letter-blue', svgRef.current);
    const orangeLetters = gsap.utils.toArray('.sketch-letter-orange', svgRef.current);
    const allLetters = [...blueLetters, ...orangeLetters];

    // Initial CSS Setup for SVG strokes
    gsap.set(allLetters, {
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      fillOpacity: 0
    });

    allLetters.forEach((letter: any, i) => {
      const delay = i * 0.1;
      
      // Draw & Fill Timeline
      const tl = gsap.timeline({ delay });
      tl.to(letter, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power1.inOut"
      })
      .to(letter, {
        fillOpacity: 1,
        duration: 0.5,
        ease: "power1.out"
      }, "-=0.2"); // Slight overlap with the draw stroke

      // Continuous Glow Animation
      const isBlue = letter.classList.contains('sketch-letter-blue');
      const glowColor = isBlue ? "rgba(62,64,149,0.8)" : "rgba(245,135,50,0.8)";
      
      gsap.to(letter, {
        filter: `drop-shadow(0px 0px 12px ${glowColor})`,
        duration: 4,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: delay + 2.0 // Starts glowing after it finishes filling
      });
    });
  }, { scope: svgRef });

  return (
    <div
      className="relative z-10 w-full flex flex-col items-center justify-center select-none"
      role="heading"
      aria-level={1}
      aria-label="Together to be Better."
    >
      <span className="sr-only">Together to be Better.</span>
      
      <svg 
        ref={svgRef}
        viewBox="0 0 1000 300" 
        className="w-full h-auto max-w-[1000px] scale-[1.3] sm:scale-100" 
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient ref={blueGradRef} id="blue-shine" gradientUnits="userSpaceOnUse" x1="-1000" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="45%" stopColor={BLUE} />
            <stop offset="50%" stopColor="#A5A7FF" />
            <stop offset="55%" stopColor={BLUE} />
            <stop offset="100%" stopColor={BLUE} />
          </linearGradient>

          <linearGradient ref={orangeGradRef} id="orange-shine" gradientUnits="userSpaceOnUse" x1="-1000" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={ORANGE} />
            <stop offset="45%" stopColor={ORANGE} />
            <stop offset="50%" stopColor="#FFD6A5" />
            <stop offset="55%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={ORANGE} />
          </linearGradient>
        </defs>

        <text 
          x="500" 
          y="140" 
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800" 
          fontSize="75" 
          textAnchor="middle"
        >
          {TEXT_LINE1.split('').map((char, i) => (
            <tspan
              key={`l1-${i}`}
              className={char === ' ' ? '' : 'sketch-letter-blue'}
              style={{ fill: "url(#blue-shine)", stroke: BLUE, strokeWidth: "2px" }}
            >
              {char === ' ' ? ' ' : displayText1[i]}
            </tspan>
          ))}
        </text>

        <text 
          x="500" 
          y="230" 
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="75" 
          textAnchor="middle"
        >
          {TEXT_LINE2.split('').map((char, i) => (
            <tspan
              key={`l2-${i}`}
              className={char === ' ' ? '' : 'sketch-letter-orange'}
              style={{ fill: "url(#orange-shine)", stroke: ORANGE, strokeWidth: "2px" }}
            >
              {char === ' ' ? ' ' : displayText2[i]}
            </tspan>
          ))}
        </text>
      </svg>
    </div>
  );
}