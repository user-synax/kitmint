import connectDB from '@/lib/db';
import Kit from '@/models/Kit';

export default async function sitemap() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://kitmint.vercel.app';

  // Static routes
  const staticRoutes = [
    '',
    '/gallery',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes for public kits
  await connectDB();
  const publicKits = await Kit.find({ isPublic: true }).select('slug createdAt').lean();
  
  const dynamicRoutes = publicKits.map((kit) => ({
    url: `${baseUrl}/kit/${kit.slug}`,
    lastModified: new Date(kit.createdAt),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
