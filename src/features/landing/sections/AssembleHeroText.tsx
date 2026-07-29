"use client";

import React, { useState, useEffect } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const BLUE = "#3E4095";
const ORANGE = "#F58732";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

const TEXT_LINE1 = "Together to be";
const TEXT_LINE2 = "Better.";

export default function AssembleHeroText() {
  const [displayText1, setDisplayText1] = useState<string[]>(Array(TEXT_LINE1.length).fill('\u00A0'));
  const [displayText2, setDisplayText2] = useState<string[]>(Array(TEXT_LINE2.length).fill('\u00A0'));
  
  useEffect(() => {
    const startTime = Date.now();
    const staggerMs = 100;
    const scrambleDuration = 1500; // Must match the CSS drawStroke animation duration

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

      if (allDone) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative z-10 w-full flex flex-col items-center justify-center select-none"
      role="heading"
      aria-level={1}
      aria-label="Together to be Better."
    >
      <span className="sr-only">Together to be Better.</span>
      
      <svg 
        viewBox="0 0 1000 300" 
        className="w-full h-auto max-w-[1000px] animate-float-hero" 
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="blue-shine" gradientUnits="userSpaceOnUse" x1="-1000" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={BLUE} />
            <stop offset="45%" stopColor={BLUE} />
            <stop offset="50%" stopColor="#A5A7FF" />
            <stop offset="55%" stopColor={BLUE} />
            <stop offset="100%" stopColor={BLUE} />
            <animate attributeName="x1" values="-1000; 2000" dur="12s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0; 3000" dur="12s" repeatCount="indefinite" />
          </linearGradient>

          <linearGradient id="orange-shine" gradientUnits="userSpaceOnUse" x1="-1000" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={ORANGE} />
            <stop offset="45%" stopColor={ORANGE} />
            <stop offset="50%" stopColor="#FFD6A5" />
            <stop offset="55%" stopColor={ORANGE} />
            <stop offset="100%" stopColor={ORANGE} />
            <animate attributeName="x1" values="-1000; 2000" dur="12s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0; 3000" dur="12s" repeatCount="indefinite" />
          </linearGradient>

          <style>{`
            .sketch-letter-blue {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              fill-opacity: 0;
              fill: url(#blue-shine);
              stroke: ${BLUE};
              stroke-width: 2px;
              animation: 
                drawStroke 1.5s ease-in-out forwards,
                fillIn 0.5s ease-out forwards,
                glowBlue 4s ease-in-out infinite alternate;
            }
            
            .sketch-letter-orange {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              fill-opacity: 0;
              fill: url(#orange-shine);
              stroke: ${ORANGE};
              stroke-width: 2px;
              animation: 
                drawStroke 1.5s ease-in-out forwards,
                fillIn 0.5s ease-out forwards,
                glowOrange 4s ease-in-out infinite alternate;
            }
            
            @keyframes drawStroke {
              to { stroke-dashoffset: 0; }
            }
            
            @keyframes fillIn {
              to { fill-opacity: 1; }
            }

            @keyframes glowBlue {
              0% { filter: drop-shadow(0px 0px 0px rgba(62,64,149,0)); }
              100% { filter: drop-shadow(0px 0px 12px rgba(62,64,149,0.8)); }
            }

            @keyframes glowOrange {
              0% { filter: drop-shadow(0px 0px 0px rgba(245,135,50,0)); }
              100% { filter: drop-shadow(0px 0px 12px rgba(245,135,50,0.8)); }
            }
            
            @keyframes floatHero {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            
            .animate-float-hero {
              animation: floatHero 10s ease-in-out infinite;
            }
          `}</style>
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
              style={{ animationDelay: `${i * 0.1}s, ${i * 0.1 + 1.5}s, ${i * 0.1 + 2.0}s` }}
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
          {TEXT_LINE2.split('').map((char, i) => {
            const globalI = i + TEXT_LINE1.length;
            return (
              <tspan
                key={`l2-${i}`}
                className={char === ' ' ? '' : 'sketch-letter-orange'}
                style={{ animationDelay: `${globalI * 0.1}s, ${globalI * 0.1 + 1.5}s, ${globalI * 0.1 + 2.0}s` }}
              >
                {char === ' ' ? ' ' : displayText2[i]}
              </tspan>
            );
          })}
        </text>
      </svg>
    </div>
  );
}