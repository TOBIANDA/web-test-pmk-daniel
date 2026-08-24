"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Megaphone, LogOut, Plus, Users, Eye, Layers } from "lucide-react";

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
    <div className="flex min-h-screen bg-[#fafafa] font-plusJakarta">
      
      {/* Sidebar Navigasi Kiri */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-[219px] flex-col bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
        <div className="relative flex h-[257px] w-[219px] flex-col items-center justify-center bg-primary">
          <div className="relative h-[84px] w-[87px]">
            <Image
              src="/logo.png"
              alt="Logo PMK Daniel"
              fill
              className="object-contain"
            />
          </div>
          {/* Teks Judul */}
          <h2 className="mt-[20px] font-plusJakarta text-[24px] font-[800] leading-[30px] text-white">
            PMK Daniel
          </h2>
        </div>

        {/* Menu Navigasi Tengah */}
        <nav className="mt-[39px] flex w-full flex-col">
          {/* Menu: Dashboard */}
          <Link href="/daudpakeketapel" className="flex h-[44px] w-full items-center gap-[8px] bg-primary/10 py-[8px] pl-[32px] pr-[12px] border-l-4 border-primary">
            <LayoutDashboard className="h-[24px] w-[24px] text-primary" />
            <span className="font-['Nunito_Sans'] text-[16px] font-[600] leading-[22px] text-primary">
              Dashboard
            </span>
          </Link>
          {/* Menu: Pengumuman */}
          <Link href="/limarotiduaikan" className="flex h-[44px] w-full items-center gap-[8px] py-[8px] pl-[32px] pr-[12px] cursor-pointer hover:bg-gray-50 transition-colors">
            <Megaphone className="h-[24px] w-[24px] text-black" />
            <span className="font-['Nunito_Sans'] text-[16px] font-[600] leading-[22px] text-black">
              Pengumuman
            </span>
          </Link>
        </nav>

        {/* Menu Navigasi Bawah - Logout */}
        <div className="absolute bottom-[44px] left-0 flex w-full flex-col">
          <Link href="/pausmakanyunus" onClick={() => localStorage.removeItem("admin_token")} className="flex h-[44px] w-full items-center gap-[8px] py-[8px] pl-[32px] pr-[12px] cursor-pointer hover:bg-red-50 text-red-600 transition-colors">
            <LogOut className="h-[24px] w-[24px]" />
            <span className="font-['Nunito_Sans'] text-[16px] font-[600] leading-[22px]">
              Keluar
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[219px] flex flex-1 flex-col px-8 py-12 lg:px-[69px] lg:py-[75px]">
        <div className="mx-auto flex w-full max-w-[1088px] flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="font-plusJakarta text-[32px] md:text-[40px] font-[700] leading-tight text-primary">
              Dashboard
            </h1>
            <Link
              href="/limarotiduaikan"
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Kelola Pengumuman</span>
            </Link>
          </div>

          {/* Stat Cards Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Pengumuman</span>
                <Megaphone className="h-5 w-5 text-amber-500" />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stats?.totalPengumuman ?? 3}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Views</span>
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stats?.totalViews ?? 0}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Pengurus</span>
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stats?.totalPengurus ?? 3}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Total Divisi</span>
                <Layers className="h-5 w-5 text-purple-500" />
              </div>
              <p className="mt-3 text-3xl font-bold text-gray-900">{stats?.totalDivisi ?? 5}</p>
            </div>
          </div>

          {/* Seksi: Pengumuman Terbaru */}
          <section className="mt-12 flex w-full flex-col gap-6">
            <h2 className="w-full font-plusJakarta text-[24px] md:text-[32px] font-[700] leading-tight text-primary">
              Pengumuman Terbaru
            </h2>
            
            <div className="flex w-full flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {latestItems.map((item: any, index: number) => (
                <Link
                  key={index}
                  href={`/limarotiduaikan/${item.id}`}
                  className="flex min-h-[76px] w-full flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors last:border-b-0 gap-2"
                >
                  <span className="font-plusJakarta text-[16px] font-[700] leading-[20px] text-gray-900 hover:text-primary">
                    {item.title}
                  </span>
                  <span className="font-plusJakarta text-[14px] font-[400] text-gray-500">
                    {item.date_published}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Seksi: Aktivitas Terakhir */}
          <section className="mt-10 flex w-full flex-col gap-6">
            <h2 className="w-full font-plusJakarta text-[24px] md:text-[32px] font-[700] leading-tight text-primary">
              Aktivitas Terakhir
            </h2>
            
            <div className="flex w-full flex-col gap-3">
              <div className="flex min-h-[64px] w-full flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-primary/10 px-6 py-4 gap-2">
                <div className="flex items-center gap-4">
                  <Plus className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-plusJakarta text-[15px] font-[600] text-gray-900">
                    Server Backend Cloudflare R2 & Database Aktif
                  </span>
                </div>
                <span className="font-plusJakarta text-[13px] text-gray-500">
                  Hari ini
                </span>
              </div>
              <div className="flex min-h-[64px] w-full flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-primary/10 px-6 py-4 gap-2">
                <div className="flex items-center gap-4">
                  <Plus className="h-5 w-5 shrink-0 text-primary" />
                  <span className="font-plusJakarta text-[15px] font-[600] text-gray-900">
                    Pengumuman Persekutuan Jumat Perdana diterbitkan
                  </span>
                </div>
                <span className="font-plusJakarta text-[13px] text-gray-500">
                  28 Agustus 2026
                </span>
              </div>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
}