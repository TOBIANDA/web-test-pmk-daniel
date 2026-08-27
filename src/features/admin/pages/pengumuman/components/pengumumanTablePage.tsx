"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DataTable } from "./pengumumanDataTable";
import { getColumns, pengumuman } from "./pengumumanTableColumns";
import { pengumumanService } from "@/services/pengumumanService";
import { Plus, X, Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PengumumanTablePage() {
    const [data, setData] = useState<pengumuman[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<pengumuman | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("kegiatan");
    const [datePublished, setDatePublished] = useState(new Date().toISOString().split("T")[0]);
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("Divisi Acara");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Lock body scroll and prevent Lenis smooth scroll from hijacking modal scroll
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            document.body.setAttribute("data-lenis-prevent", "true");
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.removeAttribute("data-lenis-prevent");
        }
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.removeAttribute("data-lenis-prevent");
        };
    }, [isModalOpen]);

    const loadPengumuman = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const list = await pengumumanService.getPengumumanList();
            if (list && Array.isArray(list)) {
                const formatted: pengumuman[] = list.map((item) => ({
                    id: item.id,
                    judul: item.title,
                    dibuat: item.datePublished || "Hari ini",
                    publikasi: item.datePublished || "Hari ini",
                    status: "Aktif" as const,
                    category: item.category || "kegiatan",
                    content: item.description || item.content || "",
                    author: item.author || "Divisi Acara",
                    imageUrl: item.imageUrl,
                    views: item.views || 0,
                }));
                setData(formatted);
            }
        } catch (err: any) {
            console.error("Failed to load pengumuman", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPengumuman();
    }, []);

    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setTitle("");
        setCategory("kegiatan");
        setDatePublished(new Date().toISOString().split("T")[0]);
        setContent("");
        setAuthor("Divisi Acara");
        setSelectedFile(null);
        setPreviewUrl(null);
        setMessage(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: pengumuman) => {
        setEditingItem(item);
        setTitle(item.judul);
        setCategory(item.category || "kegiatan");
        setDatePublished(item.publikasi || new Date().toISOString().split("T")[0]);
        setContent(item.content || "");
        setAuthor(item.author || "Divisi Acara");
        setSelectedFile(null);
        setPreviewUrl(item.imageUrl || null);
        setMessage(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (item: pengumuman) => {
        if (!window.confirm(`Hapus pengumuman "${item.judul}" secara permanen?`)) {
            return;
        }

        try {
            await pengumumanService.deletePengumuman(item.id);
            setData((prev) => prev.filter((p) => p.id !== item.id));
            alert("Pengumuman berhasil dihapus!");
            loadPengumuman();
        } catch (err: any) {
            alert(err.message || "Gagal menghapus pengumuman");
        }
    };

    const tableColumns = useMemo(
        () =>
            getColumns({
                onEdit: handleOpenEditModal,
                onDelete: handleDelete,
            }),
        []
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            let uploadedImageUrl = editingItem?.imageUrl || "";

            // 1. Upload to Cloudflare R2 if a new file is chosen
            if (selectedFile) {
                try {
                    uploadedImageUrl = await pengumumanService.uploadImage(selectedFile);
                } catch (uploadErr: any) {
                    console.warn("Upload to R2 error:", uploadErr.message);
                }
            }

            if (editingItem) {
                // UPDATE Existing Pengumuman
                await pengumumanService.updatePengumuman(editingItem.id, {
                    title: title.trim(),
                    category: category,
                    date_published: datePublished,
                    content: content.trim(),
                    author: author.trim(),
                    image_url: uploadedImageUrl || undefined,
                });
                setMessage({ text: "Pengumuman berhasil diperbarui!", type: "success" });
            } else {
                // CREATE New Pengumuman
                await pengumumanService.createPengumuman({
                    title: title.trim(),
                    category: category,
                    date_published: datePublished,
                    content: content.trim(),
                    author: author.trim(),
                    image_url: uploadedImageUrl || undefined,
                });
                setMessage({ text: "Pengumuman berhasil diterbitkan!", type: "success" });
            }

            setTimeout(() => {
                setIsModalOpen(false);
                setMessage(null);
                loadPengumuman();
            }, 1000);
        } catch (err: any) {
            setMessage({
                text: err.message || "Terjadi kesalahan saat menyimpan pengumuman",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-8 lg:px-14 font-plusJakarta">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-plusJakarta font-bold text-primary text-2xl sm:text-3xl lg:text-[38px] tracking-tight">
                        Kelola Pengumuman
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Daftar dan publikasi kegiatan, open recruitment, dan berita persekutuan PMK Daniel
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => loadPengumuman(true)}
                        variant="outline"
                        size="lg"
                        disabled={refreshing || loading}
                        className="rounded-full px-4 flex items-center gap-2 cursor-pointer"
                        title="Muat ulang data dari server"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        <span className="text-xs sm:text-sm font-semibold">Segarkan</span>
                    </Button>
                    <Button
                        onClick={handleOpenCreateModal}
                        size={"lg"}
                        className="bg-primary hover:bg-primary/90 px-5 py-2.5 flex items-center gap-2 rounded-full shadow-sm cursor-pointer"
                    >
                        <Plus className="h-4 w-4 text-white" />
                        <span className="font-plusJakarta font-semibold text-xs sm:text-sm text-white">
                            Buat Pengumuman
                        </span>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm mt-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm font-medium text-slate-500">Memuat data pengumuman dari server...</p>
                </div>
            ) : (
                <DataTable columns={tableColumns} data={data} />
            )}

            {/* Modal Tambah / Edit Pengumuman */}
            {isModalOpen && (
                <div
                    data-lenis-prevent="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !submitting) {
                            setIsModalOpen(false);
                        }
                    }}
                >
                    <div
                        data-lenis-prevent="true"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-auto animate-scaleUp font-plusJakarta"
                    >
                        {/* Modal Header (Fixed, non-scrolling) */}
                        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-white shrink-0">
                            <h2 className="font-plusJakarta text-xl sm:text-2xl font-bold text-primary">
                                {editingItem ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!submitting) setIsModalOpen(false);
                                }}
                                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Scrollable Form Body (Single scrollable container) */}
                        <form
                            data-lenis-prevent="true"
                            onSubmit={handleSubmitForm}
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-4"
                        >
                            {/* Alert Message */}
                            {message && (
                                <div
                                    className={`flex items-center gap-2 rounded-xl p-3.5 text-sm border ${
                                        message.type === "success"
                                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                            : "bg-rose-50 text-rose-800 border-rose-200"
                                    }`}
                                >
                                    {message.type === "success" ? (
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Judul Pengumuman *
                                </label>
                                <Input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Contoh: Persekutuan Doa Padang 2026"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="kegiatan">Kegiatan / Ibadah</option>
                                        <option value="oprec">Open Recruitment (Oprec)</option>
                                        <option value="ultah">Ulang Tahun</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Tanggal Publikasi *
                                    </label>
                                    <Input
                                        type="date"
                                        required
                                        value={datePublished}
                                        onChange={(e) => setDatePublished(e.target.value)}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Penulis / Divisi Penanggung Jawab
                                </label>
                                <Input
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Contoh: Divisi Acara PMK Daniel"
                                    className="h-11 rounded-xl"
                                />
                            </div>

                            {/* Upload Gambar ke Cloudflare R2 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Gambar Poster Pengumuman
                                </label>
                                <div className="mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 hover:bg-gray-50 transition-colors relative cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    {previewUrl ? (
                                        <div className="relative h-44 w-full">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview Poster"
                                                fill
                                                className="object-contain rounded-xl"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center">
                                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-primary">
                                                Klik untuk pilih gambar poster baru
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">
                                                Maksimal 5MB (JPEG, PNG, WebP)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Isi Konten Pengumuman *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Tuliskan deskripsi lengkap acara, ayat tema, waktu, lokasi, dan narahubung..."
                                    className="w-full rounded-2xl border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                                />
                            </div>
                        </form>

                        {/* Footer Actions (Fixed, non-scrolling) */}
                        <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-slate-50/80 shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                disabled={submitting}
                                className="rounded-full px-6 cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSubmitForm}
                                disabled={submitting}
                                className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-full px-7 cursor-pointer"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <span>{editingItem ? "Perbarui Pengumuman" : "Terbitkan Pengumuman"}</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}