"use client";

import React, { useState, useEffect } from "react";
import { DynamicForm, FormSubmission } from "@/types/form";
import { formService } from "@/services/formService";
import { exportSubmissionsToExcel, exportSubmissionsToCsv } from "@/utils/formExport";
import { 
  X, 
  Download, 
  Trash2, 
  Search, 
  Loader2, 
  ExternalLink, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft
} from "lucide-react";

interface FormResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: DynamicForm | null;
  onSubmissionsUpdated?: (formId: string, newCount: number) => void;
}

export default function FormResponsesModal({
  isOpen,
  onClose,
  form,
  onSubmissionsUpdated,
}: FormResponsesModalProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Lock body scroll and prevent Lenis smooth scroll from hijacking modal scroll
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

  useEffect(() => {
    if (isOpen && form) {
      loadSubmissions();
    }
  }, [isOpen, form]);

  const loadSubmissions = async () => {
    if (!form) return;
    setLoading(true);
    try {
      const data = await formService.getSubmissions(form.id);
      setSubmissions(data);
      if (data.length !== form.submission_count) {
        onSubmissionsUpdated?.(form.id, data.length);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !form) return null;

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!window.confirm("Hapus respon responden ini secara permanen? Data yang sudah dihapus tidak dapat dipulihkan.")) return;
    setDeletingId(submissionId);
    try {
      await formService.deleteSubmission(submissionId, form.id);
      const updated = submissions.filter((s) => s.id !== submissionId);
      setSubmissions(updated);
      onSubmissionsUpdated?.(form.id, updated.length);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus respon");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadCsv = () => {
    exportSubmissionsToCsv(form, submissions);
  };

  const handleDownloadExcel = () => {
    exportSubmissionsToExcel(form, submissions);
  };

  // Filter submissions by any field answer
  const filteredSubmissions = submissions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const allText = Object.values(s.answers || {}).join(" ").toLowerCase();
    return allText.includes(q) || s.id.toLowerCase().includes(q);
  });

  return (
    <div 
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto overscroll-contain"
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-6xl bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto animate-scaleUp"
      >
        
        {/* Header Modal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="font-plusJakarta font-extrabold text-lg text-slate-900 leading-tight">
                Rekap Tanggapan: {form.title}
              </h2>
              <p className="font-plusJakarta text-xs text-slate-500 mt-0.5">
                Total <span className="font-bold text-slate-800">{submissions.length}</span> responden terdata • Ekspor langsung ke Excel (.xlsx) atau CSV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExcel}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-plusJakarta font-bold text-xs rounded-full shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              title="Unduh format spreadsheet Microsoft Excel (.xlsx)"
            >
              <Download size={14} />
              <span>Unduh Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-plusJakarta font-bold text-xs rounded-full border border-slate-300 transition-all cursor-pointer"
              title="Unduh format CSV standar"
            >
              <Download size={14} />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 px-6 sm:px-8 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari respon berdasarkan nama, NIM, atau teks..."
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-slate-50 text-xs font-plusJakarta focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <ArrowRightLeft size={12} /> Geser tabel ke samping untuk melihat seluruh kolom
            </span>
            <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full text-[11px]">
              {filteredSubmissions.length} dari {submissions.length} respon
            </span>
          </div>
        </div>

        {/* Submissions Table / View */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain p-4 sm:p-6 bg-slate-50/50"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-9 w-9 animate-spin text-primary mb-2" />
              <p className="text-xs text-slate-500 font-medium">Memuat data respon...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8">
              <AlertCircle size={36} className="text-slate-300 mx-auto mb-2" />
              <h3 className="font-plusJakarta font-bold text-slate-700 text-sm">
                Belum Ada Tanggapan Masuk
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Tautan formulir publik dapat dibagikan kepada anggota untuk mulai mengumpulkan tanggapan.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-max min-w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-gray-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="sticky left-0 z-30 bg-slate-100 p-3.5 pl-4 w-12 text-center border-r border-slate-200 shadow-[2px_0_6px_rgba(0,0,0,0.03)]">
                      No
                    </th>
                    <th className="p-3.5 whitespace-nowrap min-w-[140px]">
                      Waktu Submit
                    </th>
                    {form.fields_schema.map((field) => (
                      <th key={field.id} className="p-3.5 whitespace-nowrap min-w-[200px] max-w-xs">
                        {field.label}
                      </th>
                    ))}
                    <th className="sticky right-0 z-30 bg-slate-100 p-3.5 pr-4 text-center w-20 min-w-[80px] border-l border-slate-200 shadow-[-3px_0_8px_rgba(0,0,0,0.04)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-plusJakarta text-slate-800">
                  {filteredSubmissions.map((sub, idx) => (
                    <tr key={sub.id} className="group hover:bg-slate-50/80 transition-colors">
                      {/* Sticky Left: No */}
                      <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 p-3.5 pl-4 text-center font-mono text-slate-400 font-semibold border-r border-slate-100 shadow-[2px_0_6px_rgba(0,0,0,0.03)]">
                        {idx + 1}
                      </td>

                      {/* Waktu Submit */}
                      <td className="p-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(sub.submitted_at).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>

                      {/* Field Answers Cells */}
                      {form.fields_schema.map((field) => {
                        const val = sub.answers ? sub.answers[field.id] : null;

                        if (field.type === "file" && typeof val === "string" && val.startsWith("http")) {
                          return (
                            <td key={field.id} className="p-3.5 min-w-[200px]">
                              <a
                                href={val}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-bold text-xs transition-colors"
                              >
                                <span>Lihat Berkas</span>
                                <ExternalLink size={12} />
                              </a>
                            </td>
                          );
                        }

                        if (Array.isArray(val)) {
                          return (
                            <td key={field.id} className="p-3.5 min-w-[200px]">
                              <div className="flex flex-wrap gap-1">
                                {val.map((item, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td 
                            key={field.id} 
                            className="p-3.5 min-w-[200px] max-w-sm whitespace-normal break-words leading-relaxed text-slate-700" 
                            title={String(val || "")}
                          >
                            {val !== undefined && val !== null && val !== "" ? (
                              String(val)
                            ) : (
                              <span className="text-slate-300 italic">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Sticky Right: Actions / Delete Button */}
                      <td className="sticky right-0 z-20 bg-white group-hover:bg-slate-50 p-3.5 pr-4 text-center border-l border-slate-100 shadow-[-3px_0_8px_rgba(0,0,0,0.04)]">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubmission(sub.id)}
                          disabled={deletingId === sub.id}
                          className="inline-flex items-center justify-center p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-all border border-rose-100 hover:border-rose-600 shadow-xs cursor-pointer"
                          title="Hapus baris tanggapan ini"
                        >
                          {deletingId === sub.id ? (
                            <Loader2 size={15} className="animate-spin text-rose-500" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-plusJakarta shrink-0">
          <span className="flex items-center gap-1.5 text-center sm:text-left">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> Format CSV & Excel aman dibuka langsung dengan karakter dan penataan kolom otomatis
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white border border-gray-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

