"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DynamicForm } from "@/types/form";
import { formService } from "@/services/formService";
import FormBuilderModal from "./components/formBuilderModal";
import FormResponsesModal from "./components/formResponsesModal";
import { 
  Plus, 
  Search, 
  FileSpreadsheet, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  Download, 
  Users, 
  CheckCircle2, 
  Loader2,
  LayoutDashboard,
  Megaphone,
  LogOut,
  Sparkles
} from "lucide-react";

export default function FormManagementPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modals state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isResponsesOpen, setIsResponsesOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await formService.getForms();
      setForms(data);
    } catch (err) {
      console.error("Failed to load forms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/form/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleToggleStatus = async (form: DynamicForm) => {
    setTogglingId(form.id);
    const newStatus = form.is_active === 1 ? 0 : 1;
    try {
      await formService.updateForm(form.id, { is_active: newStatus });
      setForms((prev) =>
        prev.map((f) => (f.id === form.id ? { ...f, is_active: newStatus } : f))
      );
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status formulir");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteForm = async (form: DynamicForm) => {
    const confirmText = prompt(
      `Ketik "HAPUS" untuk mengonfirmasi penghapusan formulir "${form.title}" dan seluruh data responnya:`
    );
    if (confirmText !== "HAPUS") return;

    setDeletingId(form.id);
    try {
      await formService.deleteForm(form.id);
      setForms((prev) => prev.filter((f) => f.id !== form.id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus formulir");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDirectExportCsv = (formId: string) => {
    const csvUrl = formService.getExportCsvUrl(formId);
    window.open(csvUrl, "_blank");
  };

  const filteredForms = forms.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.title.toLowerCase().includes(q) || f.slug.toLowerCase().includes(q);
  });

  const totalSubmissions = forms.reduce((acc, f) => acc + (f.submission_count || 0), 0);
  const activeFormsCount = forms.filter((f) => f.is_active === 1).length;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-plusJakarta text-slate-900">
      {/* Sidebar Navigasi Kiri */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[230px] flex-col bg-white border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Banner */}
        <div className="relative flex h-[220px] w-full flex-col items-center justify-center bg-gradient-to-b from-primary via-primary to-[#172a6b] px-4 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative h-[72px] w-[72px] drop-shadow-md">
            <Image
              src="/logo.png"
              alt="Logo PMK Daniel"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="mt-3 font-plusJakarta text-xl font-extrabold text-white tracking-wide">
            PMK DANIEL
          </h2>
          <p className="text-[11px] font-medium text-slate-300">
            Admin Management
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="mt-6 flex w-full flex-col px-3 gap-1">
          <Link
            href="/daudpakeketapel"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-all font-semibold text-sm"
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/limarotiduaikan"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-all font-semibold text-sm"
          >
            <Megaphone size={19} />
            <span>Pengumuman</span>
          </Link>
          <Link
            href="/bahteranabinuh"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm shadow-sm"
          >
            <FileSpreadsheet size={19} className="text-primary" />
            <span>Formulir</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <Link
            href="/pausmakanyunus"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("pmk_admin_token");
                localStorage.removeItem("admin_token");
              }
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors"
          >
            <LogOut size={19} />
            <span>Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <main className="ml-[230px] flex flex-1 flex-col px-8 py-10 lg:px-14 lg:py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          
          {/* Header Banner */}
          <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1d4ed8] p-8 sm:p-10 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-secondary text-xs font-bold uppercase tracking-wider w-fit">
                <Sparkles size={13} /> Sistem Formulir Mandiri
              </span>
              <h1 className="font-plusJakarta text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Kelola Formulir & Pendataan
              </h1>
              <p className="font-plusJakarta text-sm text-slate-200 leading-relaxed mt-1">
                Buat kustom formulir pendaftaran bergaya Google Form dan ekspor seluruh respon jawaban langsung ke spreadsheet CSV.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedForm(null);
                setIsBuilderOpen(true);
              }}
              className="relative z-10 inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-plusJakarta font-extrabold text-sm rounded-full shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
            >
              <Plus size={20} strokeWidth={3} />
              <span>Buat Formulir Baru</span>
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Formulir
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1.5">
                  {forms.length}
                </p>
                <span className="text-xs text-slate-500 mt-1 block">Tersimpan di database</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <FileSpreadsheet size={28} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Formulir Aktif
                </p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1.5">
                  {activeFormsCount}
                </p>
                <span className="text-xs text-emerald-600/80 mt-1 block">Siap menerima tanggapan</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={28} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Tanggapan Masuk
                </p>
                <p className="text-3xl font-extrabold text-purple-600 mt-1.5">
                  {totalSubmissions}
                </p>
                <span className="text-xs text-purple-600/80 mt-1 block">Dari seluruh formulir</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                <Users size={28} />
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative w-full sm:w-88">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan judul atau slug..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 font-plusJakarta text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-slate-800"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              Menampilkan {filteredForms.length} dari {forms.length} formulir
            </span>
          </div>

          {/* Forms List Cards */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="font-plusJakarta text-sm text-slate-500 font-medium">
                Sinkronisasi data formulir...
              </p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <FileSpreadsheet size={40} />
              </div>
              <h3 className="font-plusJakarta font-extrabold text-slate-800 text-xl mb-1">
                Belum Ada Formulir Dibuat
              </h3>
              <p className="font-plusJakarta text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Mulai susun formulir pendaftaran pertama Anda dengan susunan pertanyaan kustom mirip Google Form.
              </p>
              <button
                onClick={() => {
                  setSelectedForm(null);
                  setIsBuilderOpen(true);
                }}
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-plusJakarta font-bold text-xs rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Plus size={16} /> Buat Formulir Sekarang
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                >
                  {/* Left Form Metadata */}
                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Active Status Badge Button */}
                      <button
                        onClick={() => handleToggleStatus(form)}
                        disabled={togglingId === form.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-plusJakarta transition-all ${
                          form.is_active === 1
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        }`}
                        title="Klik untuk membuka / menutup form"
                      >
                        {togglingId === form.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : form.is_active === 1 ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Menerima Tanggapan</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Ditutup</span>
                          </>
                        )}
                      </button>

                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-bold">
                        {form.fields_schema?.length || 0} Pertanyaan
                      </span>
                    </div>

                    <h2 className="font-plusJakarta font-extrabold text-xl text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      {form.title}
                    </h2>

                    {form.description && (
                      <p className="font-plusJakarta text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {form.description}
                      </p>
                    )}

                    {/* URL Link Pill */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 pt-2 border-t border-slate-100">
                      <div className="flex items-center bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-600 truncate max-w-sm">
                        /form/{form.slug}
                      </div>

                      <button
                        onClick={() => handleCopyLink(form.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-plusJakarta transition-colors"
                        title="Salin Tautan Publik"
                      >
                        {copiedSlug === form.slug ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-700">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/form/${form.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold font-plusJakarta transition-colors"
                        title="Buka Form di Tab Baru"
                      >
                        <ExternalLink size={13} />
                        <span>Buka Form</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Actions Bar */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {/* View Responses Button */}
                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setIsResponsesOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-primary hover:to-blue-700 text-white font-plusJakarta font-bold text-xs rounded-2xl shadow-md transition-all"
                    >
                      <Users size={16} />
                      <span>{form.submission_count || 0} Responden</span>
                    </button>

                    {/* Direct Export CSV Button */}
                    <button
                      onClick={() => handleDirectExportCsv(form.id)}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-plusJakarta font-bold text-xs rounded-2xl shadow-md shadow-emerald-600/20 transition-all"
                      title="Download langsung file spreadsheet CSV"
                    >
                      <Download size={15} />
                      <span>Unduh CSV</span>
                    </button>

                    {/* Edit Form */}
                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setIsBuilderOpen(true);
                      }}
                      className="p-3 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200"
                      title="Edit Pertanyaan Formulir"
                    >
                      <Edit3 size={17} />
                    </button>

                    {/* Delete Form */}
                    <button
                      onClick={() => handleDeleteForm(form)}
                      disabled={deletingId === form.id}
                      className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors border border-slate-200"
                      title="Hapus Formulir"
                    >
                      {deletingId === form.id ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      <FormBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setSelectedForm(null);
        }}
        onSuccess={fetchForms}
        initialForm={selectedForm}
      />

      <FormResponsesModal
        isOpen={isResponsesOpen}
        onClose={() => {
          setIsResponsesOpen(false);
          setSelectedForm(null);
        }}
        form={selectedForm}
      />
    </div>
  );
}
