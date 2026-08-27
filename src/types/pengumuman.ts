export interface Pengumuman {
    id: string;
    imageUrl: string;
    title: string;
    datePublished: string;
    description: string;
    slug?: string;
    category?: string;
    content?: string;
    author?: string;
    views?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PengumumanInput {
    title: string;
    category: string;
    content: string;
    image_url?: string;
    date_published: string;
    author?: string;
}
