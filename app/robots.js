export default function robots() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://kitmint.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/settings', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
