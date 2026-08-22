import { dataPengumuman } from "@/dataDummy/pengumuman";
import { Pengumuman } from "@/types/pengumuman";
import { api } from "@/lib/axios";

// Simulasi network delay
const simulateNetworkDelay = false;
const DELAY_MS = 500;

export const pengumumanService = {
    /**
     * Mengambil daftar semua pengumuman
     */
    async getPengumumanList(): Promise<Pengumuman[]> {
        // Contoh implementasi axios (di-comment karena belum ada endpoint asli):
        // try {
        //     const response = await api.get<Pengumuman[]>("/pengumuman");
        //     return response.data;
        // } catch (error) {
        //     console.error("Failed to fetch pengumuman list", error);
        //     return [];
        // }

        if (simulateNetworkDelay) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
        return Promise.resolve(dataPengumuman);
    },

    /**
     * Mengambil detail pengumuman berdasarkan ID
     */
    async getPengumumanById(id: string): Promise<Pengumuman | undefined> {
        // Contoh implementasi axios:
        // try {
        //     const response = await api.get<Pengumuman>(`/pengumuman/${id}`);
        //     return response.data;
        // } catch (error) {
        //     console.error(`Failed to fetch pengumuman ${id}`, error);
        //     return undefined;
        // }

        if (simulateNetworkDelay) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
        const pengumuman = dataPengumuman.find(item => item.id === id);
        return Promise.resolve(pengumuman);
    }
};
