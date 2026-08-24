"use client";

import React, { useState, useEffect } from "react";
import { DynamicForm, FormSubmission } from "@/types/form";
import { formService } from "@/services/formService";
import { 
  X, 
  Download, 
  Trash2, 
  Search, 
  Loader2, 
  ExternalLink, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FormResponsesModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: DynamicForm | null;
}

export default function FormResponsesModal({
  isOpen,
  onClose,
  form,
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
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !form) return null;

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!window.confirm("Hapus respon responden ini secara permanen?")) return;
    setDeletingId(submissionId);
    try {
      await formService.deleteSubmission(submissionId);
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus respon");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadCsv = () => {
    const csvUrl = formService.getExportCsvUrl(form.id);
    window.open(csvUrl, "_blank");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-5xl bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-scaleUp"
      >
        
        {/* Header Modal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="font-plusJakarta font-extrabold text-lg text-slate-900 leading-tight">
                Rekap Tanggapan: {form.title}
              </h2>
              <p className="font-plusJakarta text-xs text-slate-500 mt-0.5">
                Total {submissions.length} responden terdata • Ekspor langsung ke format CSV spreadsheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCsv}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-plusJakarta font-bold text-xs rounded-full shadow-md shadow-emerald-600/20 transition-all"
              title="Unduh seluruh data dalam format CSV untuk Microsoft Excel / Google Sheets"
            >
              <Download size={14} />
              <span>Unduh CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 px-8 border-b border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
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

          <span className="text-xs text-slate-500 font-semibold">
            Menampilkan {filteredSubmissions.length} dari {submissions.length} respon
          </span>
        </div>

        {/* Submissions Table / View */}
        <div 
          data-lenis-prevent="true"
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain p-6 bg-slate-50/50"
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
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-gray-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 pl-4 w-12 text-center">No</th>
                    <th className="p-3.5 whitespace-nowrap">Waktu Submit</th>
                    {form.fields_schema.map((field) => (
                      <th key={field.id} className="p-3.5 whitespace-nowrap max-w-xs truncate">
                        {field.label}
                      </th>
                    ))}
                    <th className="p-3.5 pr-4 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-plusJakarta text-slate-800">
                  {filteredSubmissions.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 pl-4 text-center font-mono text-slate-400 font-semibold">
                        {idx + 1}
                      </td>
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
                            <td key={field.id} className="p-3.5">
                              <a
                                href={val}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-xs"
                              >
                                <span>Lihat Berkas</span>
                                <ExternalLink size={12} />
                              </a>
                            </td>
                          );
                        }

                        if (Array.isArray(val)) {
                          return (
                            <td key={field.id} className="p-3.5">
                              <div className="flex flex-wrap gap-1">
                                {val.map((item, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px]"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={field.id} className="p-3.5 max-w-xs truncate" title={String(val || "")}>
                            {val !== undefined && val !== null && val !== "" ? (
                              String(val)
                            ) : (
                              <span className="text-slate-300 italic">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Actions */}
                      <td className="p-3.5 pr-4 text-center">
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          disabled={deletingId === sub.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus baris tanggapan ini"
                        >
                          {deletingId === sub.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
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
        <div className="px-8 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500 font-plusJakarta shrink-0">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" /> Format CSV menggunakan UTF-8 BOM sehingga aman dibuka langsung di Microsoft Excel
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white border border-gray-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
