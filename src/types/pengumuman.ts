export interface Pengumuman {
    id: string;
    slug?: string;
    imageUrl: string;
    title: string;
    datePublished: string;
    description: string;
    category?: string;
    content?: string;
    author?: string;
    views?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PengumumanInput {
    title: string;
    slug?: string;
    category: string;
    content: string;
    image_url?: string;
    date_published: string;
    author?: string;
}
