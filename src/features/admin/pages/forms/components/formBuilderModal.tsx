"use client";

import React, { useState, useEffect } from "react";
import { FormField, FormFieldType, DynamicForm, DynamicFormCreateInput } from "@/types/form";
import { formService } from "@/services/formService";
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Loader2, 
  Sparkles,
  Layers,
  Settings2
} from "lucide-react";

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialForm?: DynamicForm | null;
}

const FIELD_TYPES: { type: FormFieldType; label: string; icon: string }[] = [
  { type: "text", label: "Jawaban Singkat", icon: "✏️" },
  { type: "textarea", label: "Paragraf / Esai", icon: "📜" },
  { type: "radio", label: "Pilihan Ganda (1 Opsi)", icon: "🔘" },
  { type: "checkbox", label: "Kotak Centang (Banyak Opsi)", icon: "☑️" },
  { type: "select", label: "Menu Dropdown", icon: "🔽" },
  { type: "file", label: "Upload Berkas / Foto / KTM", icon: "📎" },
  { type: "date", label: "Tanggal", icon: "📅" },
];

export default function FormBuilderModal({
  isOpen,
  onClose,
  onSuccess,
  initialForm,
}: FormBuilderModalProps) {
  const isEditing = !!initialForm;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    if (initialForm) {
      setTitle(initialForm.title || "");
      setSlug(initialForm.slug || "");
      setDescription(initialForm.description || "");
      setIsActive(initialForm.is_active ?? 1);
      setFields(initialForm.fields_schema || []);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setIsActive(1);
      setFields([
        {
          id: "nama_lengkap",
          label: "Nama Lengkap",
          type: "text",
          placeholder: "Masukkan nama lengkap Anda",
          required: true,
        },
        {
          id: "nim",
          label: "NIM (Nomor Induk Mahasiswa)",
          type: "text",
          placeholder: "Contoh: 265150200111001",
          required: true,
        },
        {
          id: "divisi_minat",
          label: "Pilihan Divisi Pelayanan",
          type: "radio",
          required: true,
          options: ["Acara & Liturgi", "Musik & Praise", "Multimedia & Kreatif", "Doa & Konseling", "Humas & Logistik"],
        }
      ]);
    }
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

  const generateSlugFromTitle = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(generateSlugFromTitle(val));
    }
  };

  const handleAddField = (type: FormFieldType = "text") => {
    const newField: FormField = {
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: `Pertanyaan Baru ${fields.length + 1}`,
      type: type,
      placeholder: "",
      required: false,
      options: type === "radio" || type === "checkbox" || type === "select" ? ["Opsi 1", "Opsi 2"] : undefined,
    };
    setFields([...fields, newField]);
  };

  const handleUpdateField = (index: number, updates: Partial<FormField>) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    setFields((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleAddOption = (fieldIndex: number) => {
    const field = fields[fieldIndex];
    const currentOptions = field.options || [];
    const newOptionName = `Opsi ${currentOptions.length + 1}`;
    handleUpdateField(fieldIndex, { options: [...currentOptions, newOptionName] });
  };

  const handleUpdateOption = (fieldIndex: number, optIndex: number, value: string) => {
    const field = fields[fieldIndex];
    const updatedOptions = [...(field.options || [])];
    updatedOptions[optIndex] = value;
    handleUpdateField(fieldIndex, { options: updatedOptions });
  };

  const handleRemoveOption = (fieldIndex: number, optIndex: number) => {
    const field = fields[fieldIndex];
    const updatedOptions = (field.options || []).filter((_, i) => i !== optIndex);
    handleUpdateField(fieldIndex, { options: updatedOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Judul formulir tidak boleh kosong.");
      return;
    }

    if (fields.length === 0) {
      setErrorMsg("Minimal harus ada 1 pertanyaan dalam formulir.");
      return;
    }

    setLoading(true);
    try {
      const payload: DynamicFormCreateInput = {
        title,
        slug: slug.trim() || generateSlugFromTitle(title),
        description,
        is_active: isActive,
        fields_schema: fields,
      };

      if (isEditing && initialForm) {
        await formService.updateForm(initialForm.id, payload);
      } else {
        await formService.createForm(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save form:", err);
      setErrorMsg(err.message || "Gagal menyimpan formulir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-4xl bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-scaleUp"
      >
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings2 size={20} />
            </div>
            <div>
              <h2 className="font-plusJakarta font-extrabold text-xl text-slate-900">
                {isEditing ? "Edit Formulir Pendataan" : "Buat Formulir Baru"}
              </h2>
              <p className="font-plusJakarta text-xs text-slate-500">
                Susun pertanyaan kustom bergaya Google Form untuk jemaat/anggota PMK Daniel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form 
          data-lenis-prevent="true"
          onSubmit={handleSubmit} 
          className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-6"
        >
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-plusJakarta flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Meta Section */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-gray-200/80 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Formulir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: Form Pendaftaran Welcoming Party 2026"
                  required
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white font-plusJakarta text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Slug URL (Tautan Publik) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center">
                  <span className="h-11 px-3 bg-slate-200/70 border border-r-0 border-gray-200 rounded-l-xl text-xs font-mono text-slate-600 flex items-center">
                    /form/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(generateSlugFromTitle(e.target.value))}
                    placeholder="welcoming-party-2026"
                    required
                    className="w-full h-11 px-3 rounded-r-xl border border-gray-200 bg-white font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Deskripsi / Petunjuk Pengisian
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan petunjuk atau keterangan tambahan bagi responden..."
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-white font-plusJakarta text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive === 1}
                  onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="font-plusJakarta text-sm font-semibold text-slate-800">
                  Buka formulir (menerima tanggapan dari publik)
                </span>
              </label>
            </div>
          </div>

          {/* Question List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-plusJakarta font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-primary" />
                Daftar Pertanyaan ({fields.length})
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddField("text")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-plusJakarta font-bold text-xs rounded-xl transition-all"
                >
                  <Plus size={15} /> Tambah Pertanyaan
                </button>
              </div>
            </div>

            {fields.map((field, idx) => (
              <div
                key={field.id || idx}
                className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col gap-4 hover:border-primary/40 transition-all group"
              >
                {/* Field Controls Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pertanyaan #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => handleMoveField(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Geser ke atas"
                    >
                      <ArrowUp size={15} />
                    </button>
                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => handleMoveField(idx, "down")}
                      disabled={idx === fields.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Geser ke bawah"
                    >
                      <ArrowDown size={15} />
                    </button>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-2"
                      title="Hapus pertanyaan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Field Details Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Label */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Label Pertanyaan
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(idx, { label: e.target.value })}
                      placeholder="Tuliskan teks pertanyaan..."
                      required
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-slate-50/50 font-plusJakarta text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Type Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Tipe Input
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => {
                        const newType = e.target.value as FormFieldType;
                        const defaultOpts = (newType === "radio" || newType === "checkbox" || newType === "select") && (!field.options || field.options.length === 0)
                          ? ["Opsi 1", "Opsi 2"]
                          : field.options;
                        handleUpdateField(idx, { type: newType, options: defaultOpts });
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-slate-50/50 font-plusJakarta text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all cursor-pointer"
                    >
                      {FIELD_TYPES.map((ft) => (
                        <option key={ft.type} value={ft.type}>
                          {ft.icon} {ft.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Options Manager (For Radio / Checkbox / Select) */}
                {(field.type === "radio" || field.type === "checkbox" || field.type === "select") && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-gray-200/80 flex flex-col gap-2.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Pilihan Opsi Jawaban
                    </label>
                    {(field.options || []).map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-mono">
                          {field.type === "radio" ? "🔘" : field.type === "checkbox" ? "☑️" : "•"}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(idx, optIdx, e.target.value)}
                          placeholder={`Opsi ${optIdx + 1}`}
                          className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white font-plusJakarta text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        {(field.options || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(idx, optIdx)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(idx)}
                      className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 mt-1 w-fit"
                    >
                      <Plus size={13} /> Tambah Opsi
                    </button>
                  </div>
                )}

                {/* Field Options Footer (Required toggle & placeholder) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <input
                    type="text"
                    value={field.placeholder || ""}
                    onChange={(e) => handleUpdateField(idx, { placeholder: e.target.value })}
                    placeholder="Teks placeholder / contoh jawaban..."
                    className="flex-1 min-w-[200px] h-8 px-3 rounded-lg border border-gray-200 bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400"
                  />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!field.required}
                      onChange={(e) => handleUpdateField(idx, { required: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="font-plusJakarta text-xs font-bold text-slate-700">
                      Wajib Diisi (*Required)
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-gray-200 text-slate-700 font-plusJakarta font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-plusJakarta font-extrabold text-xs rounded-full shadow-lg shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? "Simpan Perubahan" : "Buat Formulir"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
