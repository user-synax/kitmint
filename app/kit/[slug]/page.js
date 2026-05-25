import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';
import KitResult from '@/components/kit/KitResult';
import Navbar from '@/components/layout/Navbar';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const kit = await Kit.findOne({ slug }).lean();

  if (!kit) return { title: 'Kit Not Found - KitMint' };

  const brandName = kit.brandNames?.[0]?.name || 'Brand Kit';
  return {
    title: `${brandName} — KitMint`,
    description: kit.tagline,
  };
}

export default async function KitPage({ params }) {
  const { slug } = await params;
  await connectDB();

  // Find and increment views server-side
  // Use returnDocument: 'after' instead of deprecated new: true
  const kit = await Kit.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { returnDocument: 'after' }
  ).lean();

  if (!kit) {
    notFound();
  }

  // Thoroughly serialize the kit object to plain values for Client Components
  // This handles nested ObjectIds and Dates that .lean() might leave as objects
  const serializedKit = JSON.parse(JSON.stringify(kit));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <KitResult kit={serializedKit} />
    </div>
  );
}
