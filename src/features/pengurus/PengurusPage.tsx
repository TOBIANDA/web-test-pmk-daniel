"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users, Crown, Shield, Layers, Award } from "lucide-react";
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

  const totalMembers = divisions.reduce((acc, d) => acc + (d.members?.length || 0), 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#E2E2EF]/70 via-[#FFFFFF] to-[#FFEED0]/60 font-plusJakarta text-slate-900 overflow-hidden pb-28">
      {/* Decorative Grand Ambient Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-primary/15 via-secondary/20 to-amber-300/25 blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-64 right-[-100px] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36">
        
        {/* Back Navigation Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white text-xs sm:text-sm font-bold text-slate-700 hover:text-primary border border-white/80 shadow-sm backdrop-blur-md transition-all mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* ========================================================================= */}
        {/* 👑 GRAND MAJESTIC HERO TITLE SECTION */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          
          {/* Top Royal Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-primary/20 shadow-[0_4px_20px_rgba(30,58,138,0.08)] backdrop-blur-md text-primary text-xs font-black uppercase tracking-widest mb-4 animate-fadeIn">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span>Keluarga Besar Pelayanan • Periode 2025/2026</span>
          </div>

          {/* Majestic Main Headline */}
          <h1 className="font-plusJakarta text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.08] drop-shadow-sm">
            <span className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] bg-clip-text text-transparent">
              KEPENGURUSAN
            </span>{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-primary bg-clip-text text-transparent">
              PMK DANIEL
            </span>
          </h1>

          {/* Subtitle & Biblical Verse / Spirit */}
          <p className="mt-4 font-plusJakarta text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
            Satu tubuh di dalam Kristus, bertumbuh dan melayani bersama dengan segenap hati untuk kemuliaan nama Tuhan di FILKOM Universitas Brawijaya.
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200/60 w-full max-w-xl">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
              <Crown size={15} className="text-amber-500" />
              <span>1 Badan Pengurus Harian</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
              <Layers size={15} className="text-blue-600" />
              <span>4 Komisi Utama</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
              <Users size={15} className="text-emerald-600" />
              <span>{totalMembers} Pengurus Terdaftar</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 📊 MAIN INTERACTIVE ORG CHART CONTAINER CARD */}
        {/* ========================================================================= */}
        <div className="relative w-full rounded-[40px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_60px_rgba(30,58,138,0.08)] p-6 sm:p-10 lg:p-12 overflow-hidden">
          
          {/* Top Card Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-inner">
                <Award size={20} />
              </div>
              <div>
                <h2 className="font-plusJakarta text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  Struktur Organisasi & Hubungan Koordinasi
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Bagan kepemimpinan, komisi pelayanan, dan sub-divisi operasional
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
              <span>💡</span>
              <span>Klik salah satu logo/divisi untuk melihat profil komisi & anggotanya.</span>
            </div>
          </div>

          {/* Org Chart Interactive Graph / Mobile Hierarchical Flow */}
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
