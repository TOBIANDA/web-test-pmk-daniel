"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
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
  ArrowUp,
  ArrowDown,
  Filter,
  Eye,
  X,
  FileText,
  SlidersHorizontal,
  BookmarkCheck,
  MessageSquare,
  BarChart3,
  Columns,
  RotateCcw
} from "lucide-react";

interface RekapPageProps {
  params: Promise<{ slug: string }>;
}

type SortDirection = "asc" | "desc";
interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface ColumnFilter {
  column: string;
  value: string;
}

type ReviewStatus = "Belum Direview" | "Lolos Berkas" | "Wawancara" | "Diterima" | "Ditolak";

const REVIEW_STATUS_OPTIONS: { label: ReviewStatus; color: string; bg: string; border: string }[] = [
  { label: "Belum Direview", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
  { label: "Lolos Berkas", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" },
  { label: "Wawancara", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" },
  { label: "Diterima", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" },
  { label: "Ditolak", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300" },
];

export default function RekapPage({ params }: RekapPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [form, setForm] = useState<DynamicForm | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Management Features States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [activeFilters, setActiveFilters] = useState<ColumnFilter[]>([]);
  const [newFilterCol, setNewFilterCol] = useState<string>("");
  const [newFilterVal, setNewFilterVal] = useState<string>("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [showColSelector, setShowColSelector] = useState(false);

  // Review status & notes stored locally per form slug
  const [reviewNotes, setReviewNotes] = useState<Record<string, { status: ReviewStatus; note: string }>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState("");

  const [selectedCellContent, setSelectedCellContent] = useState<{ title: string; content: string } | null>(null);

  // Load saved local review notes from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`pmk_rekap_review_${slug}`);
        if (saved) setReviewNotes(JSON.parse(saved));
      } catch (e) {}
    }
  }, [slug]);

  const saveReviewNote = (rowId: string, status: ReviewStatus, note?: string) => {
    setReviewNotes((prev) => {
      const current = prev[rowId] || { status: "Belum Direview", note: "" };
      const updated = {
        ...prev,
        [rowId]: {
          status: status || current.status,
          note: note !== undefined ? note : current.note,
        },
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`pmk_rekap_review_${slug}`, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  // Fetch form details & live submissions via CSV endpoint
  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);

      const formData = await formService.getFormBySlugOrId(slug);
      if (formData) setForm(formData);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://pmkdaniel-api.danielmemory26.workers.dev/api";
      const res = await fetch(`${apiBaseUrl}/dynamic-forms/${slug}/export-csv`, {
        cache: "no-store",
      });

      if (res.ok) {
        const csvText = await res.text();
        const wb = XLSX.read(csvText, { type: "string" });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];

        if (firstSheet) {
          const parsedData = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { raw: false });
          const headerRows = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1, raw: false });
          const rawHeaders = (headerRows[0] || []) as string[];
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
    const interval = setInterval(() => {
      fetchData();
    }, 12000);
    return () => clearInterval(interval);
  }, [slug]);

  // Handle column header click for Sorting (ASC -> DESC -> RESET)
  const handleSort = (columnKey: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== columnKey) {
        return { key: columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key: columnKey, direction: "desc" };
      }
      return null;
    });
  };

  // Unique values for any selected column to populate filter dropdown
  const uniqueValuesForColumn = useMemo(() => {
    if (!newFilterCol) return [];
    const set = new Set<string>();
    rows.forEach((r) => {
      const v = r[newFilterCol];
      if (v !== undefined && v !== null && String(v).trim()) {
        set.add(String(v).trim());
      }
    });
    return Array.from(set).sort();
  }, [rows, newFilterCol]);

  const addFilter = () => {
    if (!newFilterCol || !newFilterVal) return;
    setActiveFilters((prev) => [
      ...prev.filter((f) => f.column !== newFilterCol),
      { column: newFilterCol, value: newFilterVal },
    ]);
    setNewFilterVal("");
  };

  const removeFilter = (col: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.column !== col));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setSortConfig(null);
  };

  // Filter & Sort Pipeline
  const processedRows = useMemo(() => {
    let result = [...rows];

    // 1. Column-specific filters
    if (activeFilters.length > 0) {
      result = result.filter((row) => {
        return activeFilters.every((f) => {
          const rowVal = row[f.column];
          if (!rowVal) return false;
          return String(rowVal).trim().toLowerCase() === f.value.toLowerCase();
        });
      });
    }

    // 2. Global search query across all cells
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) => {
        return Object.values(row).some((val) => {
          if (!val) return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // 3. Sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? "";
        const valB = b[sortConfig.key] ?? "";

        // Number comparison
        const numA = parseFloat(String(valA).replace(/[^0-9.-]/g, ""));
        const numB = parseFloat(String(valB).replace(/[^0-9.-]/g, ""));
        if (!isNaN(numA) && !isNaN(numB) && !isNaN(Number(valA)) && !isNaN(Number(valB))) {
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        // Date comparison
        const dateA = new Date(valA).getTime();
        const dateB = new Date(valB).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        // Alphabetical comparison
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
        if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rows, activeFilters, searchQuery, sortConfig]);

  // Distribution Statistics for Division Choices
  const divisionStats = useMemo(() => {
    const p1Key = headers.find((h) => h.toLowerCase().includes("divisi") && h.toLowerCase().includes("pilihan 1"));
    const p2Key = headers.find((h) => h.toLowerCase().includes("divisi") && h.toLowerCase().includes("pilihan 2"));
    
    const countP1: Record<string, number> = {};
    const countP2: Record<string, number> = {};

    rows.forEach((r) => {
      if (p1Key && r[p1Key]) {
        countP1[r[p1Key]] = (countP1[r[p1Key]] || 0) + 1;
      }
      if (p2Key && r[p2Key]) {
        countP2[r[p2Key]] = (countP2[r[p2Key]] || 0) + 1;
      }
    });

    return { countP1, countP2, p1Key, p2Key };
  }, [rows, headers]);

  // Export processed data to Excel (.xlsx) including Review Status & Notes
  const handleDownloadExcel = () => {
    if (processedRows.length === 0) {
      alert("Belum ada data tanggapan untuk diunduh.");
      return;
    }

    const exportRows = processedRows.map((row, idx) => {
      const rowId = row["ID Respon"] || `row_${idx}`;
      const rev = reviewNotes[rowId] || { status: "Belum Direview", note: "" };

      const base: Record<string, any> = {
        No: idx + 1,
        "Status Seleksi": rev.status,
        "Catatan Panitia": rev.note || "-",
      };

      headers.forEach((h) => {
        if (h !== "No") {
          base[h] = row[h] || "-";
        }
      });

      return base;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);

    const keys = Object.keys(exportRows[0] || {});
    ws["!cols"] = keys.map((key) => {
      let maxLen = key.length;
      exportRows.forEach((r) => {
        const valLen = String(r[key] || "").length;
        if (valLen > maxLen) maxLen = valLen;
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
    });

    XLSX.utils.book_append_sheet(wb, ws, "Rekap Tanggapan");
    const cleanTitle = (form?.title || "Rekap").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    XLSX.writeFile(wb, `Rekap_${cleanTitle}_${dateTag}.xlsx`);
  };

  const toggleColumnVisibility = (colName: string) => {
    setHiddenColumns((prev) =>
      prev.includes(colName) ? prev.filter((c) => c !== colName) : [...prev, colName]
    );
  };

  const visibleHeaders = useMemo(() => {
    return headers.filter((h) => !hiddenColumns.includes(h));
  }, [headers, hiddenColumns]);

  // Format cell display
  const renderCellContent = (key: string, val: any) => {
    if (val === undefined || val === null || val === "") {
      return <span className="text-slate-300">-</span>;
    }

    const strVal = String(val).trim();

    // Check if URL
    if (strVal.startsWith("http://") || strVal.startsWith("https://")) {
      return (
        <a
          href={strVal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold transition-all max-w-[260px] truncate"
          title={strVal}
        >
          <ExternalLink size={13} className="shrink-0" />
          <span className="truncate">{strVal.replace(/^https?:\/\//, "")}</span>
        </a>
      );
    }

    // Badge styling for divisions and options
    if (
      key.toLowerCase().includes("divisi") ||
      key.toLowerCase().includes("jurusan") ||
      strVal === "Ya" ||
      strVal === "Tidak" ||
      strVal === "Berhalangan" ||
      strVal === "Tidak Berhalangan"
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
      else if (strVal === "Ya" || strVal === "Tidak Berhalangan") badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold";
      else if (strVal === "Tidak" || strVal === "Berhalangan") badgeBg = "bg-rose-50 text-rose-700 border-rose-200 font-bold";

      return (
        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs border ${badgeBg} whitespace-nowrap`}>
          {strVal}
        </span>
      );
    }

    // Long paragraphs
    if (strVal.length > 55) {
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
      <div className="w-[96%] lg:w-[94%] mx-auto flex flex-col gap-5">

        {/* Top Breadcrumb & Live Sync */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-200/70 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Link href="/join" className="hover:text-primary flex items-center gap-1 transition-colors">
              <ChevronLeft size={16} /> Daftar Formulir
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-primary font-bold">Portal Manajemen Rekap Divisi</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Live Sync</span>
            </div>

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

        {/* Hero Banner Header */}
        <div className="rounded-[30px] bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_12px_40px_rgba(62,64,149,0.06)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold">
                <FileSpreadsheet size={18} />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Spreadsheet Manajemen & Seleksi Responden
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {form?.title || "Rekap Tanggapan"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600">
              Dilengkapi fitur pengurutan (sorting), multi-filter kolom, status review seleksi pendaftar, dan ekspor data langsung ke Excel.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
              <span>Sinkronisasi: {lastUpdated.toLocaleTimeString("id-ID")} WIB</span>
              <span>•</span>
              <Link
                href={`/form/${slug}`}
                target="_blank"
                className="text-primary hover:underline font-bold inline-flex items-center gap-1 font-plusJakarta"
              >
                <span>Buka Form Pendaftaran</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Counter, Stats & Download */}
          <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
            <div className="flex items-center gap-3 bg-slate-50 border border-gray-200/80 px-4 py-2 rounded-2xl">
              <Users size={20} className="text-primary" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Responden</p>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none">
                  {rows.length} <span className="text-xs font-normal text-slate-500">Orang</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                title="Lihat ringkasan distribusi per divisi"
              >
                <BarChart3 size={15} />
                <span>Statistik Divisi</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadExcel}
                disabled={rows.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40"
              >
                <Download size={16} />
                <span>Download Excel (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spreadsheet Management Toolbar */}
        <div className="flex flex-col gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, alasan, divisi..."
                className="w-full h-10 pl-10 pr-8 rounded-xl border border-gray-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
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

            {/* Toolbar Buttons: Filter & Columns */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Filter Panel Toggle */}
              <button
                type="button"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  showFilterPanel || activeFilters.length > 0
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-gray-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter size={14} />
                <span>Filter Kolom</span>
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              {/* Column Visibility Selector Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColSelector(!showColSelector)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border bg-white border-gray-200 text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Columns size={14} />
                  <span>Atur Kolom</span>
                </button>

                {showColSelector && (
                  <div className="absolute right-0 top-12 z-30 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-2 animate-scaleUp">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs font-bold text-slate-800">Pilih Kolom Tampil</span>
                      <button
                        type="button"
                        onClick={() => setShowColSelector(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-56 overflow-y-auto flex flex-col gap-1.5">
                      {headers.map((h, i) => (
                        <label key={i} className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg">
                          <input
                            type="checkbox"
                            checked={!hiddenColumns.includes(h)}
                            onChange={() => toggleColumnVisibility(h)}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <span className="truncate">{h}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Sort & Filters */}
              {(sortConfig || activeFilters.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  title="Hapus semua filter dan sorting"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}

              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-auto">
                {processedRows.length} dari {rows.length} baris
              </span>
            </div>
          </div>

          {/* Active Filter Panel (Dropdown Builder) */}
          {showFilterPanel && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 flex flex-col gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Berdasarkan:</span>
                
                {/* Select Column */}
                <select
                  value={newFilterCol}
                  onChange={(e) => {
                    setNewFilterCol(e.target.value);
                    setNewFilterVal("");
                  }}
                  className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">-- Pilih Kolom --</option>
                  {headers.map((h, i) => (
                    <option key={i} value={h}>
                      {h}
                    </option>
                  ))}
                </select>

                {/* Select Value from that column */}
                {newFilterCol && (
                  <select
                    value={newFilterVal}
                    onChange={(e) => setNewFilterVal(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-xs truncate"
                  >
                    <option value="">-- Pilih Nilai ({uniqueValuesForColumn.length}) --</option>
                    {uniqueValuesForColumn.map((val, vIdx) => (
                      <option key={vIdx} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={addFilter}
                  disabled={!newFilterCol || !newFilterVal}
                  className="px-4 py-2 bg-primary disabled:opacity-40 text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  Terapkan Filter
                </button>
              </div>

              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/70">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Filter Aktif:</span>
                  {activeFilters.map((af, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-primary/30 text-primary rounded-lg text-xs font-bold shadow-xs"
                    >
                      <span>{af.column}: <strong>{af.value}</strong></span>
                      <button
                        type="button"
                        onClick={() => removeFilter(af.column)}
                        className="hover:text-rose-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
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
                {/* Sticky Header with Sorting Indicators */}
                <thead className="bg-slate-100/95 sticky top-0 z-20 backdrop-blur-md border-b border-gray-200">
                  <tr>
                    {/* Fixed Selection Status Column for Panitia */}
                    <th className="px-3 py-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-100 z-30 w-36 border-r border-gray-200">
                      Status Seleksi
                    </th>

                    {visibleHeaders.map((header, hIdx) => {
                      const isSorted = sortConfig?.key === header;
                      return (
                        <th
                          key={hIdx}
                          onClick={() => handleSort(header)}
                          className="px-4 py-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200/80 cursor-pointer hover:bg-slate-200/70 transition-colors select-none group"
                          title="Klik untuk mengurutkan (A-Z / Z-A)"
                        >
                          <div className="flex items-center gap-1.5 justify-between">
                            <span>{header}</span>
                            <span className="text-slate-400 group-hover:text-primary transition-colors">
                              {isSorted ? (
                                sortConfig.direction === "asc" ? (
                                  <ArrowUp size={13} className="text-primary font-bold" />
                                ) : (
                                  <ArrowDown size={13} className="text-primary font-bold" />
                                )
                              ) : (
                                <ArrowUpDown size={12} className="opacity-40 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      );
                    })}

                    {/* Action Note Column */}
                    <th className="px-4 py-3 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-slate-100 z-20 border-l border-gray-200">
                      Catatan Panitia
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {processedRows.length === 0 ? (
                    <tr>
                      <td colSpan={visibleHeaders.length + 2} className="text-center py-12 text-xs text-slate-400">
                        Tidak ada data yang cocok dengan kriteria filter atau pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    processedRows.map((row, rIdx) => {
                      const rowId = row["ID Respon"] || `row_${rIdx}`;
                      const review = reviewNotes[rowId] || { status: "Belum Direview", note: "" };
                      const currentStatusOpt = REVIEW_STATUS_OPTIONS.find((s) => s.label === review.status) || REVIEW_STATUS_OPTIONS[0];

                      return (
                        <tr key={rIdx} className="hover:bg-primary/[0.02] transition-colors group">
                          {/* Selection Status Dropdown */}
                          <td className="px-3 py-2.5 border-r border-gray-200/80 sticky left-0 bg-white group-hover:bg-[#F9F9FD] z-10 align-middle">
                            <select
                              value={review.status}
                              onChange={(e) => saveReviewNote(rowId, e.target.value as ReviewStatus)}
                              className={`w-full py-1 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${currentStatusOpt.bg} ${currentStatusOpt.color} ${currentStatusOpt.border}`}
                            >
                              {REVIEW_STATUS_OPTIONS.map((opt, oIdx) => (
                                <option key={oIdx} value={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Data Cells */}
                          {visibleHeaders.map((header, cIdx) => (
                            <td key={cIdx} className="px-4 py-3 border-r border-gray-100/80 text-xs align-middle">
                              {renderCellContent(header, row[header])}
                            </td>
                          ))}

                          {/* Review Note Column */}
                          <td className="px-3 py-2.5 border-l border-gray-200/80 sticky right-0 bg-white group-hover:bg-[#F9F9FD] z-10 align-middle">
                            {editingNoteId === rowId ? (
                              <div className="flex items-center gap-1.5 min-w-[200px]">
                                <input
                                  type="text"
                                  value={tempNoteText}
                                  onChange={(e) => setTempNoteText(e.target.value)}
                                  placeholder="Tulis catatan..."
                                  className="w-full h-8 px-2.5 rounded-lg border border-primary text-xs focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    saveReviewNote(rowId, review.status, tempNoteText);
                                    setEditingNoteId(null);
                                  }}
                                  className="px-2 py-1 bg-primary text-white rounded text-[11px] font-bold"
                                >
                                  Simpan
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(rowId);
                                  setTempNoteText(review.note || "");
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-xs text-slate-600 transition-colors max-w-[180px] truncate"
                                title="Klik untuk edit catatan panitia"
                              >
                                <MessageSquare size={13} className="text-slate-400 shrink-0" />
                                <span className="truncate">{review.note || "Tambah catatan..."}</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer Summary */}
          {rows.length > 0 && (
            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-gray-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <BookmarkCheck size={14} className="text-primary" />
                <span>Status seleksi dan catatan panitia otomatis tersimpan di perangkat ini & ikut terunduh di file Excel.</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Menampilkan {processedRows.length} dari {rows.length} responden
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

      {/* Modal Quick Distribution Stats */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <BarChart3 size={20} />
                <span>Distribusi Pilihan Divisi Responden</span>
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Pilihan 1 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 flex flex-col gap-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pb-1 border-b border-gray-200">
                  Pilihan Utama (Pilihan 1)
                </h4>
                {Object.keys(divisionStats.countP1).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Belum ada data</p>
                ) : (
                  Object.entries(divisionStats.countP1).map(([div, cnt], idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100/70">
                      <span className="font-semibold text-slate-700 truncate">{div}</span>
                      <span className="font-mono font-extrabold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                        {cnt} orang
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Pilihan 2 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 flex flex-col gap-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pb-1 border-b border-gray-200">
                  Pilihan Alternatif (Pilihan 2)
                </h4>
                {Object.keys(divisionStats.countP2).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Belum ada data</p>
                ) : (
                  Object.entries(divisionStats.countP2).map(([div, cnt], idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100/70">
                      <span className="font-semibold text-slate-700 truncate">{div}</span>
                      <span className="font-mono font-extrabold text-purple-700 px-2 py-0.5 bg-purple-50 rounded-md">
                        {cnt} orang
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
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
