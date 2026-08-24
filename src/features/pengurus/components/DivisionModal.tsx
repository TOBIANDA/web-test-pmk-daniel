"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Divisi } from "@/types/pengurus";
import { 
  X, 
  Crown, 
  PenTool, 
  ShieldCheck, 
  Wallet, 
  BookOpen, 
  HeartHandshake, 
  Sparkles, 
  Video, 
  Settings, 
  Calendar, 
  Music, 
  Camera, 
  Users,
  Award,
  ChevronRight
} from "lucide-react";

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Divisi | null;
}

export function getDivisionIcon(iconName?: string, className: string = "size-5") {
  switch (iconName) {
    case "crown":
      return <Crown className={className} />;
    case "pen":
      return <PenTool className={className} />;
    case "shield":
      return <ShieldCheck className={className} />;
    case "wallet":
      return <Wallet className={className} />;
    case "book":
      return <BookOpen className={className} />;
    case "heart":
      return <HeartHandshake className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "video":
      return <Video className={className} />;
    case "settings":
      return <Settings className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "music":
      return <Music className={className} />;
    case "camera":
      return <Camera className={className} />;
    case "users":
      return <Users className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export default function DivisionModal({
  isOpen,
  onClose,
  division,
}: DivisionModalProps) {
  // Prevent Lenis smooth scroll from hijacking modal scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    };
  }, [isOpen]);

  if (!isOpen || !division) return null;

  const isSingleLeader = division.id === "ketua_umum" || (division.members && division.members.length === 1 && division.komisi === "BPH");
  const mainLeader = division.members && division.members.length > 0 ? division.members[0] : null;

  // Group members into Leaders vs Staff/Anggota
  const leaders = (division.members || []).filter(m => 
    m.role.toLowerCase().includes("ketua") || 
    m.role.toLowerCase().includes("koordinator") || 
    m.role.toLowerCase().includes("wakil") ||
    m.role.toLowerCase().includes("sekretaris") ||
    m.role.toLowerCase().includes("bendahara")
  );
  const staff = (division.members || []).filter(m => !leaders.some(l => l.id === m.id));

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-md bg-white rounded-[28px] border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Blue Header with Centered Icon Badge */}
        <div className="relative h-20 bg-primary flex items-center justify-center shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
            title="Tutup"
          >
            <X size={18} />
          </button>

          {/* Centered Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-lg border-2 border-white/80 transform translate-y-1">
            {getDivisionIcon(division.icon_name, "size-6 text-primary")}
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain p-6 flex flex-col gap-5 text-center font-plusJakarta"
        >
          {/* Photo Section */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
            {isSingleLeader && mainLeader ? (
              <div className="relative w-full h-56 sm:h-64 bg-gradient-to-t from-slate-900/60 to-transparent">
                <Image
                  src={mainLeader.photo_url || division.group_photo_url || "/images/bastian.webp"}
                  alt={mainLeader.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            ) : (
              <div className="relative w-full h-48 sm:h-52">
                <Image
                  src={division.group_photo_url || "/images/persekutuan.webp"}
                  alt={division.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {isSingleLeader && mainLeader ? mainLeader.name : division.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/15">
                {isSingleLeader && mainLeader ? mainLeader.role : (division.komisi || "Divisi Pelayanan")}
              </span>
            </div>
          </div>

          {/* Description Paragraph */}
          {division.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify px-1">
              {division.description}
            </p>
          )}

          {/* Division Members Section (Di Bawah Penjelasan Divisi) */}
          <div className="mt-1 pt-4 border-t border-slate-100 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Users size={14} className="text-primary" />
              <span>Susunan Pengurus & Anggota</span>
            </div>

            {(!division.members || division.members.length === 0) ? (
              <p className="text-xs text-slate-400 italic">Belum ada anggota terdata.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Leaders Section */}
                {leaders.length > 0 && (
                  <div className="flex flex-col gap-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    {leaders.map((leader) => (
                      <div key={leader.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-0">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Award size={13} className="text-amber-500 shrink-0" />
                          {leader.role}:
                        </span>
                        <span className="font-semibold text-primary">{leader.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Staff / Members List */}
                {staff.length > 0 && (
                  <div className="flex flex-col gap-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Anggota {division.name}:
                    </span>
                    <ul className="flex flex-col gap-1">
                      {staff.map((m, idx) => (
                        <li key={m.id || idx} className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                          <ChevronRight size={12} className="text-slate-400 shrink-0" />
                          <span>{m.name}</span>
                          {m.role && m.role !== "Anggota" && (
                            <span className="text-[10px] text-slate-400">({m.role})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Close Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
