"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Divisi, DivisiInput } from "@/types/pengurus";
import { pengurusService } from "@/services/pengurusService";
import { getDivisionIcon } from "@/features/pengurus/components/DivisionModal";
import { 
  X, 
  Upload, 
  Loader2, 
  Check, 
  Layers, 
  Settings2,
  Sparkles,
  Crown,
  BookOpen,
  HeartHandshake,
  Video,
  PenTool,
  Wallet,
  ShieldCheck,
  Settings,
  Music,
  Camera,
  Users
} from "lucide-react";

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  division: Divisi | null;
}

const AVAILABLE_ICONS = [
  { id: "crown", label: "Mahkota / Ketua", icon: Crown },
  { id: "shield", label: "Perisai / Wakil", icon: ShieldCheck },
  { id: "pen", label: "Pena / Sekretaris", icon: PenTool },
  { id: "wallet", label: "Dompet / Bendahara", icon: Wallet },
  { id: "book", label: "Buku / Pembinaan", icon: BookOpen },
  { id: "heart", label: "Hati / Pemerhati", icon: HeartHandshake },
  { id: "sparkles", label: "Kilau / Acara", icon: Sparkles },
  { id: "video", label: "Video / Media", icon: Video },
  { id: "settings", label: "Gir / Teknis", icon: Settings },
  { id: "music", label: "Musik / Bakat", icon: Music },
  { id: "camera", label: "Kamera / Visual", icon: Camera },
  { id: "users", label: "Orang / Relasi", icon: Users },
];

export default function EditDivisionModal({
  isOpen,
  onClose,
  onSuccess,
  division,
}: EditDivisionModalProps) {
  const isEditing = !!division;

  const [name, setName] = useState("");
  const [komisi, setKomisi] = useState("Komisi 1");
  const [iconName, setIconName] = useState("sparkles");
  const [description, setDescription] = useState("");
  const [groupPhotoUrl, setGroupPhotoUrl] = useState("/images/persekutuan.webp");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
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
    if (division) {
      setName(division.name || "");
      setKomisi(division.komisi || "Komisi 1");
      setIconName(division.icon_name || "sparkles");
      setDescription(division.description || "");
      setGroupPhotoUrl(division.group_photo_url || "/images/persekutuan.webp");
    } else {
      setName("");
      setKomisi("Komisi 1");
      setIconName("sparkles");
      setDescription("");
      setGroupPhotoUrl("/images/persekutuan.webp");
    }
  }, [division, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);
    try {
      const url = await pengurusService.uploadPhoto(file);
      setGroupPhotoUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah foto ke Cloudflare R2");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama divisi tidak boleh kosong.");
      return;
    }

    setSaving(true);
    try {
      const payload: DivisiInput = {
        name,
        komisi,
        icon_name: iconName,
        description,
        group_photo_url: groupPhotoUrl,
      };

      if (isEditing && division) {
        await pengurusService.updateDivision(division.id, payload);
      } else {
        await pengurusService.createDivision(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan divisi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-scaleUp font-plusJakarta text-slate-900"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings2 size={20} />
            </div>
            <div>
              <h2 className="font-plusJakarta font-extrabold text-xl text-slate-900">
                {isEditing ? `Edit Divisi: ${division?.name}` : "Tambah Divisi Baru"}
              </h2>
              <p className="text-xs text-slate-500">
                Atur informasi penjelasan divisi, tag komisi, icon, dan foto bersama
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
          className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-5"
        >
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Divisi / Posisi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Pembinaan"
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tag Komisi / Kelompok
              </label>
              <select
                value={komisi}
                onChange={(e) => setKomisi(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all cursor-pointer"
              >
                <option value="BPH">Badan Pengurus Harian (BPH)</option>
                <option value="Komisi 1">Komisi 1 (Pembinaan)</option>
                <option value="Komisi 2">Komisi 2 (Pemerhati)</option>
                <option value="Komisi 3">Komisi 3 (Acara)</option>
                <option value="Komisi 4">Komisi 4 (Media & Relasi)</option>
                <option value="Sub Komisi 3 (Acara)">Sub Komisi 3 (Acara)</option>
                <option value="Sub Komisi 4 (Medrel)">Sub Komisi 4 (Medrel)</option>
              </select>
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Ikon Divisi
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = iconName === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIconName(item.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-slate-50 text-slate-700 border-gray-200 hover:bg-slate-100"
                    }`}
                  >
                    <IconComp size={20} />
                    <span className="text-[10px] mt-1 font-semibold truncate w-full text-center">
                      {item.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Photo Upload Section */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200/80 flex flex-col gap-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Foto Bersama Divisi / Banner
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-slate-200 border border-gray-300 shrink-0">
                <Image
                  src={groupPhotoUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col gap-2 w-full">
                <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm w-fit">
                  {uploading ? <Loader2 size={15} className="animate-spin text-primary" /> : <Upload size={15} />}
                  <span>{uploading ? "Mengunggah..." : "Pilih File Foto Baru"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <input
                  type="text"
                  value={groupPhotoUrl}
                  onChange={(e) => setGroupPhotoUrl(e.target.value)}
                  placeholder="Atau masukkan URL foto gambar..."
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Deskripsi & Penjelasan Tugas Divisi
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan penjelasan detail tugas, fungsi, dan pelayanan divisi ini..."
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all resize-y"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-gray-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs rounded-full shadow-lg shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? "Simpan Perubahan" : "Tambah Divisi"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
