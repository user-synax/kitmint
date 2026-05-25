import connectDB from '@/lib/db';
import Kit from '@/models/Kit';
import GalleryClient from '@/components/kit/GalleryClient';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: "Gallery — KitMint",
  description: "Browse brand kits created by the community",
};

export default async function GalleryPage() {
  await connectDB();

  const limit = 12;
  const kits = await Kit.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const totalCount = await Kit.countDocuments({ isPublic: true });
  const totalPages = Math.ceil(totalCount / limit);

  // Serialize MongoDB objects for the client component
  const serializedKits = JSON.parse(JSON.stringify(kits));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <GalleryClient 
        initialKits={serializedKits} 
        totalCount={totalCount} 
        totalPages={totalPages} 
      />
    </div>
  );
}
