export interface PengurusMember {
  id: string;
  divisi_id: string;
  name: string;
  role: string; // e.g. "Ketua Umum", "Koordinator", "Wakil Ketua", "Anggota", "Staff"
  photo_url?: string;
  period?: string; // e.g. "2025/2026"
  order_priority?: number;
}

export interface Divisi {
  id: string;
  name: string;
  komisi?: string; // e.g. "BPH", "Komisi 1", "Komisi 2", "Komisi 3", "Komisi 4", "Sub Komisi 3"
  icon_name?: string; // e.g. "crown", "pen", "wallet", "book", "heart", "sparkles", "video", "settings", "music", "camera", "users", "shield"
  description?: string;
  group_photo_url?: string;
  order_priority: number;
  members: PengurusMember[];
}

export interface DivisiInput {
  id?: string;
  name: string;
  komisi?: string;
  icon_name?: string;
  description?: string;
  group_photo_url?: string;
  order_priority?: number;
}

export interface PengurusMemberInput {
  divisi_id: string;
  name: string;
  role: string;
  photo_url?: string;
  period?: string;
  order_priority?: number;
}
