import Navbar from '@/components/layout/Navbar';
import IdeaForm from '@/components/shared/IdeaForm';
import connectDB from '@/lib/db';
import Kit from '@/models/Kit';
import KitCard from '@/components/kit/KitCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  await connectDB();
  const recentKits = await Kit.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const serializedKits = JSON.parse(JSON.stringify(recentKits));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 py-24 md:py-32 border-b border-border/50">
          <div className="max-w-[1200px] w-full text-center space-y-12">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-display font-extrabold tracking-tight text-text-primary leading-[1.1]">
                Turn an idea into a brand.
              </h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
                Describe your startup in one sentence. Get brand names, colors, copy, and a launch kit in 60 seconds.
              </p>
            </div>

            <IdeaForm />
          </div>
        </section>

        {/* Recently Published Section */}
        <section className="max-w-[1200px] mx-auto w-full px-4 md:px-6 lg:px-8 py-20 md:py-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              Recently Published
            </h2>
            <Link 
              href="/gallery" 
              className="text-primary hover:text-primary-text flex items-center gap-2 text-sm font-medium transition-colors"
            >
              View all kits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {serializedKits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serializedKits.map((kit) => (
                <KitCard key={kit._id} kit={kit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-surface/30">
              <p className="text-text-secondary mb-4 italic">No kits published yet</p>
              <Link href="/" className="text-primary hover:underline">
                Be the first to publish a kit →
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
