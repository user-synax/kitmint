'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Copy, Check, Share2, Eye, Calendar, Globe, Lock, RefreshCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ColorSwatch from './ColorSwatch';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const CopyIcon = ({ text, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Copied ${label || 'to clipboard'}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span onClick={handleCopy} className="cursor-pointer p-1 rounded hover:bg-surface-2 transition-colors">
      {copied ? <Check className="w-4 h-4 text-primary-text" /> : <Copy className="w-4 h-4 text-text-muted hover:text-text-primary" />}
    </span>
  );
};

const SectionLabel = ({ children, blockKey }) => (
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-500 text-[#6B7280] uppercase tracking-widest">{children}</p>
      {isPro && isOwner && blockKey && (
        <button 
          onClick={() => handleRefreshBlock(blockKey)}
          disabled={refreshingBlocks[blockKey]}
          className="flex items-center gap-1.5 text-[10px] font-medium text-primary hover:text-primary-hover transition-colors disabled:opacity-50"
          title="Refresh this block"
        >
          <RefreshCcw className={cn("w-3 h-3", refreshingBlocks[blockKey] && "animate-spin")} />
          {refreshingBlocks[blockKey] ? 'Refreshing...' : 'Refresh'}
        </button>
      )}
    </div>
  );

export default function KitResult({ kit: initialKit }) {
  const { data: session } = useSession();
  const [kit, setKit] = useState(initialKit);
  const [selectedNameIndex, setSelectedNameIndex] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [refreshingBlocks, setRefreshingBlocks] = useState({});

  const isOwner = session?.user?.id === kit.userId;
  const isPro = session?.user?.plan === 'pro';
  const isFree = session?.user?.plan === 'free' || !session;

  const handleRefreshBlock = async (blockKey) => {
    if (!isPro) {
      toast.error('Refreshing individual blocks is a Pro feature.');
      return;
    }

    setRefreshingBlocks(prev => ({ ...prev, [blockKey]: true }));
    try {
      const res = await fetch('/api/generate-kit/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitId: kit._id, blockKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Refresh failed');
      }

      const data = await res.json();
      setKit(prev => ({ ...prev, [blockKey]: data.refreshedData }));
      toast.success(`Refreshed ${blockKey} successfully!`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRefreshingBlocks(prev => ({ ...prev, [blockKey]: false }));
    }
  };

  const handlePublish = async () => {
    if (!session) {
      toast.error('Please sign in to publish your kit');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: kit.slug, action: 'publish' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to publish');
      }

      setKit({ ...kit, isPublic: true });
      toast.success('Kit published to gallery!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/kit/${kit.slug}`;
    const brandName = kit.brandNames?.[selectedNameIndex]?.name || 'Brand Kit';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brandName} — Brand Kit by KitMint`,
          text: kit.tagline,
          url: shareUrl,
        });
      } catch (err) {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const copyAllTweets = () => {
    const allTweets = kit.twitterThread.join('\n\n');
    navigator.clipboard.writeText(allTweets);
    toast.success('All tweets copied!');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-16 animate-fade-in">
      {/* FREE USER BADGE */}
      {isFree && (
        <div className="mb-8 bg-surface-2 border border-border rounded-lg p-4 flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Free Brand Kit</p>
              <p className="text-xs text-text-secondary">Upgrade to Pro for unlimited kits and block-level refreshing.</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-white font-semibold">
            <Link href="/settings">Upgrade to Pro</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">
        
        <div className="space-y-12">
          
          <section>
            <p className="text-xs font-500 text-[#4ADE80] uppercase tracking-widest mb-3">Generated Kit</p>
            <div className="border-l-2 border-[#16A34A] pl-4">
              <p className="text-[#9CA3AF] text-sm italic">"{kit.ideaPrompt}"</p>
            </div>
          </section>

          <section>
            <SectionLabel blockKey="brandNames">Brand Names</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {kit.brandNames.map((bn, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedNameIndex(i)}
                  className={`flex-1 min-w-[240px] border rounded-md p-4 cursor-pointer transition-all ${
                    selectedNameIndex === i 
                      ? 'border-[#16A34A] bg-[#14532D1A]' 
                      : 'border-[#1F2937] bg-surface hover:border-[#16A34A]/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-text-primary">{bn.name}</h3>
                    {selectedNameIndex === i && <Badge className="bg-primary text-white text-[10px]">Selected</Badge>}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">{bn.reason}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel blockKey="tagline">Tagline</SectionLabel>
            <div className="bg-surface border border-border rounded-md p-6 relative">
              <div className="absolute top-4 right-4">
                <CopyIcon text={kit.tagline} label="tagline" />
              </div>
              <h2 className="text-2xl font-bold text-center py-4 text-text-primary">
                {kit.tagline}
              </h2>
            </div>
          </section>

          <section>
            <SectionLabel blockKey="colors">Color Palette</SectionLabel>
            <ColorSwatch colors={kit.colors} />
          </section>

          <section>
            <SectionLabel blockKey="fonts">Typography</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-md p-5">
                <p className="text-[10px] text-text-muted uppercase mb-4">Heading Font</p>
                <p className="text-2xl mb-1 text-text-primary" style={{ fontFamily: kit?.fonts?.heading }}>
                  {kit?.fonts?.heading}
                </p>
                <p className="text-xs text-text-muted">Weight: 700 / Bold</p>
              </div>
              <div className="bg-surface border border-border rounded-md p-5">
                <p className="text-[10px] text-text-muted uppercase mb-4">Body Font</p>
                <p className="text-2xl mb-1 text-text-primary" style={{ fontFamily: kit?.fonts?.body }}>
                  {kit?.fonts?.body}
                </p>
                <p className="text-xs text-text-muted">Weight: 400 / Regular</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed pl-1 italic">
              "{kit?.fonts?.pairing_reason}"
            </p>
          </section>

          <section>
            <SectionLabel blockKey="landingCopy">Landing Page Copy</SectionLabel>
            <div className="space-y-4">
              {[
                { label: 'Hero Headline', value: kit?.landingCopy?.hero },
                { label: 'Subtext / Value Prop', value: kit?.landingCopy?.subtext },
                { label: 'Primary CTA', value: kit?.landingCopy?.cta }
              ].map((item, i) => (
                <div key={i} className="bg-surface border border-border rounded-md p-5 relative">
                  <div className="absolute top-4 right-4">
                    <CopyIcon text={item.value} label={item.label} />
                  </div>
                  <p className="text-[10px] text-text-muted uppercase mb-2">{item.label}</p>
                  <p className="text-text-primary pr-8">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel blockKey="twitterThread">Twitter Thread</SectionLabel>
            <div className="space-y-4">
              {kit?.twitterThread?.map((tweet, i) => (
                <div key={i} className="bg-surface border border-border rounded-md p-5 relative">
                  <div className="absolute top-4 right-4">
                    <CopyIcon text={tweet} label={`Tweet ${i+1}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[10px] text-text-muted">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-text-primary pr-8 text-sm leading-relaxed">{tweet}</p>
                </div>
              ))}
              <Button 
                variant="outline" 
                onClick={copyAllTweets}
                className="w-full border-dashed border-border hover:border-primary/50 text-text-secondary hover:text-text-primary"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All Tweets
              </Button>
            </div>
          </section>

          <section>
            <SectionLabel blockKey="productHunt">Product Hunt</SectionLabel>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-surface border border-border rounded-md p-5 relative">
                <div className="absolute top-4 right-4">
                  <CopyIcon text={kit?.productHunt?.tagline || kit?.productHuntDesc?.tagline} label="PH tagline" />
                </div>
                <p className="text-[10px] text-text-muted uppercase mb-2">Tagline</p>
                <p className="text-text-primary pr-8 font-medium">
                  {kit?.productHunt?.tagline || kit?.productHuntDesc?.tagline}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-md p-5 relative">
                <div className="absolute top-4 right-4">
                  <CopyIcon text={kit?.productHunt?.description || kit?.productHuntDesc?.description} label="PH description" />
                </div>
                <p className="text-[10px] text-text-muted uppercase mb-2">Description</p>
                <p className="text-text-primary pr-8 text-sm leading-relaxed">
                  {kit?.productHunt?.description || kit?.productHuntDesc?.description}
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionLabel blockKey="pricingCopy">Pricing Copy</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[kit?.pricingCopy?.tier1, kit?.pricingCopy?.tier2, kit?.pricingCopy?.tier3].map((tier, i) => (
                <div key={i} className="bg-surface border border-border rounded-md p-5 relative flex flex-col justify-center">
                  <div className="absolute top-4 right-4">
                    <CopyIcon text={tier} label={`Tier ${i+1}`} />
                  </div>
                  <p className="text-[10px] text-text-muted uppercase mb-3">Tier {i+1}</p>
                  <p className="text-text-primary text-sm pr-6">{tier}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-border/50" />

          <div className="flex flex-col gap-3 pt-4">
            {kit.isPublic && (
              <Button 
                onClick={handleShare}
                className="w-full bg-primary hover:bg-primary-hover text-white h-12 font-bold"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Kit
              </Button>
            )}
            
            <Button 
              variant="outline" 
              asChild
              className="w-full border-border hover:bg-surface-2 text-text-primary h-12"
            >
              <Link href="/">
                Generate another kit
              </Link>
            </Button>
          </div>

        </div>

        <div className="relative">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="bg-[#111111] border border-[#1F2937] rounded-lg p-6 space-y-6 overflow-hidden relative">
              <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.03] pointer-events-none rotate-12">
                <Image src="/logo.svg" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-text-secondary">
                    <Eye className="w-4 h-4 mr-2 text-text-muted" />
                    Views
                  </span>
                  <span className="font-mono text-text-primary">{kit.views}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-text-secondary">
                    <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                    Created
                  </span>
                  <span className="text-text-primary">
                    {new Date(kit.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Separator className="bg-[#1F2937]" />

              <div className="space-y-4">
                {kit.isPublic ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#14532D] text-[#4ADE80] border-none px-2 py-0.5 rounded-full flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        Published
                      </Badge>
                    </div>
                    <div className="bg-surface-2 border border-border rounded-md p-3 flex items-center justify-between group">
                      <span className="text-[10px] font-mono text-text-secondary truncate pr-2">
                        {typeof window !== 'undefined' ? `${window.location.origin}/kit/${kit.slug}` : `/kit/${kit.slug}`}
                      </span>
                      <CopyIcon 
                        text={typeof window !== 'undefined' ? `${window.location.origin}/kit/${kit.slug}` : ''} 
                        label="Share link" 
                      />
                    </div>
                    <Button variant="outline" onClick={handleShare} className="w-full border-border hover:bg-surface-2 text-text-primary h-9 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Kit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isOwner ? (
                      <>
                        <Button className="w-full bg-primary hover:bg-primary-hover text-white font-semibold" onClick={handlePublish} disabled={isPublishing}>
                          {isPublishing ? 'Publishing...' : 'Publish to Gallery'}
                        </Button>
                        <p className="text-[10px] text-text-muted text-center">
                          Make this kit visible to everyone in the gallery
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-text-muted italic text-sm py-2">
                        <Lock className="w-4 h-4" />
                        Private Kit
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator className="bg-[#1F2937]" />

              {!session ? (
                <div className="space-y-3">
                  <Button variant="ghost" asChild className="w-full border-border hover:bg-surface-2 text-text-primary">
                    <Link href="/signup">Save this kit</Link>
                  </Button>
                  <p className="text-[10px] text-text-muted text-center">
                    Free account required to save kits
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  {isOwner ? (
                    <p className="text-xs text-[#4ADE80] font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      Saved to your dashboard
                    </p>
                  ) : (
                    <Button variant="ghost" className="w-full border-border hover:bg-surface-2 text-text-primary">
                      Save to my kits
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            <Button variant="link" asChild className="w-full text-text-muted hover:text-text-primary text-xs">
              <Link href="/">← Generate another kit</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
