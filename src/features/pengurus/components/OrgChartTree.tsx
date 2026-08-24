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

  const renderNodeButton = (
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

  return (
    <div className="w-full overflow-x-auto py-8 px-4 flex justify-center custom-scrollbar">
      <div className="min-w-[1000px] max-w-5xl flex flex-col items-center select-none">
        
        {/* ================= LEVEL 1: KETUA UMUM ================= */}
        <div className="flex flex-col items-center">
          <div className="w-[210px]">
            {renderNodeButton(ketuaUmum, "Ketua Umum")}
          </div>
          {/* Vertical solid line down to Level 2 */}
          <div className="w-0.5 h-8 bg-primary/50" />
        </div>

        {/* ================= LEVEL 2: BPH (Sekretaris - Wakil - Bendahara) ================= */}
        <div className="relative flex items-center justify-center gap-8 w-full max-w-[760px]">
          {/* Horizontal Solid Connector Line for BPH */}
          <div className="absolute top-1/2 left-[90px] right-[90px] h-0.5 bg-primary/50 -translate-y-1/2 -z-0" />

          {/* Sekretaris */}
          <div className="relative z-10 w-[190px]">
            {renderNodeButton(sekretaris, "Sekretaris")}
          </div>

          {/* Wakil Ketua Umum */}
          <div className="relative z-10 w-[220px]">
            {renderNodeButton(wakilKetuaUmum, "Wakil Ketua Umum")}
          </div>

          {/* Bendahara */}
          <div className="relative z-10 w-[190px]">
            {renderNodeButton(bendahara, "Bendahara")}
          </div>
        </div>

        {/* Vertical solid line from Wakil Ketua Umum down to Level 3 Main Bus */}
        <div className="w-0.5 h-10 bg-primary/50" />

        {/* ================= LEVEL 3 & 4: 4 KOMISI SEJAJAR DENGAN SUB-DIVISI VERTIKAL ================= */}
        <div className="relative w-full flex flex-col items-center">
          
          {/* Level 3 Horizontal Main Bus Line (Spans across the 4 main commission column centers) */}
          <div className="absolute top-0 left-[110px] right-[110px] h-0.5 bg-primary/50" />

          {/* 4 Equal Commission Columns Grid */}
          <div className="grid grid-cols-4 gap-6 w-full pt-6">
            
            {/* COLUMN 1: Pembinaan */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
              <div className="w-full">
                {renderNodeButton(pembinaan, "Pembinaan")}
              </div>
            </div>

            {/* COLUMN 2: Pemerhati */}
            <div className="flex flex-col items-center relative">
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
              <div className="w-full">
                {renderNodeButton(pemerhati, "Pemerhati")}
              </div>
            </div>

            {/* COLUMN 3: Acara & Sub-Divisi Vertikal (Same X Axis) */}
            <div className="flex flex-col items-center relative">
              {/* Solid line down from main bus to Acara */}
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
              
              {/* Parent: Acara (Komisi 3) */}
              <div className="w-full">
                {renderNodeButton(acara, "Acara")}
              </div>

              {/* Dashed Coordination Branch connecting 3 sub-divisions vertically */}
              <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1">
                {/* Vertical Dashed Line Running Down */}
                <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                {/* Sub 1: Teknis & Inventaris */}
                <div className="relative flex items-center w-full">
                  <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                  {renderNodeButton(teknisInventaris, "Teknis & Inventaris", true)}
                </div>

                {/* Sub 2: Acara (Pelaksana) */}
                <div className="relative flex items-center w-full">
                  <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                  {renderNodeButton(acaraSub, "Acara (Pelaksana)", true)}
                </div>

                {/* Sub 3: Minat Bakat & Misi Pelayanan */}
                <div className="relative flex items-center w-full">
                  <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                  {renderNodeButton(minatBakat, "Minat Bakat & Misi", true)}
                </div>
              </div>
            </div>

            {/* COLUMN 4: Media & Relasi & Sub-Divisi Vertikal (Same X Axis) */}
            <div className="flex flex-col items-center relative">
              {/* Solid line down from main bus to Media & Relasi */}
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
              
              {/* Parent: Media & Relasi (Komisi 4) */}
              <div className="w-full">
                {renderNodeButton(mediaRelasi, "Media & Relasi")}
              </div>

              {/* Dashed Coordination Branch connecting 2 sub-divisions vertically */}
              <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1">
                {/* Vertical Dashed Line Running Down */}
                <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                {/* Sub 1: Media */}
                <div className="relative flex items-center w-full">
                  <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                  {renderNodeButton(media, "Media", true)}
                </div>

                {/* Sub 2: Relasi */}
                <div className="relative flex items-center w-full">
                  <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                  {renderNodeButton(relasi, "Relasi", true)}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
