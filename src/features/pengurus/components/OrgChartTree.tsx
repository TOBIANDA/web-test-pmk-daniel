"use client";

import React, { useState } from "react";
import { Divisi } from "@/types/pengurus";
import DivisionButtonCard from "./DivisionLogo";
import { Layers, Network } from "lucide-react";

interface OrgChartTreeProps {
  divisions: Divisi[];
  onSelectDivision: (division: Divisi) => void;
}

export default function OrgChartTree({
  divisions,
  onSelectDivision,
}: OrgChartTreeProps) {
  // Mode switcher for mobile: "flow" (hierarchical flow) or "tree" (full diagram pan)
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
      <div className={`w-full flex-col gap-6 max-w-md mx-auto ${mobileViewMode === "flow" ? "flex md:hidden" : "hidden"}`}>
        
        {/* Section 1: Badan Pengurus Harian (BPH) */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-2 self-start px-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Badan Pengurus Harian (BPH)
            </h2>
          </div>

          {/* Ketua Umum */}
          <div className="w-full max-w-[240px]">
            <DivisionButtonCard
              divisionId={ketuaUmum.id}
              onClick={() => onSelectDivision(ketuaUmum)}
              className="w-full"
            />
          </div>

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40" />

          {/* Wakil Ketua Umum */}
          <div className="w-full max-w-[240px]">
            <DivisionButtonCard
              divisionId={wakilKetuaUmum.id}
              onClick={() => onSelectDivision(wakilKetuaUmum)}
              className="w-full"
            />
          </div>

          {/* Line connector down */}
          <div className="w-0.5 h-3 bg-primary/40" />

          {/* Sekretaris & Bendahara Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <DivisionButtonCard
              divisionId={sekretaris.id}
              onClick={() => onSelectDivision(sekretaris)}
              className="w-full"
            />
            <DivisionButtonCard
              divisionId={bendahara.id}
              onClick={() => onSelectDivision(bendahara)}
              className="w-full"
            />
          </div>
        </div>

        {/* Section 2: 4 Komisi Utama & Sub-Divisi */}
        <div className="flex flex-col gap-4 mt-2 pt-5 border-t border-slate-100 w-full">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Komisi & Bidang Pelayanan
            </h2>
          </div>

          {/* Komisi 1: Pembinaan */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 w-full">
            <DivisionButtonCard
              divisionId={pembinaan.id}
              onClick={() => onSelectDivision(pembinaan)}
              className="w-full max-w-[240px] mx-auto block"
            />
          </div>

          {/* Komisi 2: Pemerhati */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 w-full">
            <DivisionButtonCard
              divisionId={pemerhati.id}
              onClick={() => onSelectDivision(pemerhati)}
              className="w-full max-w-[240px] mx-auto block"
            />
          </div>

          {/* Komisi 3: Acara (with nested sub-divisions) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-3 w-full">
            <DivisionButtonCard
              divisionId={acara.id}
              onClick={() => onSelectDivision(acara)}
              className="w-full max-w-[240px] mx-auto block"
            />

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2 pl-4 ml-3 border-l-2 border-dashed border-primary/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Acara:
              </span>
              <DivisionButtonCard
                divisionId={teknisInventaris.id}
                onClick={() => onSelectDivision(teknisInventaris)}
                className="w-full max-w-[220px]"
              />
              <DivisionButtonCard
                divisionId={acaraSub.id}
                onClick={() => onSelectDivision(acaraSub)}
                className="w-full max-w-[220px]"
              />
              <DivisionButtonCard
                divisionId={minatBakat.id}
                onClick={() => onSelectDivision(minatBakat)}
                className="w-full max-w-[220px]"
              />
            </div>
          </div>

          {/* Komisi 4: Media & Relasi (with nested sub-divisions) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 flex flex-col gap-3 w-full">
            <DivisionButtonCard
              divisionId={mediaRelasi.id}
              onClick={() => onSelectDivision(mediaRelasi)}
              className="w-full max-w-[240px] mx-auto block"
            />

            {/* Sub-Divisions Branch */}
            <div className="relative flex flex-col gap-2 pl-4 ml-3 border-l-2 border-dashed border-primary/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sub-Divisi Media & Relasi:
              </span>
              <DivisionButtonCard
                divisionId={media.id}
                onClick={() => onSelectDivision(media)}
                className="w-full max-w-[220px]"
              />
              <DivisionButtonCard
                divisionId={relasi.id}
                onClick={() => onSelectDivision(relasi)}
                className="w-full max-w-[220px]"
              />
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
              <DivisionButtonCard
                divisionId={ketuaUmum.id}
                onClick={() => onSelectDivision(ketuaUmum)}
                className="w-[210px]"
              />
            </div>
            <div className="w-0.5 h-8 bg-primary/50" />
          </div>

          {/* LEVEL 2: BPH */}
          <div className="relative flex items-center justify-center gap-8 w-full max-w-[780px]">
            <div className="absolute top-1/2 left-[90px] right-[90px] h-0.5 bg-primary/50 -translate-y-1/2 -z-0" />

            <div className="relative z-10 w-[200px]">
              <DivisionButtonCard
                divisionId={sekretaris.id}
                onClick={() => onSelectDivision(sekretaris)}
                className="w-[200px]"
              />
            </div>

            <div className="relative z-10 w-[220px]">
              <DivisionButtonCard
                divisionId={wakilKetuaUmum.id}
                onClick={() => onSelectDivision(wakilKetuaUmum)}
                className="w-[220px]"
              />
            </div>

            <div className="relative z-10 w-[200px]">
              <DivisionButtonCard
                divisionId={bendahara.id}
                onClick={() => onSelectDivision(bendahara)}
                className="w-[200px]"
              />
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
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={pembinaan.id}
                    onClick={() => onSelectDivision(pembinaan)}
                    className="w-[210px]"
                  />
                </div>
              </div>

              {/* COLUMN 2: Pemerhati */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={pemerhati.id}
                    onClick={() => onSelectDivision(pemerhati)}
                    className="w-[210px]"
                  />
                </div>
              </div>

              {/* COLUMN 3: Acara & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={acara.id}
                    onClick={() => onSelectDivision(acara)}
                    className="w-[210px]"
                  />
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1 items-center">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={teknisInventaris.id}
                      onClick={() => onSelectDivision(teknisInventaris)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={acaraSub.id}
                      onClick={() => onSelectDivision(acaraSub)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={minatBakat.id}
                      onClick={() => onSelectDivision(minatBakat)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* COLUMN 4: Media & Relasi & Sub-Divisi Vertikal */}
              <div className="flex flex-col items-center relative">
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-primary/50 -translate-x-1/2" />
                <div className="w-[210px]">
                  <DivisionButtonCard
                    divisionId={mediaRelasi.id}
                    onClick={() => onSelectDivision(mediaRelasi)}
                    className="w-[210px]"
                  />
                </div>

                <div className="relative w-full flex flex-col gap-3 pt-6 pl-5 mt-1 items-center">
                  <div className="absolute top-0 bottom-6 left-3 w-0.5 border-l-2 border-dashed border-primary/50" />

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={media.id}
                      onClick={() => onSelectDivision(media)}
                      className="w-full"
                    />
                  </div>

                  <div className="relative flex items-center w-full max-w-[200px]">
                    <div className="absolute -left-2 w-2 h-0.5 border-t-2 border-dashed border-primary/50" />
                    <DivisionButtonCard
                      divisionId={relasi.id}
                      onClick={() => onSelectDivision(relasi)}
                      className="w-full"
                    />
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
