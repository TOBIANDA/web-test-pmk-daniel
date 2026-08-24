"use client";

import React from "react";
import { Divisi } from "@/types/pengurus";
import { getDivisionIcon } from "./DivisionModal";

interface OrgChartTreeProps {
  divisions: Divisi[];
  onSelectDivision: (division: Divisi) => void;
}

export default function OrgChartTree({
  divisions,
  onSelectDivision,
}: OrgChartTreeProps) {
  // Helper to find division by id or name
  const findDiv = (idOrName: string) => {
    return (
      divisions.find((d) => d.id === idOrName) ||
      divisions.find((d) => d.name.toLowerCase().includes(idOrName.toLowerCase())) || {
        id: idOrName,
        name: idOrName,
        komisi: "",
        icon_name: "sparkles",
        description: "",
        order_priority: 99,
        members: [],
      }
    );
  };

  const ketuaUmum = findDiv("ketua_umum");
  const wakilKetuaUmum = findDiv("wakil_ketua_umum");
  const sekretaris = findDiv("sekretaris");
  const bendahara = findDiv("bendahara");

  const pembinaan = findDiv("pembinaan");
  const pemerhati = findDiv("pemerhati");
  const acara = findDiv("acara");
  const mediaRelasi = findDiv("media_relasi");

  const teknisInventaris = findDiv("teknis_inventaris");
  const acaraSub = findDiv("acara_sub");
  const minatBakat = findDiv("minat_bakat");
  const media = findDiv("media");
  const relasi = findDiv("relasi");

  const renderNode = (
    div: Divisi,
    labelOverride?: string,
    extraClasses: string = ""
  ) => {
    const displayName = labelOverride || div.name;
    return (
      <button
        onClick={() => onSelectDivision(div)}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-primary text-slate-800 hover:text-white border-2 border-primary/40 hover:border-primary rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${extraClasses}`}
        title={`Klik untuk melihat detail & anggota ${displayName}`}
      >
        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-white/20 text-primary group-hover:text-white flex items-center justify-center transition-colors shrink-0">
          {getDivisionIcon(div.icon_name, "size-4")}
        </div>
        <span className="font-plusJakarta font-bold text-xs sm:text-sm whitespace-nowrap">
          {displayName}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full overflow-x-auto py-8 px-2 flex justify-center">
      <div className="min-w-[920px] max-w-5xl flex flex-col items-center select-none">
        
        {/* ================= LEVEL 1: KETUA UMUM ================= */}
        <div className="flex flex-col items-center">
          {renderNode(ketuaUmum, "Ketua Umum", "min-w-[180px]")}
          {/* Vertical line down to Level 2 */}
          <div className="w-0.5 h-8 bg-primary/40" />
        </div>

        {/* ================= LEVEL 2: BPH (Sekretaris - Wakil Ketua - Bendahara) ================= */}
        <div className="relative flex items-center justify-center gap-12 w-full max-w-2xl">
          {/* Horizontal Connector Line for BPH */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-primary/40 -translate-y-1/2 -z-0" />

          {/* Sekretaris */}
          <div className="relative z-10">
            {renderNode(sekretaris, "Sekretaris", "min-w-[150px]")}
          </div>

          {/* Wakil Ketua Umum (Center) */}
          <div className="relative z-10 flex flex-col items-center">
            {renderNode(wakilKetuaUmum, "Wakil Ketua Umum", "min-w-[170px]")}
          </div>

          {/* Bendahara */}
          <div className="relative z-10">
            {renderNode(bendahara, "Bendahara", "min-w-[150px]")}
          </div>
        </div>

        {/* Vertical line from Wakil Ketua Umum down to Level 3 */}
        <div className="w-0.5 h-10 bg-primary/40" />

        {/* ================= LEVEL 3: 4 KOMISI UTAMA ================= */}
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          {/* Horizontal Line Across All 4 Commissions */}
          <div className="absolute top-0 left-[8%] right-[8%] h-0.5 bg-primary/40" />

          <div className="grid grid-cols-4 gap-6 w-full pt-6">
            
            {/* 1. Pembinaan */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderNode(pembinaan, "Pembinaan", "w-full justify-center")}
            </div>

            {/* 2. Pemerhati */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderNode(pemerhati, "Pemerhati", "w-full justify-center")}
            </div>

            {/* 3. Acara (has sub-divisions) */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderNode(acara, "Acara", "w-full justify-center")}
              {/* Vertical line down to Sub-Acara */}
              <div className="w-0.5 h-8 bg-primary/40" />
            </div>

            {/* 4. Media & Relasi (has sub-divisions) */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderNode(mediaRelasi, "Media & Relasi", "w-full justify-center")}
              {/* Vertical line down to Sub-Medrel */}
              <div className="w-0.5 h-8 bg-primary/40" />
            </div>

          </div>
        </div>

        {/* ================= LEVEL 4: SUB-DIVISI ================= */}
        <div className="grid grid-cols-4 gap-6 w-full max-w-4xl pt-0">
          
          {/* Column 1 & 2: Empty Spacer underneath Pembinaan & Pemerhati */}
          <div />
          <div />

          {/* Column 3: 3 Sub-Divisi under Acara */}
          <div className="relative flex flex-col items-center -mt-0.5">
            {/* Horizontal Line Connecting 3 sub divisions */}
            <div className="absolute top-0 left-[-40%] right-[-40%] h-0.5 bg-primary/40" />

            <div className="flex items-start justify-center gap-3 pt-5 w-[420px] -translate-x-16">
              <div className="flex flex-col items-center relative flex-1">
                <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                {renderNode(teknisInventaris, "Teknis & Inventaris", "w-full justify-center !px-2.5")}
              </div>

              <div className="flex flex-col items-center relative flex-1">
                <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                {renderNode(acaraSub, "Acara", "w-full justify-center !px-2.5")}
              </div>

              <div className="flex flex-col items-center relative flex-1">
                <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                {renderNode(minatBakat, "Minat Bakat & Misi", "w-full justify-center !px-2.5")}
              </div>
            </div>
          </div>

          {/* Column 4: 2 Sub-Divisi under Media & Relasi */}
          <div className="relative flex flex-col items-center -mt-0.5">
            {/* Horizontal Line Connecting 2 sub divisions */}
            <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-primary/40" />

            <div className="flex items-start justify-center gap-3 pt-5 w-full">
              <div className="flex flex-col items-center relative flex-1">
                <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                {renderNode(media, "Media", "w-full justify-center")}
              </div>

              <div className="flex flex-col items-center relative flex-1">
                <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                {renderNode(relasi, "Relasi", "w-full justify-center")}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
