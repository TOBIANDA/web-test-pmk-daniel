"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formService } from "@/services/formService";
import { DynamicForm } from "@/types/form";
import { 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Loader2, 
  Layers
} from "lucide-react";

export default function JoinPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActiveForms() {
      try {
        const data = await formService.getForms(true);
        setForms(data);
      } catch (err) {
        console.error("Failed to load active forms:", err);
      } finally {
        setLoading(false);
      }
    }
    loadActiveForms();
  }, []);

  return (
    <main className="min-h-screen pt-36 pb-24 w-[85%] lg:w-[80%] mx-auto font-plusJakarta">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header Title */}
        <div className="text-center flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} /> PMK Daniel FILKOM UB
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Form & Pendataan Anggota
          </h1>
          <p className="text-sm sm:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            Pilih formulir di bawah ini untuk mendaftarkan diri, bergabung dalam kepanitiaan, atau memperbarui data persekutuan.
          </p>
        </div>

        {/* List of Active Forms */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="h-9 w-9 animate-spin text-primary mb-3" />
            <p className="text-sm text-slate-500 font-medium">Memuat daftar formulir aktif...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/70 p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
              <FileSpreadsheet size={32} />
            </div>
            <h2 className="font-extrabold text-xl text-slate-800 mb-2">
              Belum Ada Formulir yang Dibuka
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Saat ini belum ada formulir pendaftaran yang sedang aktif. Silakan pantau pengumuman terbaru kami di beranda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white/90 backdrop-blur-xl rounded-[30px] border border-gray-200/80 p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(62,64,149,0.08)] hover:border-primary/40 transition-all flex flex-col justify-between gap-6 group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Menerima Tanggapan
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {form.fields_schema?.length || 0} Pertanyaan
                    </span>
                  </div>

                  <h2 className="font-extrabold text-xl text-slate-900 leading-snug group-hover:text-primary transition-colors">
                    {form.title}
                  </h2>

                  {form.description && (
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {form.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/form/${form.slug}`}
                  className="inline-flex items-center justify-between gap-2 px-6 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs sm:text-sm rounded-full shadow-md shadow-primary/20 hover:opacity-95 transition-all w-full"
                >
                  <span>Buka & Isi Formulir</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
