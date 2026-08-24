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

  const renderButton = (div: Divisi, labelOverride?: string, customWidth: string = "w-full") => {
    const displayName = labelOverride || div.name;
    return (
      <button
        onClick={() => onSelectDivision(div)}
        className={`group relative flex items-center justify-center gap-2.5 h-[50px] px-4 bg-white hover:bg-primary text-slate-800 hover:text-white border-2 border-primary/40 hover:border-primary rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${customWidth}`}
        title={`Klik untuk melihat profil & anggota ${displayName}`}
      >
        <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-white/20 text-primary group-hover:text-white flex items-center justify-center transition-colors shrink-0">
          {getDivisionIcon(div.icon_name, "size-4")}
        </div>
        <span className="font-plusJakarta font-bold text-xs sm:text-sm whitespace-nowrap tracking-tight">
          {displayName}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full overflow-x-auto py-8 px-4 flex justify-center custom-scrollbar">
      <div className="min-w-[1240px] max-w-[1300px] flex flex-col items-center select-none">
        
        {/* ================= LEVEL 1: KETUA UMUM ================= */}
        <div className="flex flex-col items-center">
          <div className="w-[200px]">
            {renderButton(ketuaUmum, "Ketua Umum")}
          </div>
          {/* Vertical line down to Wakil Ketua Umum */}
          <div className="w-0.5 h-8 bg-primary/40" />
        </div>

        {/* ================= LEVEL 2: BPH ================= */}
        <div className="relative flex items-center justify-center gap-10 w-full max-w-[760px]">
          {/* Horizontal Connector Line for BPH */}
          <div className="absolute top-1/2 left-[100px] right-[100px] h-0.5 bg-primary/40 -translate-y-1/2 -z-0" />

          {/* Sekretaris */}
          <div className="relative z-10 w-[180px]">
            {renderButton(sekretaris, "Sekretaris")}
          </div>

          {/* Wakil Ketua Umum */}
          <div className="relative z-10 w-[210px]">
            {renderButton(wakilKetuaUmum, "Wakil Ketua Umum")}
          </div>

          {/* Bendahara */}
          <div className="relative z-10 w-[180px]">
            {renderButton(bendahara, "Bendahara")}
          </div>
        </div>

        {/* Vertical line from Wakil Ketua Umum down to Level 3 Main Bus */}
        <div className="w-0.5 h-10 bg-primary/40" />

        {/* ================= LEVEL 3 & 4: KOMISI UTAMA & SUB-DIVISI ================= */}
        <div className="relative w-full flex flex-col items-center">
          
          {/* Level 3 Horizontal Main Bus Line (Spans across all 4 commission columns) */}
          <div className="absolute top-0 left-[95px] right-[175px] h-0.5 bg-primary/40" />

          {/* 4 Main Columns Layout */}
          <div className="flex items-start justify-between gap-6 w-full pt-6">
            
            {/* COLUMN 1: Pembinaan */}
            <div className="flex flex-col items-center w-[190px] shrink-0 relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderButton(pembinaan, "Pembinaan", "w-[190px]")}
            </div>

            {/* COLUMN 2: Pemerhati */}
            <div className="flex flex-col items-center w-[190px] shrink-0 relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              {renderButton(pemerhati, "Pemerhati", "w-[190px]")}
            </div>

            {/* COLUMN 3: Acara & 3 Sub-Divisi */}
            <div className="flex flex-col items-center w-[480px] shrink-0 relative">
              {/* Dropdown line from Level 3 bus */}
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              
              {/* Parent: Acara */}
              {renderButton(acara, "Acara", "w-[200px]")}

              {/* Line down to sub-branch bus */}
              <div className="w-0.5 h-8 bg-primary/40" />

              {/* Sub-Branch Container */}
              <div className="relative w-full flex flex-col items-center">
                {/* Horizontal line across 3 sub-divisi */}
                <div className="absolute top-0 left-[75px] right-[75px] h-0.5 bg-primary/40" />

                {/* 3 Sub-Divisi Children */}
                <div className="flex items-start justify-between w-full pt-5 gap-3">
                  
                  {/* Teknis & Inventaris */}
                  <div className="flex flex-col items-center w-[150px] relative">
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                    {renderButton(teknisInventaris, "Teknis & Inventaris", "w-full !px-2 text-center")}
                  </div>

                  {/* Acara (Sub) */}
                  <div className="flex flex-col items-center w-[130px] relative">
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                    {renderButton(acaraSub, "Acara", "w-full !px-2 text-center")}
                  </div>

                  {/* Minat Bakat & Misi Pelayanan */}
                  <div className="flex flex-col items-center w-[180px] relative">
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                    {renderButton(minatBakat, "Minat Bakat & Misi", "w-full !px-2 text-center")}
                  </div>

                </div>
              </div>
            </div>

            {/* COLUMN 4: Media & Relasi & 2 Sub-Divisi */}
            <div className="flex flex-col items-center w-[350px] shrink-0 relative">
              {/* Dropdown line from Level 3 bus */}
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/40 -translate-x-1/2" />
              
              {/* Parent: Media & Relasi */}
              {renderButton(mediaRelasi, "Media & Relasi", "w-[210px]")}

              {/* Line down to sub-branch bus */}
              <div className="w-0.5 h-8 bg-primary/40" />

              {/* Sub-Branch Container */}
              <div className="relative w-full flex flex-col items-center">
                {/* Horizontal line across 2 sub-divisi */}
                <div className="absolute top-0 left-[80px] right-[80px] h-0.5 bg-primary/40" />

                {/* 2 Sub-Divisi Children */}
                <div className="flex items-start justify-between w-full pt-5 gap-4 px-2">
                  
                  {/* Media */}
                  <div className="flex flex-col items-center w-[150px] relative">
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                    {renderButton(media, "Media", "w-full !px-2 text-center")}
                  </div>

                  {/* Relasi */}
                  <div className="flex flex-col items-center w-[150px] relative">
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-primary/40 -translate-x-1/2" />
                    {renderButton(relasi, "Relasi", "w-full !px-2 text-center")}
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
