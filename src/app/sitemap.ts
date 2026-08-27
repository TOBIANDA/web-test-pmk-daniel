import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://pmkdaniel.site',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://pmkdaniel.site/home',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://pmkdaniel.site/tentang',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
        {
            url: 'https://pmkdaniel.site/pengumuman',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
        {
            url: 'https://pmkdaniel.site/join',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
        {
            url: 'https://pmkdaniel.site/credit',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
    ]
}