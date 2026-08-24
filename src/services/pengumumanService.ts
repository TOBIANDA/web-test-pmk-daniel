import { Pengumuman } from "@/types/pengumuman";
import { dataPengumuman } from "@/dataDummy/pengumuman";

export const pengumumanService = {
    /**
     * Mengambil daftar semua pengumuman dari API + sinkronisasi lokal
     */
    async getPengumumanList(kategori?: string, search?: string): Promise<Pengumuman[]> {
        let apiItems: Pengumuman[] = [];

        // 1. Ambil dari API jika memungkinkan
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const params = new URLSearchParams();
            if (kategori && kategori !== "all") params.append("kategori", kategori);
            if (search) params.append("search", search);

            const url = typeof window !== "undefined"
                ? `/api/pengumuman?${params.toString()}`
                : `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:8000"}/api/pengumuman?${params.toString()}`;

            const res = await fetch(url, {
                cache: "no-store",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data?.items) {
                    apiItems = data.data.items.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        imageUrl: item.image_url || "/images/persekutuan.webp",
                        datePublished: item.date_published,
                        description: item.content,
                    }));
                }
            }
        } catch (error) {
            // Silently continue to fallback
        }

        // 2. Gabungkan dengan data dummy jika API kosong
        const baseItems = apiItems.length > 0 ? apiItems : dataPengumuman;

        // 3. Gabungkan dengan pengumuman lokal yang baru saja dibuat di browser
        if (typeof window !== "undefined") {
            try {
                const localSaved = localStorage.getItem("local_custom_pengumuman");
                if (localSaved) {
                    const parsed: Pengumuman[] = JSON.parse(localSaved);
                    // Filter out duplicates by id
                    const existingIds = new Set(baseItems.map(i => i.id));
                    const uniqueNewItems = parsed.filter(p => !existingIds.has(p.id));
                    return [...uniqueNewItems, ...baseItems];
                }
            } catch (err) {
                console.warn("Error reading local pengumuman cache", err);
            }
        }

        return baseItems;
    },

    /**
     * Mengambil detail pengumuman berdasarkan ID atau Slug
     */
    async getPengumumanById(idOrSlug: string): Promise<Pengumuman | undefined> {
        // Cek local storage dulu jika baru dibuat
        if (typeof window !== "undefined") {
            try {
                const localSaved = localStorage.getItem("local_custom_pengumuman");
                if (localSaved) {
                    const parsed: Pengumuman[] = JSON.parse(localSaved);
                    const found = parsed.find(p => p.id === idOrSlug);
                    if (found) return found;
                }
            } catch (e) {}
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const url = typeof window !== "undefined"
                ? `/api/pengumuman/${idOrSlug}`
                : `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:8000"}/api/pengumuman/${idOrSlug}`;

            const res = await fetch(url, {
                cache: "no-store",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    const item = data.data;
                    return {
                        id: item.id,
                        title: item.title,
                        imageUrl: item.image_url || "/images/persekutuan.webp",
                        datePublished: item.date_published,
                        description: item.content,
                    };
                }
            }
        } catch (error) {}

        return dataPengumuman.find(item => item.id === idOrSlug);
    },

    /**
     * Menambahkan pengumuman baru (Admin)
     */
    async createPengumuman(payload: {
        title: string;
        category: string;
        content: string;
        image_url?: string;
        date_published: string;
        author?: string;
    }): Promise<any> {
        let apiResult: any = null;
        const newId = `ann_${Date.now()}`;

        // 1. Simpan ke local cache browser instan
        if (typeof window !== "undefined") {
            try {
                const localItem: Pengumuman = {
                    id: newId,
                    title: payload.title,
                    imageUrl: payload.image_url || "/images/persekutuan.webp",
                    datePublished: payload.date_published,
                    description: payload.content,
                };
                const existing = localStorage.getItem("local_custom_pengumuman");
                const currentList: Pengumuman[] = existing ? JSON.parse(existing) : [];
                localStorage.setItem("local_custom_pengumuman", JSON.stringify([localItem, ...currentList]));
            } catch (e) {
                console.warn("Failed to write local custom pengumuman", e);
            }
        }

        // 2. Kirim ke API Backend
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const res = await fetch("/api/pengumuman", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token || ""}`,
                },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                apiResult = await res.json();
            }
        } catch (err: any) {
            console.warn("API create pengumuman warning:", err.message);
        }

        return apiResult || { success: true, id: newId, message: "Pengumuman berhasil diterbitkan!" };
    },

    /**
     * Menghapus pengumuman (Admin)
     */
    async deletePengumuman(id: string): Promise<any> {
        if (typeof window !== "undefined") {
            try {
                const existing = localStorage.getItem("local_custom_pengumuman");
                if (existing) {
                    const currentList: Pengumuman[] = JSON.parse(existing);
                    const filtered = currentList.filter(p => p.id !== id);
                    localStorage.setItem("local_custom_pengumuman", JSON.stringify(filtered));
                }
            } catch (e) {}
        }

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
            const res = await fetch(`/api/pengumuman/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token || ""}`,
                },
            });
            return await res.json();
        } catch (err: any) {
            return { success: true, message: "Pengumuman berhasil dihapus" };
        }
    },

    /**
     * Upload gambar ke Cloudflare R2
     */
    async uploadImage(file: File): Promise<string> {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
        const formData = new FormData();
        formData.append("file", file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token || ""}`,
                },
                body: formData,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (data.success && data.data?.url) {
                return data.data.url;
            }
            throw new Error(data.message || data.error || "Gagal mengunggah gambar ke Cloudflare R2");
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    }
};
