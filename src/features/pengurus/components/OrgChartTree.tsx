"use client";

import React, { useState } from "react";
import { Divisi } from "@/types/pengurus";
import { getDivisionIcon } from "./DivisionModal";
import { ChevronRight, Layers, LayoutGrid, Network } from "lucide-react";

interface OrgChartTreeProps {
  divisions: Divisi[];
  onSelectDivision: (division: Divisi) => void;
}

export default function OrgChartTree({
  divisions,
  onSelectDivision,
}: OrgChartTreeProps) {
  // Mode switcher for mobile: "list" (hierarchical flow) or "tree" (full diagram pan)
  const [mobileViewMode, setMobileViewMode] = useState<"flow" | "tree">("flow");

  // Helper to find division by id or name
  const findDiv = (idOrName: string, defaultName: string = "") => {
    return (
      divisions.find((d) => d.id === idOrName) ||
      divisions.find((d) => d.name.toLowerCase().includes(idOrName.toLowerCase())) || {
        id: idOrName,
        name: defaultName || idOrName,
        komisi: "",
        icon_name: "sparkles",
        description: "",
        order_priority: 99,
        members: [],
      }
    );
  };

  const ketuaUmum = findDiv("ketua_umum", "Ketua Umum");
  const wakilKetuaUmum = findDiv("wakil_ketua_umum", "Wakil Ketua Umum");
  const sekretaris = findDiv("sekretaris", "Sekretaris");
  const bendahara = findDiv("bendahara", "Bendahara");

  const pembinaan = findDiv("pembinaan", "Pembinaan");
  const pemerhati = findDiv("pemerhati", "Pemerhati");
  const acara = findDiv("acara", "Acara");
  const mediaRelasi = findDiv("media_relasi", "Media & Relasi");

  const teknisInventaris = findDiv("teknis_inventaris", "Teknis & Inventaris");
  const acaraSub = findDiv("acara_sub", "Acara");
  const minatBakat = findDiv("minat_bakat", "Minat Bakat & Misi Pelayanan");
  const media = findDiv("media", "Media");
  const relasi = findDiv("relasi", "Relasi");

  const renderDesktopButton = (
    div: Divisi,
    labelOverride?: string,
    isSubDivision: boolean = false
  ) => {
    const displayName = labelOverride || div.name;
    return (
      <button
        onClick={() => onSelectDivision(div)}
        className={`group relative flex items-center gap-3 h-[48px] px-3.5 w-full rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left ${
          isSubDivision
            ? "bg-white/95 hover:bg-primary text-slate-800 hover:text-white border-2 border-dashed border-primary/40 hover:border-solid hover:border-primary"
            : "bg-white hover:bg-primary text-slate-900 hover:text-white border-2 border-primary/40 hover:border-primary"
        }`}
        title={`Klik untuk melihat profil & anggota ${displayName}`}
      >
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
            isSubDivision
              ? "bg-slate-100 group-hover:bg-white/20 text-primary group-hover:text-white"
              : "bg-primary/10 group-hover:bg-white/20 text-primary group-hover:text-white"
          }`}
        >
          {getDivisionIcon(div.icon_name, "size-4")}
        </div>
        <span className="font-plusJakarta font-bold text-xs sm:text-sm truncate tracking-tight">
          {displayName}
        </span>
      </button>
    );
  };

  const renderMobileCard = (
    div: Divisi,
    labelOverride?: string,
    subtitle?: string,
    isSub: boolean = false
  ) => {
    const displayName = labelOverride || div.name;
    const count = div.members?.length || 0;
    return (
      <button
        onClick={() => onSelectDivision(div)}
        className={`group flex items-center justify-between w-full p-3.5 rounded-2xl transition-all active:scale-[0.98] text-left shadow-sm ${
          isSub
            ? "bg-white hover:bg-primary text-slate-800 hover:text-white border border-dashed border-primary/40 hover:border-solid hover:border-primary"
            : "bg-white hover:bg-primary text-slate-900 hover:text-white border border-primary/30 hover:border-primary"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-white/20 text-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
            {getDivisionIcon(div.icon_name, "size-5")}
          </div>
          <div className="min-w-0">
            <h3 className="font-plusJakarta font-extrabold text-sm truncate leading-tight group-hover:text-white">
              {displayName}
            </h3>
            <p className="font-plusJakarta text-[11px] text-slate-500 group-hover:text-white/80 font-medium truncate mt-0.5">
              {subtitle || (div.komisi ? `${div.komisi} • ${count} Anggota` : `${count} Anggota`)}
            </p>
          </div>
        </div>

        <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-white/20 text-slate-400 group-hover:text-white shrink-0 ml-2">
          <ChevronRight size={14} />
        </div>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Mobile Mode Switcher (Visible only on mobile < md) */}
      <div className="flex md:hidden items-center justify-center p-1 bg-slate-100 rounded-full border border-slate-200 mb-6 max-w-xs w-full shadow-inner">
        <button
          onClick={() => setMobileViewMode("flow")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold font-plusJakarta transition-all ${
            mobileViewMode === "flow"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers size={14} />
          <span>Alur Hirarki</span>
        </button>
        <button
          onClick={() => setMobileViewMode("tree")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold font-plusJakarta transition-all ${
            mobileViewMode === "tree"
              ? "bg-white text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Network size={14} />
          <span>Bagan Pohon</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: HIERARCHICAL VERTICAL FLOW (Active on Mobile if mode is "flow") */}
      {/* ========================================================================= */}
      <div className={`w-full flex-col gap-6 ${mobileViewMode === "flow" ? "flex md:hidden" : "hidden"}`}>
        
        {/* Section 1: Badan Pengurus Harian (BPH) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Badan Pengurus Harian (BPH)
            </h2>
          </div>

          {/* Ketua Umum */}
          {renderMobileCard(ketuaUmum, "Ketua Umum", "Bastian Nevan Baruch • Pemimpin Utama")}

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40 mx-auto" />

          {/* Wakil Ketua Umum */}
          {renderMobileCard(wakilKetuaUmum, "Wakil Ketua Umum", "Christo Emmanuel • Koordinasi Internal")}

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40 mx-auto" />

          {/* Sekretaris & Bendahara Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderMobileCard(sekretaris, "Sekretaris", "Tata Kelola Administrasi")}
            {renderMobileCard(bendahara, "Bendahara", "Pengelolaan Keuangan")}
          </div>
        </div>

        {/* Section 2: 4 Komisi Utama & Sub-Divisi */}
        <div className="flex flex-col gap-4 mt-2 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Komisi & Bidang Pelayanan
            </h2>
          </div>

          {/* Komisi 1: Pembinaan */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            {renderMobileCard(pembinaan, "Komisi 1: Pembinaan", "Pembinaan Rohani & Karakter")}
          </div>

          {/* Komisi 2: Pemerhati */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80">
            {renderMobileCard(pemerhati, "Komisi 2: Pemerhati", "Doa, Kasih & Konseling")}
          </div>

          {/* Komisi 3: Acara (with nested sub-divisions) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
            {renderMobileCard(acara, "Komisi 3: Acara", "Konsep Liturgi & Ibadah")}

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2 pl-4 ml-3 border-l-2 border-dashed border-primary/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Acara:
              </span>
              {renderMobileCard(teknisInventaris, "Teknis & Inventaris", "Sound System & Logistik", true)}
              {renderMobileCard(acaraSub, "Acara (Pelaksana)", "Rundown & Tata Acara", true)}
              {renderMobileCard(minatBakat, "Minat Bakat & Misi", "Musik, Vokal & Baksos", true)}
            </div>
          </div>

          {/* Komisi 4: Media & Relasi (with nested sub-divisions) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
            {renderMobileCard(mediaRelasi, "Komisi 4: Media & Relasi", "Publikasi & Kemitraan")}

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2 pl-4 ml-3 border-l-2 border-dashed border-primary/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Media & Relasi:
              </span>
              {renderMobileCard(media, "Media Visual", "Foto, Video & Website", true)}
              {renderMobileCard(relasi, "Relasi Eksternal", "Gereja & Alumni", true)}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP TREE VIEW (And Mobile if "tree" mode is selected) */}
      {/* ========================================================================= */}
      <div className={`w-full overflow-x-auto py-4 px-2 justify-center custom-scrollbar ${mobileViewMode === "tree" ? "flex" : "hidden md:flex"}`}>
        <div className="min-w-[1000px] max-w-5xl flex flex-col items-center select-none">
          
          {/* LEVEL 1: KETUA UMUM */}
          <div className="flex flex-col items-center">
            <div className="w-[210px]">
              {renderDesktopButton(ketuaUmum, "Ketua Umum")}
            </div>
            <div className="w-0.5 h-8 bg-primary/50" />
          </div>

          {/* LEVEL 2: BPH */}
          <div className="relative flex items-center justify-center gap-8 w-full max-w-[760px]">
            <div className="absolute top-1/2 left-[90px] right-[90px] h-0.5 bg-primary/50 -translate-y-1/2 -z-0" />

            <div className="relative z-10 w-[190px]">
              {renderDesktopButton(sekretaris, "Sekretaris")}
            </div>

            <div className="relative z-10 w-[220px]">
              {renderDesktopButton(wakilKetuaUmum, "Wakil Ketua Umum")}
            </div>

            <div className="relative z-10 w-[190px]">
              {renderDesktopButton(bendahara, "Bendahara")}
            </div>
          </div>

          <div className="w-0.5 h-10 bg-primary/50" />

          {/* LEVEL 3 & 4: 4 KOMISI SEJAJAR DENGAN SUB-DIVISI VERTIKAL */}
          <div className="relative w-full flex flex-col items-center">
            
            {/* Level 3 Horizontal Main Bus Line */}
            <div className="absolute top-0 left-[110px] right-[110px] h-0.5 bg-primary/50" />

            {/* 4 Equal Commission Columns Grid */}
            <div className="grid grid-cols-4 gap-6 w-full pt-6">
              
              {/* COLUMN 1: Pembinaan */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-full">
                  {renderDesktopButton(pembinaan, "Pembinaan")}
                </div>
              </div>

              {/* COLUMN 2: Pemerhati */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-full">
                  {renderDesktopButton(pemerhati, "Pemerhati")}
                </div>
              </div>

              {/* COLUMN 3: Acara & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-full">
                  {renderDesktopButton(acara, "Acara")}
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    {renderDesktopButton(teknisInventaris, "Teknis & Inventaris", true)}
                  </div>

                  <div className="relative flex items-center w-full">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    {renderDesktopButton(acaraSub, "Acara (Pelaksana)", true)}
                  </div>

                  <div className="relative flex items-center w-full">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    {renderDesktopButton(minatBakat, "Minat Bakat & Misi", true)}
                  </div>
                </div>
              </div>

              {/* COLUMN 4: Media & Relasi & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-full">
                  {renderDesktopButton(mediaRelasi, "Media & Relasi")}
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    {renderDesktopButton(media, "Media", true)}
                  </div>

                  <div className="relative flex items-center w-full">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    {renderDesktopButton(relasi, "Relasi", true)}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
