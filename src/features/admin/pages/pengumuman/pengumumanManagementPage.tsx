"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pengumuman } from "@/types/pengumuman";
import { pengumumanService } from "@/services/pengumumanService";
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  User, 
  Eye, 
  Upload, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Megaphone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PengumumanManagementPage() {
  const [items, setItems] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Pengumuman | null>(null);

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

  // Lock body scroll when modal is open
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

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await pengumumanService.getPengumumanList();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load pengumuman:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleOpenEditModal = (item: Pengumuman) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category || "kegiatan");
    setDatePublished(item.datePublished || new Date().toISOString().split("T")[0]);
    setContent(item.description || item.content || "");
    setAuthor(item.author || "Divisi Acara");
    setSelectedFile(null);
    setPreviewUrl(item.imageUrl || null);
    setMessage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Pengumuman) => {
    if (!window.confirm(`Hapus pengumuman "${item.title}" secara permanen?`)) {
      return;
    }

    try {
      await pengumumanService.deletePengumuman(item.id);
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      alert("Pengumuman berhasil dihapus!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pengumuman");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage({ text: "Judul pengumuman wajib diisi", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      let uploadedImageUrl = editingItem?.imageUrl || "";

      if (selectedFile) {
        try {
          uploadedImageUrl = await pengumumanService.uploadImage(selectedFile);
        } catch (uploadErr: any) {
          console.warn("Upload to R2 warning:", uploadErr.message);
        }
      }

      if (editingItem) {
        await pengumumanService.updatePengumuman(editingItem.id, {
          title: title.trim(),
          category,
          date_published: datePublished,
          content: content.trim(),
          author: author.trim(),
          image_url: uploadedImageUrl || undefined,
        });
        setMessage({ text: "Pengumuman berhasil diperbarui!", type: "success" });
      } else {
        await pengumumanService.createPengumuman({
          title: title.trim(),
          category,
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
        loadData();
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
    <div className="w-full min-h-screen py-6 sm:py-10 px-4 sm:px-8 lg:px-14 font-plusJakarta text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-plusJakarta text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Kelola Pengumuman
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Publikasi warta kegiatan, ibadah, dan berita persekutuan PMK Daniel FILKOM UB
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              title="Muat ulang data terbaru dari server"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
              <span>Segarkan</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Pengumuman</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari judul, topik, atau penulis..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-slate-800"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="kegiatan">Kegiatan / Ibadah</option>
              <option value="oprec">Open Recruitment (Oprec)</option>
              <option value="ultah">Ulang Tahun</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Total <span className="text-primary font-bold">{filteredItems.length}</span> Pengumuman Terdata
          </div>
        </div>

        {/* Content Table Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm font-medium text-slate-500">Memuat data pengumuman...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Megaphone size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Tidak ada pengumuman yang sesuai</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori di atas.
            </p>
          </div>
        ) : (
          <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Pengumuman</th>
                    <th className="py-4 px-4">Kategori</th>
                    <th className="py-4 px-4">Publikasi</th>
                    <th className="py-4 px-4">Dibaca</th>
                    <th className="py-4 px-4">Penulis</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Judul & Poster Thumbnail */}
                      <td className="py-4 px-6 max-w-sm">
                        <div className="flex items-center gap-3.5">
                          <div className="relative h-12 w-10 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80">
                            <Image
                              src={item.imageUrl || "/pengumuman/persekutuan-doa-1-2026.jpg"}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <Link
                              href={`/limarotiduaikan/${item.id}`}
                              className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 hover:underline text-sm sm:text-base"
                            >
                              {item.title}
                            </Link>
                            <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {item.description || item.content}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider">
                          {item.category || "Kegiatan"}
                        </span>
                      </td>

                      {/* Publikasi */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-primary" />
                          <span>{item.datePublished}</span>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Eye size={13} className="text-secondary" />
                          <span>{item.views || 0} kali</span>
                        </div>
                      </td>

                      {/* Penulis */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" />
                          <span className="truncate max-w-[120px]">{item.author || "Divisi Acara"}</span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/pengumuman/${item.slug || item.id}`}
                            target="_blank"
                            className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Lihat halaman publik"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-xl text-slate-400 hover:text-secondary hover:bg-secondary/10 transition-colors cursor-pointer"
                            title="Edit pengumuman"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus pengumuman"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Toolbar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span>
                  Halaman {currentPage} dari {totalPages} ({filteredItems.length} total)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-primary text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
            className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-[32px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-auto font-plusJakarta"
          >
            {/* Modal Header (Fixed, non-scrolling) */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100 bg-slate-50/90 shrink-0">
              <div>
                <h2 className="font-plusJakarta text-lg sm:text-xl font-extrabold text-slate-900">
                  {editingItem ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publikasikan warta kegiatan dan informasi persekutuan PMK Daniel
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!submitting) setIsModalOpen(false);
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-slate-200/60 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form
              data-lenis-prevent="true"
              onSubmit={handleSubmitForm}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 flex flex-col gap-4"
            >
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Judul Pengumuman *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Persekutuan Doa Rutin: Hikmat dalam Setiap Tindakan"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all cursor-pointer font-medium text-slate-800"
                  >
                    <option value="kegiatan">Kegiatan / Ibadah</option>
                    <option value="oprec">Open Recruitment (Oprec)</option>
                    <option value="ultah">Ulang Tahun</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal Publikasi *
                  </label>
                  <Input
                    type="date"
                    required
                    value={datePublished}
                    onChange={(e) => setDatePublished(e.target.value)}
                    className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Penulis / Divisi Penanggung Jawab
                </label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Divisi Acara PMK Daniel"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
                />
              </div>

              {/* Upload Gambar ke Cloudflare R2 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gambar Poster Pengumuman
                </label>
                <div className="mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-6 hover:bg-slate-50/80 transition-colors relative cursor-pointer">
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
                      <Upload className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-xs sm:text-sm font-bold text-primary">
                        Klik untuk memilih gambar poster (JPG, PNG, WebP)
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        Maksimal ukuran file: 5MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Isi Konten / Deskripsi Lengkap *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan rincian lengkap acara, ayat tema, waktu, tempat, dan kontak narahubung..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white leading-relaxed font-normal"
                />
              </div>
            </form>

            {/* Footer Actions (Fixed, non-scrolling) */}
            <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-slate-50/90 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="px-5 py-2.5 rounded-full border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitForm}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-primary/20 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{editingItem ? "Perbarui Pengumuman" : "Terbitkan Pengumuman"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
