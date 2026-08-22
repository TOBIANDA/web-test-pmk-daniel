"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Initial state setup for Navbar container (slide down and fade in)
    tl.from(containerRef.current, {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 2.6 // Wait for initial loader panels to open (based on landing page timing)
    });

    // Stagger in the links
    tl.from(linksRef.current, {
      y: 15,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.6");

    // Fade in the button
    tl.from(buttonRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)"
    }, "-=0.4");

    // Logo image instant appear
    gsap.set(logoImgRef.current, { opacity: 0 });
    gsap.to(logoImgRef.current, {
      opacity: 1,
      duration: 0,
      delay: 2.6
    });

  });

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(mobileMenuRef.current, {
        y: 0,
        autoAlpha: 1, // handles opacity and visibility
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        y: -20,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, { dependencies: [isOpen] });

  const addLinkRef = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[85%] lg:w-[80%]">
      
      <div 
        ref={containerRef}
        className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] px-6 py-5 flex items-center justify-between"
      >
        
        {/* Kiri: Logo */}
        <div className="flex items-center cursor-pointer relative group p-1">
          <img 
            draggable="false"
            ref={logoImgRef}
            src="/logo.png" 
            alt="Logo PMK" 
            className="select-none size-12 lg:size-14 object-contain relative z-10 bg-white rounded-full" 
          />
        </div>

        {/* Tengah: Links Desktop */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-gray-800">
          <a ref={addLinkRef} href="/" className="hover:text-[#3E4095] transition-colors">Beranda</a>
          <a ref={addLinkRef} href="/tentang" className="hover:text-[#3E4095] transition-colors">Tentang Kami</a>
          <a ref={addLinkRef} href="/pengumuman" className="hover:text-[#3E4095] transition-colors">Pengumuman</a>
          <a ref={addLinkRef} href="/pengurus" className="hover:text-[#3E4095] transition-colors">Kepengurusan</a>
          <a ref={addLinkRef} href="/join" className="hover:text-[#3E4095] transition-colors">Form & Pendataan</a>
          <a ref={addLinkRef} href="/kontak" className="hover:text-[#3E4095] transition-colors">Kontak</a>
        </div>

        {/* Kanan: Button & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <Button 
            ref={buttonRef}
            className="hidden lg:flex shadow-lg"
            onClick={() => window.location.href = '/join'}
          >
            Join Us!
          </Button>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-2 text-gray-800 focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className="lg:hidden absolute top-full left-0 w-full mt-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-6 flex flex-col space-y-4 text-center text-sm font-semibold text-gray-800 invisible opacity-0 translate-y-[-20px]"
      >
        <a href="/" className="hover:text-[#3E4095]">Beranda</a>
        <a href="/tentang" className="hover:text-[#3E4095]">Tentang Kami</a>
        <a href="/pengumuman" className="hover:text-[#3E4095]">Pengumuman</a>
        <a href="/pengurus" className="hover:text-[#3E4095]">Kepengurusan</a>
        <a href="/join" className="hover:text-[#3E4095]">Form & Pendataan</a>
        <a href="/kontak" className="hover:text-[#3E4095]">Kontak</a>
        <Button className="w-full mt-4" onClick={() => window.location.href = '/join'}>
          Join Us!
        </Button>
      </div>
    </nav>
  );
}