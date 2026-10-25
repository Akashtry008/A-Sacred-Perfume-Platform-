export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vedapavitra.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
