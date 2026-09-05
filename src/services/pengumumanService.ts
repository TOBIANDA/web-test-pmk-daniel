import { cache } from "react";
import { Pengumuman, PengumumanInput } from "@/types/pengumuman";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pmkdaniel-api.danielmemory26.workers.dev/api";

function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (typeof window !== "undefined") {
        const token =
            localStorage.getItem("admin_token") ||
            localStorage.getItem("pmk_admin_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return headers;
}

function getUploadAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
        const token =
            localStorage.getItem("admin_token") ||
            localStorage.getItem("pmk_admin_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return headers;
}

export function normalizePengumumanImageUrl(url?: string): string {
    if (!url || !url.trim()) {
        return "/pengumuman/persekutuan-doa-1-2026.jpg";
    }
    // Replace blocked Cloudflare R2 default domain with Cloudflare Worker proxy endpoint
    if (url.includes("pub-317e9a74788b4b17a1deee01aa307c7c.r2.dev")) {
        return url.replace(
            "https://pub-317e9a74788b4b17a1deee01aa307c7c.r2.dev",
            "https://pmkdaniel-api.danielmemory26.workers.dev/api/upload"
        );
    }
    return url;
}

const fetchPengumumanByIdInternal = async (idOrSlug: string): Promise<Pengumuman | undefined> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const url = `${API_BASE_URL}/pengumuman/${idOrSlug}`;

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
                    slug: item.slug,
                    imageUrl: normalizePengumumanImageUrl(item.image_url),
                    datePublished: item.date_published,
                    description: item.content,
                    content: item.content,
                    category: item.category,
                    author: item.author,
                    views: item.views,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                };
            }
        }
    } catch (error) {
        console.error(`Gagal mengambil detail pengumuman (${idOrSlug}) dari API:`, error);
    }

    return undefined;
};

export const pengumumanService = {
    /**
     * Mengambil daftar semua pengumuman murni dari Backend API Cloudflare
     */
    async getPengumumanList(kategori?: string, search?: string): Promise<Pengumuman[]> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const params = new URLSearchParams();
            if (kategori && kategori !== "all") params.append("kategori", kategori);
            if (search && search.trim()) params.append("search", search.trim());
            params.append("limit", "50");

            const url = `${API_BASE_URL}/pengumuman?${params.toString()}`;

            const res = await fetch(url, {
                cache: "no-store",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data?.items && Array.isArray(data.data.items)) {
                    return data.data.items.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        imageUrl: normalizePengumumanImageUrl(item.image_url),
                        datePublished: item.date_published,
                        description: item.content,
                        content: item.content,
                        category: item.category,
                        author: item.author,
                        views: item.views,
                        created_at: item.created_at,
                        updated_at: item.updated_at,
                    }));
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data pengumuman dari API Cloudflare:", error);
        }

        return [];
    },

    /**
     * Mengambil detail pengumuman murni dari Backend API Cloudflare berdasarkan ID atau Slug
     */
    getPengumumanById: cache(fetchPengumumanByIdInternal),

    /**
     * Menambahkan pengumuman baru (Admin - with Authorization header)
     */
    async createPengumuman(payload: PengumumanInput): Promise<any> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch(`${API_BASE_URL}/pengumuman`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.success) {
                return data;
            }
            throw new Error(data.message || data.error || data.detail || "Gagal membuat pengumuman");
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    },

    /**
     * Memperbarui pengumuman (Admin - with Authorization header)
     */
    async updatePengumuman(id: string, payload: Partial<PengumumanInput>): Promise<any> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch(`${API_BASE_URL}/pengumuman/${id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.success) {
                return data;
            }
            throw new Error(data.message || data.error || data.detail || "Gagal memperbarui pengumuman");
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    },

    /**
     * Menghapus pengumuman (Admin - with Authorization header)
     */
    async deletePengumuman(id: string): Promise<any> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const res = await fetch(`${API_BASE_URL}/pengumuman/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.success) {
                return data;
            }
            throw new Error(data.message || data.error || data.detail || "Gagal menghapus pengumuman");
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    },

    /**
     * Upload gambar ke Cloudflare R2
     */
    async uploadImage(file: File): Promise<string> {
        const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error("Ukuran gambar melebihi batas 5MB");
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
            throw new Error("Format gambar tidak diizinkan. Hanya menerima JPG, PNG, atau WEBP.");
        }

        const formData = new FormData();
        formData.append("file", file);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                headers: getUploadAuthHeaders(),
                body: formData,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            const data = await res.json();
            if (data.success && data.data?.url) {
                return normalizePengumumanImageUrl(data.data.url);
            }
            throw new Error(data.message || data.error || "Gagal mengunggah gambar ke Cloudflare R2");
        } catch (err: any) {
            clearTimeout(timeoutId);
            throw err;
        }
    }
};
