import { db } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vedapavitra.com';

  const staticPages = [
    '',
    '/collections',
    '/blogs',
    '/pages/about-us',
    '/pages/contact',
    '/pages/wholesale',
    '/pages/faq',
    '/pages/shipping-policy',
    '/pages/return-refund-policy',
    '/pages/privacy-policy',
    '/pages/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const products = db.getProducts({ limit: 100 }).products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt || new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const collections = db.getCollections().map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const blogs = db.getBlogs().map((b) => ({
    url: `${baseUrl}/blogs/${b.slug}`,
    lastModified: b.publishedAt || new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...collections, ...products, ...blogs];
}
