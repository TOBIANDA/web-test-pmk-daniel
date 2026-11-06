"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import * as XLSX from "xlsx";
import { formService } from "@/services/formService";
import { DynamicForm } from "@/types/form";
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronLeft,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Filter,
  Eye,
  X,
  FileText
} from "lucide-react";

interface RekapPageProps {
  params: Promise<{ slug: string }>;
}

export default function RekapPage({ params }: RekapPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [form, setForm] = useState<DynamicForm | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [selectedCellContent, setSelectedCellContent] = useState<{ title: string; content: string } | null>(null);

  // Fetch form details & live submissions via CSV endpoint
  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);

      // 1. Fetch form metadata
      const formData = await formService.getFormBySlugOrId(slug);
      if (formData) setForm(formData);

      // 2. Fetch live CSV submissions
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://pmkdaniel-api.danielmemory26.workers.dev/api";
      const res = await fetch(`${apiBaseUrl}/dynamic-forms/${slug}/export-csv`, {
        cache: "no-store",
      });

      if (res.ok) {
        const csvText = await res.text();
        const wb = XLSX.read(csvText, { type: "string" });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];

        if (firstSheet) {
          // Parse as objects with headers
          const parsedData = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { raw: false });
          
          // Extract header row
          const headerRows = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1, raw: false });
          const rawHeaders = (headerRows[0] || []) as string[];
          
          // Filter out section headers that have no values
          const cleanHeaders = rawHeaders.filter((h) => h && h.trim().length > 0);

          setHeaders(cleanHeaders);
          setRows(parsedData as Record<string, string>[]);
        }
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Gagal memuat rekap data:", err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 12 seconds for realtime updates
    const interval = setInterval(() => {
      fetchData();
    }, 12000);

    return () => clearInterval(interval);
  }, [slug]);

  // Extract division column if available for quick filter
  const divisionHeaderKey = useMemo(() => {
    return headers.find((h) => h.toLowerCase().includes("divisi") && h.toLowerCase().includes("pilihan 1")) ||
           headers.find((h) => h.toLowerCase().includes("divisi")) || null;
  }, [headers]);

  const uniqueDivisions = useMemo(() => {
    if (!divisionHeaderKey) return [];
    const values = new Set<string>();
    rows.forEach((r) => {
      const val = r[divisionHeaderKey];
      if (val && typeof val === "string" && val.trim()) {
        values.add(val.trim());
      }
    });
    return Array.from(values);
  }, [rows, divisionHeaderKey]);

  // Filtered rows based on search and division
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // 1. Division filter
      if (selectedDivision !== "all" && divisionHeaderKey) {
        const val = row[divisionHeaderKey];
        if (val !== selectedDivision) return false;
      }

      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return Object.values(row).some((val) => {
        if (!val) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [rows, searchQuery, selectedDivision, divisionHeaderKey]);

  // Download Excel (.xlsx)
  const handleDownloadExcel = () => {
    if (rows.length === 0) {
      alert("Belum ada data tanggapan untuk diunduh.");
      return;
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto-fit column widths
    const colWidths = headers.map((key) => {
      let maxLen = key.length;
      rows.forEach((r) => {
        const valLen = String(r[key] || "").length;
        if (valLen > maxLen) maxLen = valLen;
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Rekap Tanggapan");
    const cleanTitle = (form?.title || "Rekap").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    XLSX.writeFile(wb, `Rekap_${cleanTitle}_${dateTag}.xlsx`);
  };

  // Helper to format cell value (detect links, long text, etc.)
  const renderCellContent = (key: string, val: any) => {
    if (val === undefined || val === null || val === "") {
      return <span className="text-slate-300">-</span>;
    }

    const strVal = String(val).trim();

    // Check if value is a URL (e.g. Google Drive, portfolio)
    if (strVal.startsWith("http://") || strVal.startsWith("https://")) {
      return (
        <a
          href={strVal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all break-all max-w-[260px] truncate"
          title={strVal}
        >
          <ExternalLink size={13} className="shrink-0" />
          <span className="truncate">{strVal.replace(/^https?:\/\//, "")}</span>
        </a>
      );
    }

    // Badge styling for division options
    if (
      key.toLowerCase().includes("divisi") ||
      key.toLowerCase().includes("jurusan") ||
      strVal === "Ya" ||
      strVal === "Tidak"
    ) {
      const isTeknologi = strVal.toLowerCase().includes("teknologi");
      const isMedia = strVal.toLowerCase().includes("media");
      const isAcara = strVal.toLowerCase().includes("acara");
      const isPembinaan = strVal.toLowerCase().includes("pembinaan");
      const isPemerhati = strVal.toLowerCase().includes("pemerhati");

      let badgeBg = "bg-slate-100 text-slate-700 border-slate-200";
      if (isTeknologi) badgeBg = "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold";
      else if (isMedia) badgeBg = "bg-purple-50 text-purple-700 border-purple-200 font-bold";
      else if (isAcara) badgeBg = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
      else if (isPembinaan) badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
      else if (isPemerhati) badgeBg = "bg-rose-50 text-rose-800 border-rose-200 font-bold";

      return (
        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs border ${badgeBg} whitespace-nowrap`}>
          {strVal}
        </span>
      );
    }

    // For long paragraphs (Motivasi, Alasan)
    if (strVal.length > 60) {
      return (
        <div className="flex items-center gap-2 max-w-[340px]">
          <span className="truncate text-xs text-slate-700">{strVal}</span>
          <button
            type="button"
            onClick={() => setSelectedCellContent({ title: key, content: strVal })}
            className="p-1 hover:bg-slate-200 text-slate-400 hover:text-primary rounded-md shrink-0 transition-colors"
            title="Lihat teks lengkap"
          >
            <Eye size={14} />
          </button>
        </div>
      );
    }

    return <span className="text-xs text-slate-800 whitespace-nowrap">{strVal}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2E2EF]/60 via-[#FFFFFF] to-[#FFEED0]/60 pt-28 pb-20 font-plusJakarta">
      <div className="w-[95%] lg:w-[92%] mx-auto flex flex-col gap-6">

        {/* Top Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200/70 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/join" className="hover:text-primary flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Daftar Formulir
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-primary font-bold">Rekap Realtime</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Sync Aktif (Otomatis)</span>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Perbarui data sekarang"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin text-primary" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="relative rounded-[32px] overflow-hidden bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_12px_40px_rgba(62,64,149,0.06)] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                <FileSpreadsheet size={18} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Portal Rekap Responden Divisi
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {form?.title || "Rekap Tanggapan Formulir"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              {form?.description || "Halaman rekap data pendaftar khusus panitia/divisi terkait. Data diperbarui otomatis secara realtime tanpa perlu reload halaman."}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
              <span>Diperbarui: {lastUpdated.toLocaleTimeString("id-ID")} WIB</span>
              <span>•</span>
              <Link
                href={`/form/${slug}`}
                target="_blank"
                className="text-primary hover:underline font-bold inline-flex items-center gap-1 font-plusJakarta"
              >
                <span>Buka Link Form Publik</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Counter & Download Button */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-gray-200/80 px-4 py-2.5 rounded-2xl">
              <Users size={20} className="text-primary" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Responden</p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">
                  {rows.length} <span className="text-xs font-normal text-slate-500">Orang</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={rows.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40"
            >
              <Download size={16} />
              <span>Download Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIM, jawaban..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Division Filter Dropdown (if present) */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {uniqueDivisions.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={15} className="text-slate-400 shrink-0" />
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-gray-200 bg-slate-50/60 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">Semua Pilihan Divisi</option>
                  {uniqueDivisions.map((div, dIdx) => (
                    <option key={dIdx} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
              Menampilkan <strong>{filteredRows.length}</strong> dari <strong>{rows.length}</strong> data
            </span>
          </div>
        </div>

        {/* Main Spreadsheet Table Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-gray-200/90 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <RefreshCw size={28} className="animate-spin text-primary" />
              <p className="text-xs font-bold text-slate-500">Memuat rekap data responden...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3 border border-gray-100">
                <FileSpreadsheet size={32} />
              </div>
              <h3 className="font-extrabold text-base text-slate-800">Belum Ada Tanggapan Masuk</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                Formulir ini belum menerima tanggapan dari responden. Ketika responden mengirim jawaban, data akan otomatis muncul di tabel ini secara realtime.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[70vh] relative">
              <table className="w-full text-left border-collapse">
                {/* Sticky Header */}
                <thead className="bg-slate-100/90 sticky top-0 z-10 backdrop-blur-md border-b border-gray-200">
                  <tr>
                    {headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className={`px-4 py-3.5 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200/80 ${
                          hIdx === 0 ? "sticky left-0 bg-slate-100 z-20 w-12 text-center" : ""
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={headers.length} className="text-center py-12 text-xs text-slate-400">
                        Tidak ada data yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-primary/[0.02] transition-colors group"
                      >
                        {headers.map((header, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-4 py-3 border-r border-gray-100/80 text-xs align-middle ${
                              cIdx === 0
                                ? "sticky left-0 bg-white group-hover:bg-[#F9F9FD] font-mono font-bold text-center text-slate-400"
                                : ""
                            }`}
                          >
                            {renderCellContent(header, row[header])}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer Summary */}
          {rows.length > 0 && (
            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-gray-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <span>
                💡 Tips: Klik ikon mata pada jawaban teks panjang untuk membaca selengkapnya. Tautan Google Drive / file dapat langsung diklik.
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Sinkronisasi otomatis aktif • {rows.length} total baris
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Modal View Full Text Answer */}
      {selectedCellContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <FileText size={16} />
                <span>{selectedCellContent.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCellContent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-gray-200">
              {selectedCellContent.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedCellContent(null)}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
