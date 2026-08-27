"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, Plus, Users, Eye, Layers, FileSpreadsheet } from "lucide-react";

interface StatsData {
  totalPengumuman: number;
  totalViews: number;
  totalPengurus: number;
  totalDivisi: number;
  latestPengumuman: Array<{
    id: string;
    title: string;
    category: string;
    date_published: string;
    views: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/stats", {
          headers: {
            "Authorization": `Bearer ${token || ""}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setStats(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const latestItems = stats?.latestPengumuman && stats.latestPengumuman.length > 0
    ? stats.latestPengumuman
    : [
        { id: "ann_01", title: "Persekutuan Jumat Perdana Semester Ganjil", date_published: "2026-08-28" },
        { id: "ann_02", title: "Open Recruitment Panitia Camp Daniel 2026", date_published: "2026-08-25" },
        { id: "ann_03", title: "Selamat Ulang Tahun Anggota PMK Daniel Bulan Agustus", date_published: "2026-08-20" }
      ];

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-8 lg:px-14 font-plusJakarta text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-plusJakarta text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Selamat datang di Panel Manajemen PMK Daniel FILKOM UB
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/bahteranabinuh"
              className="flex items-center gap-2 rounded-full bg-slate-900 px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Kelola Formulir</span>
            </Link>
            <Link
              href="/limarotiduaikan"
              className="flex items-center gap-2 rounded-full bg-primary px-4 sm:px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Kelola Pengumuman</span>
            </Link>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengumuman</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Megaphone className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{stats?.totalPengumuman ?? 3}</p>
            <span className="text-xs text-slate-500 mt-1 block">Telah dipublikasikan</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Views</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{stats?.totalViews ?? 0}</p>
            <span className="text-xs text-slate-500 mt-1 block">Kunjungan pembaca</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengurus</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{stats?.totalPengurus ?? 3}</p>
            <span className="text-xs text-slate-500 mt-1 block">Anggota terdaftar</span>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Divisi</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{stats?.totalDivisi ?? 5}</p>
            <span className="text-xs text-slate-500 mt-1 block">Bidang pelayanan</span>
          </div>
        </div>

        {/* Seksi: Pengumuman Terbaru */}
        <section className="flex w-full flex-col gap-4">
          <h2 className="font-plusJakarta text-xl sm:text-2xl font-bold text-slate-900">
            Pengumuman Terbaru
          </h2>
          
          <div className="flex w-full flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            {latestItems.map((item: any, index: number) => (
              <Link
                key={index}
                href={`/limarotiduaikan/${item.id}`}
                className="flex min-h-[70px] w-full flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 px-6 py-4 hover:bg-slate-50 transition-colors last:border-b-0 gap-2 group"
              >
                <span className="font-plusJakarta text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <span className="font-plusJakarta text-xs text-slate-400 font-mono">
                  {item.date_published}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Seksi: Aktivitas Terakhir */}
        <section className="flex w-full flex-col gap-4">
          <h2 className="font-plusJakarta text-xl sm:text-2xl font-bold text-slate-900">
            Aktivitas Terakhir
          </h2>
          
          <div className="flex w-full flex-col gap-3">
            <div className="flex min-h-[58px] w-full flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-white border border-slate-200/80 px-6 py-3.5 gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-plusJakarta text-xs sm:text-sm font-semibold text-slate-800">
                  Server Backend Cloudflare R2 & Database Aktif
                </span>
              </div>
              <span className="font-plusJakarta text-xs text-slate-400 font-mono">
                Hari ini
              </span>
            </div>
            <div className="flex min-h-[58px] w-full flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-white border border-slate-200/80 px-6 py-3.5 gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-plusJakarta text-xs sm:text-sm font-semibold text-slate-800">
                  Pengumuman Persekutuan Jumat Perdana diterbitkan
                </span>
              </div>
              <span className="font-plusJakarta text-xs text-slate-400 font-mono">
                28 Agustus 2026
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}