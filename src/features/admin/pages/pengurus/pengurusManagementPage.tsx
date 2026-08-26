"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Divisi, PengurusMember } from "@/types/pengurus";
import { pengurusService } from "@/services/pengurusService";
import DivisionButtonCard from "@/features/pengurus/components/DivisionLogo";
import EditDivisionModal from "./components/editDivisionModal";
import MemberModal from "./components/memberModal";
import { 
  Plus, 
  Search, 
  Users, 
  Layers, 
  Edit3, 
  Trash2, 
  Sparkles, 
  UserPlus, 
  Award, 
  ExternalLink,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function PengurusManagementPage() {
  const [divisions, setDivisions] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isDivModalOpen, setIsDivModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Divisi | null>(null);
  const [selectedMember, setSelectedMember] = useState<PengurusMember | null>(null);

  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const data = await pengurusService.getAllDivisions();
      setDivisions(data);
    } catch (err) {
      console.error("Failed to load divisions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const handleDeleteMember = async (member: PengurusMember) => {
    if (!window.confirm(`Hapus anggota "${member.name}" dari kepengurusan?`)) return;

    setDeletingMemberId(member.id);
    try {
      await pengurusService.deleteMember(member.id);
      fetchDivisions();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus anggota");
    } finally {
      setDeletingMemberId(null);
    }
  };

  const filteredDivisions = divisions.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchDiv = d.name.toLowerCase().includes(q) || (d.komisi && d.komisi.toLowerCase().includes(q));
    const matchMember = (d.members || []).some(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
    return matchDiv || matchMember;
  });

  const totalMembers = divisions.reduce((acc, d) => acc + (d.members?.length || 0), 0);

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-8 lg:px-14 font-plusJakarta text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        
        {/* Header Banner */}
        <div className="relative rounded-2xl sm:rounded-[32px] overflow-hidden bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1d4ed8] p-5 sm:p-8 md:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary text-xs font-bold uppercase tracking-wider w-fit">
              <Sparkles size={13} /> Panel Manajemen Struktur
            </span>
            <h1 className="font-plusJakarta text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Kelola Struktur & Kepengurusan
            </h1>
            <p className="font-plusJakarta text-sm text-slate-200 leading-relaxed mt-1">
              Atur penjelasan komisi, upload foto bersama divisi, serta input susunan nama dan jabatan seluruh anggota pengurus PMK Daniel.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              href="/pengurus"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-plusJakarta font-bold text-xs rounded-full border border-white/20 backdrop-blur-md transition-all"
            >
              <ExternalLink size={15} />
              <span>Lihat Halaman Publik</span>
            </Link>

            <button
              onClick={() => {
                setSelectedDivision(null);
                setIsDivModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-plusJakarta font-extrabold text-xs rounded-full shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <Plus size={17} strokeWidth={3} />
              <span>Tambah Divisi</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Divisi & Komisi
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1.5">
                {divisions.length}
              </p>
              <span className="text-xs text-slate-500 mt-1 block">Tersusun di struktur bagan</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <Layers size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Anggota Terdaftar
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1.5">
                {totalMembers}
              </p>
              <span className="text-xs text-emerald-600/80 mt-1 block">Dari seluruh bidang komisi</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <Users size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Periode Aktif
              </p>
              <p className="text-3xl font-extrabold text-purple-600 mt-1.5">
                2025/2026
              </p>
              <span className="text-xs text-purple-600/80 mt-1 block">Kepengurusan PMK Daniel</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari divisi, komisi, atau nama anggota..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 font-plusJakarta text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-slate-800"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Menampilkan {filteredDivisions.length} divisi
          </span>
        </div>

        {/* Divisions Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-slate-200">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-slate-500 font-medium">Memuat data kepengurusan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDivisions.map((div) => (
              <div
                key={div.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all overflow-hidden flex flex-col group"
              >
                {/* Division Card Header */}
                <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-auto h-10 max-w-[170px] flex items-center justify-center shrink-0">
                      <DivisionButtonCard divisionId={div.id} className="w-[150px]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                          {div.komisi || "Komisi"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {div.members?.length || 0} Anggota
                        </span>
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-primary transition-colors">
                        {div.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedDivision(div);
                        setIsDivModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors"
                      title="Edit Divisi & Foto"
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDivision(div);
                        setSelectedMember(null);
                        setIsMemberModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-colors"
                      title="Tambah Anggota ke Divisi Ini"
                    >
                      <UserPlus size={14} />
                      <span>+ Anggota</span>
                    </button>
                  </div>
                </div>

                {/* Photo & Description Banner */}
                <div className="px-6 py-4 flex gap-4 items-center bg-slate-50/50">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
                    <Image
                      src={div.group_photo_url || "/images/persekutuan.webp"}
                      alt={div.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {div.description || "Belum ada deskripsi penjelasan divisi."}
                  </p>
                </div>

                {/* Members List Table */}
                <div className="p-6 pt-4 flex-1 flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Daftar Anggota & Peran
                  </span>

                  {(!div.members || div.members.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl p-4">
                      <p className="text-xs text-slate-400">Belum ada anggota terdaftar.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-slate-100">
                      {div.members.map((member) => (
                        <div
                          key={member.id}
                          className="py-2.5 flex items-center justify-between gap-3 group/member hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                              <Image
                                src={member.photo_url || "/images/persekutuan.webp"}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {member.name}
                              </p>
                              <p className="text-[11px] font-medium text-primary truncate">
                                {member.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/member:opacity-100">
                            <button
                              onClick={() => {
                                setSelectedDivision(div);
                                setSelectedMember(member);
                                setIsMemberModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                              title="Edit Anggota"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member)}
                              disabled={deletingMemberId === member.id}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Anggota"
                            >
                              {deletingMemberId === member.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modals */}
      <EditDivisionModal
        isOpen={isDivModalOpen}
        onClose={() => {
          setIsDivModalOpen(false);
          setSelectedDivision(null);
        }}
        onSuccess={fetchDivisions}
        division={selectedDivision}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setSelectedMember(null);
        }}
        onSuccess={fetchDivisions}
        targetDivision={selectedDivision}
        editingMember={selectedMember}
      />
    </div>
  );
}
