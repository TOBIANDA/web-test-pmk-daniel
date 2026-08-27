"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formService } from "@/services/formService";
import { DynamicForm, FormField, FieldValidation } from "@/types/form";
import { 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  Send,
  HeartHandshake
} from "lucide-react";

export default function PublicDynamicFormPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  // Form values: field_id -> answer
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // File upload state: field_id -> { uploading: boolean, fileName?: string, url?: string, error?: string }
  const [fileStates, setFileStates] = useState<Record<string, { uploading: boolean; fileName?: string; url?: string; error?: string }>>({});
  // Validation errors per field
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    async function loadForm() {
      try {
        setLoading(true);
        setErrorMsg(null);
        const data = await formService.getFormBySlugOrId(slug);
        if (isMounted) {
          if (!data) {
            setErrorMsg("Formulir tidak ditemukan atau tautan sudah kedaluwarsa.");
          } else {
            setForm(data);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error loading form:", err);
          setErrorMsg(err.message || "Gagal memuat formulir.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadForm();
    return () => { isMounted = false; };
  }, [slug]);

  // Calculate progress percentage
  const progressStats = useMemo(() => {
    if (!form || !form.fields_schema || form.fields_schema.length === 0) {
      return { filled: 0, total: 0, percentage: 0 };
    }
    const total = form.fields_schema.length;
    let filled = 0;

    for (const field of form.fields_schema) {
      const val = answers[field.id];
      if (val !== undefined && val !== null && val !== "") {
        if (Array.isArray(val) && val.length === 0) continue;
        filled++;
      }
    }

    const percentage = Math.round((filled / total) * 100);
    return { filled, total, percentage };
  }, [form, answers]);

  // ============================================================
  // VALIDATION HELPER
  // ============================================================
  const validateField = (field: FormField, value: any): string | null => {
    const v: FieldValidation | undefined = field.validation;
    if (!v || value === undefined || value === null || value === "") return null;

    const strVal = typeof value === "string" ? value : String(value);
    const numVal = parseFloat(strVal);

    const err = (msg: string) => v.errorMessage || msg;

    switch (v.type) {
      case "number":
        if (!/^-?\d+([.,]\d+)?$/.test(strVal.trim()))
          return err("Jawaban harus berupa angka");
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal.trim()))
          return err("Format email tidak valid (contoh: nama@email.com)");
        break;
      case "url":
        try { new URL(strVal.trim()); } catch { return err("Format URL tidak valid (contoh: https://example.com)"); }
        break;
      case "phone":
        if (!/^(\+62|62|0)[0-9]{8,13}$/.test(strVal.trim().replace(/\s|-/g, "")))
          return err("Format nomor telepon tidak valid (contoh: 08123456789)");
        break;
      case "min_length": {
        const min = parseInt(v.value || "0", 10);
        if (strVal.length < min) return err(`Jawaban minimal ${min} karakter (saat ini: ${strVal.length})`);
        break;
      }
      case "max_length": {
        const max = parseInt(v.value || "9999", 10);
        if (strVal.length > max) return err(`Jawaban maksimal ${max} karakter (saat ini: ${strVal.length})`);
        break;
      }
      case "min_value": {
        const min = parseFloat(v.value || "0");
        if (isNaN(numVal) || numVal < min) return err(`Nilai harus ≥ ${min}`);
        break;
      }
      case "max_value": {
        const max = parseFloat(v.value || "0");
        if (isNaN(numVal) || numVal > max) return err(`Nilai harus ≤ ${max}`);
        break;
      }
      case "regex": {
        try {
          const pattern = new RegExp(v.value || "");
          if (!pattern.test(strVal)) return err("Format jawaban tidak sesuai");
        } catch { /* invalid regex — skip */ }
        break;
      }
      case "min_checked": {
        const arr = Array.isArray(value) ? value : [];
        const min = parseInt(v.value || "1", 10);
        if (arr.length < min) return err(`Pilih minimal ${min} opsi`);
        break;
      }
      case "max_checked": {
        const arr = Array.isArray(value) ? value : [];
        const max = parseInt(v.value || "9999", 10);
        if (arr.length > max) return err(`Maksimal pilih ${max} opsi`);
        break;
      }
      case "min_date": {
        if (v.value && strVal < v.value) return err(`Tanggal harus setelah ${v.value}`);
        break;
      }
      case "max_date": {
        if (v.value && strVal > v.value) return err(`Tanggal harus sebelum ${v.value}`);
        break;
      }
    }
    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear field error on change
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[fieldId]; return n; });
    }
  };

  const handleBlurValidate = (field: FormField) => {
    const val = answers[field.id];
    const err = validateField(field, val);
    setFieldErrors((prev) => err ? { ...prev, [field.id]: err } : (({ [field.id]: _, ...rest }) => rest)(prev));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean, field: FormField) => {
    setAnswers((prev) => {
      const currentList: string[] = Array.isArray(prev[fieldId]) ? [...prev[fieldId]] : [];
      if (checked) {
        if (!currentList.includes(option)) currentList.push(option);
      } else {
        const idx = currentList.indexOf(option);
        if (idx > -1) currentList.splice(idx, 1);
      }
      const newList = currentList;
      // Validate immediately on checkbox change
      const err = validateField(field, newList);
      setFieldErrors((fe) => err ? { ...fe, [fieldId]: err } : (({ [fieldId]: _, ...rest }) => rest)(fe));
      return { ...prev, [fieldId]: newList };
    });
  };

  const handleFileUpload = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileStates((prev) => ({
      ...prev,
      [fieldId]: { uploading: true },
    }));

    try {
      const uploadRes = await formService.uploadAttachment(file);
      setFileStates((prev) => ({
        ...prev,
        [fieldId]: { uploading: false, fileName: file.name, url: uploadRes.url },
      }));
      setAnswers((prev) => ({
        ...prev,
        [fieldId]: uploadRes.url,
      }));
    } catch (err: any) {
      setFileStates((prev) => ({
        ...prev,
        [fieldId]: { uploading: false, error: err.message || "Gagal mengunggah berkas" },
      }));
    }
  };

  const handleRemoveFile = (fieldId: string) => {
    setFileStates((prev) => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setErrorMsg(null);

    // Validate required fields + custom validation rules
    const newFieldErrors: Record<string, string> = {};
    let firstErrorFieldId: string | null = null;

    for (const field of form.fields_schema) {
      const val = answers[field.id];

      // Required check
      if (field.required) {
        if (
          val === undefined ||
          val === null ||
          (typeof val === "string" && !val.trim()) ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newFieldErrors[field.id] = `Pertanyaan ini wajib diisi.`;
          if (!firstErrorFieldId) firstErrorFieldId = field.id;
          continue;
        }
      }

      // Custom validation rule check
      if (field.validation && val !== undefined && val !== null && val !== "") {
        const err = validateField(field, val);
        if (err) {
          newFieldErrors[field.id] = err;
          if (!firstErrorFieldId) firstErrorFieldId = field.id;
        }
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setErrorMsg(`Terdapat ${Object.keys(newFieldErrors).length} kesalahan dalam formulir. Periksa kembali jawaban Anda.`);
      if (firstErrorFieldId) {
        setActiveFieldId(firstErrorFieldId);
        const element = document.getElementById(`card_${firstErrorFieldId}`);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      await formService.submitForm(form.id, answers);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submit error:", err);
      setErrorMsg(err.message || "Gagal mengirim formulir. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E2E2EF]/60 via-[#FFFFFF] to-[#FFEED0]/60 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 animate-pulse">
            <Image src="/logo.png" alt="Logo PMK Daniel" fill className="object-contain" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-primary mt-2" />
          <p className="font-plusJakarta text-slate-600 text-sm font-medium tracking-wide">
            Menyiapkan Formulir PMK Daniel...
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg && !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E2E2EF]/70 via-[#FFFFFF] to-[#FFEED0]/70 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] border border-gray-200/80 shadow-2xl max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="font-plusJakarta font-extrabold text-2xl text-slate-900 mb-2">
            Formulir Tidak Ditemukan
          </h2>
          <p className="font-plusJakarta text-slate-600 text-sm mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-plusJakarta font-bold px-6 py-3 rounded-full hover:opacity-95 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (submitted && form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E2E2EF] via-[#FFFFFF] to-[#FFEED0] py-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Soft background light */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center relative overflow-hidden z-10 animate-scaleUp">
          {/* Top glowing stripe */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-primary via-primary/80 to-secondary" />

          <div className="w-24 h-24 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 size={52} className="animate-bounce" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-plusJakarta font-bold rounded-full uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Tanggapan Berhasil Direkam
          </span>

          <h1 className="font-plusJakarta font-extrabold text-2xl sm:text-4xl text-slate-900 mb-3 tracking-tight">
            Puji Tuhan, Terima Kasih!
          </h1>

          <p className="font-plusJakarta text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Tanggapan Anda untuk formulir <strong className="text-slate-900">&ldquo;{form.title}&rdquo;</strong> telah berhasil kami rekam di basis data PMK Daniel.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={() => {
                setAnswers({});
                setFileStates({});
                setSubmitted(false);
              }}
              className="px-7 py-3.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-plusJakarta font-semibold text-sm transition-all shadow-sm"
            >
              Kirim Tanggapan Lain
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-plusJakarta font-bold px-7 py-3.5 rounded-full hover:opacity-95 transition-all shadow-lg shadow-primary/25 text-sm"
            >
              <HeartHandshake size={18} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E2E2EF]/80 via-[#FFFFFF] to-[#FFEED0]/80 text-slate-800 py-8 sm:py-16 px-4 sm:px-6 relative selection:bg-primary/20 selection:text-primary">
      {/* Soft floating pastel ambient lights */}
      <div className="fixed top-12 right-12 w-[480px] h-[480px] bg-secondary/20 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-12 left-12 w-[480px] h-[480px] bg-primary/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Floating Sticky Progress Bar at Top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-[760px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo.png" alt="PMK Daniel" fill className="object-contain" />
            </div>
            <span className="font-plusJakarta font-bold text-xs sm:text-sm text-slate-900 truncate">
              {form.title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-plusJakarta font-bold text-xs text-primary">
              {progressStats.percentage}% terisi
            </span>
            <div className="w-24 sm:w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/80">
              <div 
                className="h-full bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progressStats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[760px] mx-auto flex flex-col gap-6 pt-12 sm:pt-14">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-plusJakarta text-xs sm:text-sm font-semibold w-fit group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda PMK Daniel</span>
        </Link>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-plusJakarta shadow-sm animate-shake">
            <AlertCircle size={20} className="shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Hero Header Card */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/90 bg-white/85 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          {/* Top primary-to-secondary gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-primary via-primary/80 to-secondary" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl bg-white p-2 border border-gray-100 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Logo PMK Daniel"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-plusJakarta font-extrabold uppercase tracking-widest">
                  <Sparkles size={11} /> PMK Daniel FILKOM UB
                </span>
                <p className="font-plusJakarta text-xs text-slate-500 font-medium mt-1">
                  Together to be <span className="text-secondary font-bold">Better</span>
                </p>
              </div>
            </div>

            {form.is_active === 1 ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-plusJakarta font-bold w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Menerima Tanggapan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-plusJakarta font-bold w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Formulir Ditutup
              </span>
            )}
          </div>

          <h1 className="font-plusJakarta font-extrabold text-2xl sm:text-4xl text-slate-900 leading-tight tracking-tight mb-4">
            {form.title}
          </h1>

          {form.description && (
            <div className="font-plusJakarta text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-gray-100 mb-6">
              {form.description}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs font-plusJakarta text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="text-rose-500 font-bold text-sm">*</span> Menunjukkan pertanyaan yang wajib diisi
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600" /> Data tersimpan aman di server PMK Daniel
            </span>
          </div>
        </div>

        {/* Dynamic Question Cards Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {form.fields_schema.map((field: FormField, index: number) => {
            const fieldValue = answers[field.id];
            const fileState = fileStates[field.id];
            const isFocused = activeFieldId === field.id;
            const isFilled = fieldValue !== undefined && fieldValue !== null && fieldValue !== "" && (!Array.isArray(fieldValue) || fieldValue.length > 0);

            return (
              <div
                key={field.id || `field_${index}`}
                id={`card_${field.id}`}
                onClick={() => setActiveFieldId(field.id)}
                className={`relative rounded-[28px] p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 flex flex-col gap-4 border ${
                  fieldErrors[field.id]
                    ? "bg-white border-rose-300 shadow-[0_12px_40px_rgba(225,29,72,0.08)] ring-2 ring-rose-200"
                    : isFocused
                    ? "bg-white border-primary shadow-[0_12px_40px_rgba(62,64,149,0.12)] ring-2 ring-primary/20"
                    : isFilled
                    ? "bg-white/95 border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
                    : "bg-white/85 border-gray-200/70 hover:border-primary/40 shadow-sm"
                }`}
              >
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-extrabold flex items-center justify-center">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-plusJakarta text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {field.type === "text" && "Teks Singkat"}
                      {field.type === "textarea" && "Paragraf"}
                      {field.type === "radio" && "Pilih Satu"}
                      {field.type === "checkbox" && "Pilihan Jamak"}
                      {field.type === "select" && "Menu Dropdown"}
                      {field.type === "file" && "Lampiran Berkas"}
                      {field.type === "date" && "Pilih Tanggal"}
                    </span>
                  </div>

                  {field.required ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-plusJakarta text-[11px] font-bold">
                      Wajib
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-plusJakarta text-[11px] font-medium">
                      Opsional
                    </span>
                  )}
                </div>

                {/* Question Label */}
                <div>
                  <label className="font-plusJakarta font-extrabold text-base sm:text-lg text-slate-900 leading-snug flex items-start gap-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-rose-500 font-bold">*</span>}
                  </label>
                  {field.helpText && (
                    <p className="font-plusJakarta text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {field.helpText}
                    </p>
                  )}
                </div>

                {/* Question Inputs */}
                <div className="mt-1">
                  {/* Type 1: Text */}
                  {field.type === "text" && (
                    <>
                      <input
                        type="text"
                        value={fieldValue || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        onBlur={() => handleBlurValidate(field)}
                        placeholder={field.placeholder || "Ketik jawaban Anda..."}
                        required={field.required}
                        disabled={submitting || form.is_active === 0}
                        className={`w-full h-12 px-4 rounded-2xl border font-plusJakarta text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          fieldErrors[field.id]
                            ? "border-rose-300 bg-rose-50/40 focus:ring-rose-200 focus:border-rose-400"
                            : "border-gray-200 bg-slate-50/70 focus:ring-primary/20 focus:border-primary"
                        }`}
                      />
                      {fieldErrors[field.id] && (
                        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-plusJakarta font-semibold mt-1">
                          <AlertCircle size={13} />
                          {fieldErrors[field.id]}
                        </p>
                      )}
                    </>
                  )}

                  {/* Type 2: Textarea / Paragraph */}
                  {field.type === "textarea" && (
                    <>
                      <textarea
                        rows={4}
                        value={fieldValue || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        onBlur={() => handleBlurValidate(field)}
                        placeholder={field.placeholder || "Tuliskan jawaban Anda secara rinci di sini..."}
                        required={field.required}
                        disabled={submitting || form.is_active === 0}
                        className={`w-full p-4 rounded-2xl border font-plusJakarta text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-y leading-relaxed ${
                          fieldErrors[field.id]
                            ? "border-rose-300 bg-rose-50/40 focus:ring-rose-200 focus:border-rose-400"
                            : "border-gray-200 bg-slate-50/70 focus:ring-primary/20 focus:border-primary"
                        }`}
                      />
                      {fieldErrors[field.id] && (
                        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-plusJakarta font-semibold mt-1">
                          <AlertCircle size={13} />
                          {fieldErrors[field.id]}
                        </p>
                      )}
                    </>
                  )}

                  {/* Type 3: Radio (Single Selection Card) */}
                  {field.type === "radio" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(field.options || []).map((opt, optIdx) => {
                        const isSelected = fieldValue === opt;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                                : "bg-slate-50/60 border-gray-200/80 hover:border-gray-300 hover:bg-white text-slate-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`radio_${field.id}`}
                              value={opt}
                              checked={isSelected}
                              onChange={() => handleInputChange(field.id, opt)}
                              required={field.required && !fieldValue}
                              disabled={submitting || form.is_active === 0}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "border-primary bg-primary text-white" : "border-slate-400 bg-white"
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3.5} />}
                            </div>
                            <span className="font-plusJakarta text-sm leading-snug">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Type 4: Checkbox (Multi Selection Cards) */}
                  {field.type === "checkbox" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(field.options || []).map((opt, optIdx) => {
                          const isChecked = Array.isArray(fieldValue) && fieldValue.includes(opt);
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                isChecked
                                  ? "bg-primary/5 border-primary text-primary font-bold shadow-sm"
                                  : "bg-slate-50/60 border-gray-200/80 hover:border-gray-300 hover:bg-white text-slate-700"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked, field)}
                                disabled={submitting || form.is_active === 0}
                                className="hidden"
                              />
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                                isChecked ? "border-primary bg-primary text-white" : "border-slate-400 bg-white"
                              }`}>
                                {isChecked && <Check size={13} strokeWidth={3.5} />}
                              </div>
                              <span className="font-plusJakarta text-sm leading-snug">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      {fieldErrors[field.id] && (
                        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-plusJakarta font-semibold mt-1">
                          <AlertCircle size={13} />
                          {fieldErrors[field.id]}
                        </p>
                      )}
                    </>
                  )}

                  {/* Type 5: Select Dropdown */}
                  {field.type === "select" && (
                    <div className="relative">
                      <select
                        value={fieldValue || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                        disabled={submitting || form.is_active === 0}
                        className="w-full h-12 px-4 rounded-2xl border border-gray-200 bg-slate-50/70 font-plusJakarta text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          -- Pilih salah satu opsi --
                        </option>
                        {(field.options || []).map((opt, optIdx) => (
                          <option key={optIdx} value={opt} className="text-slate-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  )}

                  {/* Type 6: Date Picker */}
                  {field.type === "date" && (
                    <>
                      <div className="relative">
                        <input
                          type="date"
                          value={fieldValue || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          onBlur={() => handleBlurValidate(field)}
                          required={field.required}
                          disabled={submitting || form.is_active === 0}
                          className={`w-full h-12 px-4 rounded-2xl border font-plusJakarta text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                            fieldErrors[field.id]
                              ? "border-rose-300 bg-rose-50/40 focus:ring-rose-200 focus:border-rose-400"
                              : "border-gray-200 bg-slate-50/70 focus:ring-primary/20 focus:border-primary"
                          }`}
                        />
                      </div>
                      {fieldErrors[field.id] && (
                        <p className="flex items-center gap-1.5 text-xs text-rose-600 font-plusJakarta font-semibold mt-1">
                          <AlertCircle size={13} />
                          {fieldErrors[field.id]}
                        </p>
                      )}
                    </>
                  )}

                  {/* Type 7: File Upload */}
                  {field.type === "file" && (
                    <div>
                      {fieldValue ? (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <FileText size={20} />
                            </div>
                            <div className="flex flex-col truncate">
                              <a
                                href={fieldValue}
                                target="_blank"
                                rel="noreferrer"
                                className="font-plusJakarta text-sm text-emerald-800 font-bold underline truncate"
                              >
                                {fileState?.fileName || "Berkas Terunggah"}
                              </a>
                              <span className="font-plusJakarta text-xs text-emerald-600">
                                Berhasil diunggah ke Cloudflare R2
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(field.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                            title="Hapus berkas"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl bg-slate-50/60 hover:bg-primary/5 cursor-pointer transition-all duration-300 group">
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(field.id, e)}
                            disabled={submitting || fileState?.uploading || form.is_active === 0}
                            className="hidden"
                          />
                          {fileState?.uploading ? (
                            <div className="flex items-center gap-3 text-primary font-plusJakarta text-sm font-bold animate-pulse">
                              <Loader2 size={22} className="animate-spin" />
                              Mengunggah berkas ke server...
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 group-hover:bg-primary group-hover:border-primary text-slate-400 group-hover:text-white flex items-center justify-center mb-3 shadow-sm transition-all">
                                <UploadCloud size={24} />
                              </div>
                              <span className="font-plusJakarta text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                                Klik untuk memilih berkas dari perangkat
                              </span>
                              <span className="font-plusJakarta text-xs text-slate-400 mt-1">
                                Mendukung JPG, PNG, PDF (Maksimal 10MB)
                              </span>
                            </>
                          )}
                        </label>
                      )}
                      {fileState?.error && (
                        <p className="font-plusJakarta text-xs text-rose-500 mt-2 flex items-center gap-1.5">
                          <AlertCircle size={14} />
                          {fileState.error}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Action Submission Card */}
          <div className="rounded-[32px] border border-white/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Kosongkan semua jawaban yang sudah diisi?")) {
                  setAnswers({});
                  setFileStates({});
                  setFieldErrors({});
                }
              }}
              className="text-slate-400 hover:text-rose-500 font-plusJakarta text-xs font-bold transition-colors py-2"
            >
              Kosongkan Formulir
            </button>

            <button
              type="submit"
              disabled={submitting || form.is_active === 0}
              className="w-full sm:w-auto px-10 h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-plusJakarta font-extrabold text-sm sm:text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Mengirim Tanggapan...</span>
                </>
              ) : (
                <>
                  <span>Kirim Formulir</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Brand Footer */}
        <footer className="text-center py-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="relative w-5 h-5 opacity-80">
              <Image src="/logo.png" alt="PMK Daniel" fill className="object-contain" />
            </div>
            <span className="font-plusJakarta font-bold text-xs text-slate-500 uppercase tracking-widest">
              PMK Daniel FILKOM UB
            </span>
          </div>
          <p className="font-plusJakarta text-xs text-slate-400">
            Formulir Pendataan Resmi • Together to be Better
          </p>
        </footer>
      </div>
    </div>
  );
}
