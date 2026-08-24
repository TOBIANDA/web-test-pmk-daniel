"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users, Layers, ShieldCheck } from "lucide-react";
import { Divisi } from "@/types/pengurus";
import { pengurusService, DEFAULT_DIVISIONS } from "@/services/pengurusService";
import OrgChartTree from "./components/OrgChartTree";
import DivisionModal from "./components/DivisionModal";

export default function PengurusPage() {
  const [divisions, setDivisions] = useState<Divisi[]>(DEFAULT_DIVISIONS);
  const [selectedDivision, setSelectedDivision] = useState<Divisi | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await pengurusService.getAllDivisions();
        if (data && data.length > 0) {
          setDivisions(data);
        }
      } catch (err) {
        console.error("Failed to load pengurus data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectDivision = (div: Divisi) => {
    setSelectedDivision(div);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#E2E2EF]/60 via-[#FFFFFF] to-[#FFEED0]/60 font-plusJakarta text-slate-900 overflow-hidden pb-24">
      {/* Decorative background blurs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-primary/10 via-secondary/15 to-amber-200/20 blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32">
        
        {/* Back Navigation Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Link>

        {/* Page Titles matching Figma */}
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="font-plusJakarta text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 uppercase">
            KEPENGURUSAN PMK DANIEL
          </h1>
          <p className="font-plusJakarta text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
            Struktur Organisasi
          </p>
        </div>

        {/* Main Interactive Org Chart Card */}
        <div className="relative w-full rounded-[36px] bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_12px_40px_rgba(30,58,138,0.06)] p-6 sm:p-10 overflow-hidden">
          
          {/* Card Header Hint */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-slate-100 text-xs text-slate-500 font-semibold">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold">
              <Sparkles size={14} /> Periode Pelayanan 2025/2026
            </span>
            <span className="text-slate-400 text-center sm:text-right text-[11px] sm:text-xs">
              💡 <strong>Petunjuk:</strong> Klik salah satu logo/divisi untuk membuka kartu detail & susunan anggotanya.
            </span>
          </div>

          {/* Org Chart Interactive Graph */}
          <OrgChartTree
            divisions={divisions}
            onSelectDivision={handleSelectDivision}
          />
        </div>

      </div>

      {/* Pop up Modal Card for Division Profile & Members */}
      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDivision(null);
        }}
        division={selectedDivision}
      />
    </div>
  );
}
