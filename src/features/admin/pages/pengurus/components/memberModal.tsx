"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PengurusMember, PengurusMemberInput, Divisi } from "@/types/pengurus";
import { pengurusService } from "@/services/pengurusService";
import ImageCropModal from "@/components/ImageCropModal";
import { 
  X, 
  Upload, 
  Loader2, 
  Check, 
  UserPlus, 
  UserCheck, 
  Award, 
  User,
  Crop
} from "lucide-react";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetDivision: Divisi | null;
  editingMember?: PengurusMember | null;
}

export default function MemberModal({
  isOpen,
  onClose,
  onSuccess,
  targetDivision,
  editingMember,
}: MemberModalProps) {
  const isEditing = !!editingMember;

  const [name, setName] = useState("");
  const [role, setRole] = useState("Anggota");
  const [period, setPeriod] = useState("2025/2026");
  const [photoUrl, setPhotoUrl] = useState("/images/persekutuan.webp");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (editingMember) {
      setName(editingMember.name || "");
      setRole(editingMember.role || "Anggota");
      setPeriod(editingMember.period || "2025/2026");
      setPhotoUrl(editingMember.photo_url || "/images/persekutuan.webp");
    } else {
      setName("");
      setRole(targetDivision?.komisi === "BPH" ? targetDivision.name : "Anggota");
      setPeriod("2025/2026");
      setPhotoUrl("/images/persekutuan.webp");
    }
  }, [editingMember, targetDivision, isOpen]);

  if (!isOpen || !targetDivision) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedFile: File, previewUrl: string) => {
    // Show preview immediately
    setPhotoUrl(previewUrl);
    setUploading(true);
    setErrorMsg(null);
    try {
      const uploadedUrl = await pengurusService.uploadPhoto(croppedFile);
      setPhotoUrl(uploadedUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama anggota tidak boleh kosong.");
      return;
    }

    setSaving(true);
    try {
      const payload: PengurusMemberInput = {
        divisi_id: targetDivision.id,
        name,
        role,
        period,
        photo_url: photoUrl,
      };

      if (isEditing && editingMember) {
        await pengurusService.updateMember(editingMember.id, payload);
      } else {
        await pengurusService.addMember(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan data anggota.");
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
        className="relative w-full max-w-lg bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] my-auto animate-scaleUp font-plusJakarta text-slate-900"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              {isEditing ? <UserCheck size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 className="font-plusJakarta font-extrabold text-xl text-slate-900">
                {isEditing ? "Edit Data Anggota" : `Tambah Anggota: ${targetDivision.name}`}
              </h2>
              <p className="text-xs text-slate-500">
                Masukkan nama dan jabatan anggota di divisi {targetDivision.name}
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

        {/* Modal Form */}
        <form
          data-lenis-prevent="true"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-4"
        >
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap Anggota <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Jonathan Kevin"
              required
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Jabatan / Peran di Divisi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Ketua Pembinaan / Anggota"
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Periode Kepengurusan
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2025/2026"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-primary/20 shadow-sm shrink-0">
              <Image
                src={photoUrl}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm w-fit">
                  {uploading ? <Loader2 size={13} className="animate-spin text-primary" /> : <Upload size={13} />}
                  <span>{uploading ? "Mengunggah..." : "Pilih & Sesuaikan Foto"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <span className="text-[11px] text-slate-400">
                Bisa di-crop, geser posisi, & di-zoom seperti foto profil WhatsApp
              </span>
            </div>
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
              disabled={saving || uploading}
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
                  <span>{isEditing ? "Simpan Perubahan" : "Tambah Anggota"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* WhatsApp-Style Image Cropper Modal */}
        <ImageCropModal
          isOpen={cropModalOpen}
          imageSrc={rawImageSrc}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
          cropShape="circle"
          aspectRatio={1}
          title="Sesuaikan Foto Profil Anggota"
        />

      </div>
    </div>
  );
}
