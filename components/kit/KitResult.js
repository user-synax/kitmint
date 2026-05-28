"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Copy, Check, Share2, Eye, Calendar, Globe, Lock, RefreshCcw, Sparkles, ChevronLeft,
  Users, Palette, Music, MessageCircle, PenTool, Download
} from 'lucide-react';

import { FaInstagram, FaXTwitter, FaTiktok } from "react-icons/fa6";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ColorSwatch from "./ColorSwatch";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CopyIcon = ({ text, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(`Copied ${label || "to clipboard"}`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <span
            onClick={handleCopy}
            className="cursor-pointer p-1 rounded hover:bg-surface-2 transition-colors touch-target-mobile flex items-center justify-center"
        >
            {copied ? (
                <Check className="w-4 h-4 text-primary-text" />
            ) : (
                <Copy className="w-4 h-4 text-text-muted hover:text-text-primary" />
            )}
        </span>
    );
};

export default function KitResult({ kit: initialKit }) {
    const { data: session } = useSession();
    const [kit, setKit] = useState(initialKit);
    const [selectedNameIndex, setSelectedNameIndex] = useState(0);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [refreshingBlocks, setRefreshingBlocks] = useState({});
    const kitRef = useRef(null);

    const isOwner = session?.user?.id === kit.userId;
    const isPro = session?.user?.plan === "pro";
    const isFree = session?.user?.plan === "free" || !session;

    const handleRefreshBlock = async (blockKey) => {
        if (!isPro) {
            toast.error("Refreshing individual blocks is a Pro feature.");
            return;
        }

        setRefreshingBlocks((prev) => ({ ...prev, [blockKey]: true }));
        try {
            const res = await fetch("/api/generate-kit/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kitId: kit._id, blockKey }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Refresh failed");
            }

            const data = await res.json();
            setKit((prev) => ({ ...prev, [blockKey]: data.refreshedData }));
            toast.success(`Refreshed ${blockKey} successfully!`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setRefreshingBlocks((prev) => ({ ...prev, [blockKey]: false }));
        }
    };

    const SectionLabel = ({ children, blockKey }) => (
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-widest">
                {children}
            </p>
            {isPro && isOwner && blockKey && (
                <button
                    onClick={() => handleRefreshBlock(blockKey)}
                    disabled={refreshingBlocks[blockKey]}
                    className="flex items-center gap-1.5 text-[10px] font-medium text-primary hover:text-primary-hover transition-colors disabled:opacity-50 touch-target-mobile"
                    title="Refresh this block"
                >
                    <RefreshCcw
                        className={cn(
                            "w-3 h-3",
                            refreshingBlocks[blockKey] && "animate-spin",
                        )}
                    />
                    {refreshingBlocks[blockKey] ? "Refreshing..." : "Refresh"}
                </button>
            )}
        </div>
    );

    const handlePublish = async () => {
        if (!session) {
            toast.error("Please sign in to publish your kit");
            return;
        }

        setIsPublishing(true);
        try {
            const res = await fetch("/api/kit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: kit.slug, action: "publish" }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to publish");
            }

            setKit({ ...kit, isPublic: true });
            toast.success("Kit published to gallery!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/kit/${kit.slug}`;
        const brandName =
            kit.brandNames?.[selectedNameIndex]?.name || "Brand Kit";

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${brandName} — Brand Kit by KitMint`,
                    text: kit.tagline,
                    url: shareUrl,
                });
            } catch (err) {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleDownloadPDF = async () => {
        if (!kitRef.current) return;
        
        setIsExporting(true);
        const toastId = toast.loading("Generating professional PDF...");

        try {
            const element = kitRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: "#0A0A0A", // Match brand background
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width / 2, canvas.height / 2], // Match scale 2
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
            
            const brandName = kit.brandNames?.[selectedNameIndex]?.name || "BrandKit";
            pdf.save(`${brandName.replace(/\s+/g, "_")}_BrandKit.pdf`);
            
            toast.success("PDF downloaded successfully!", { id: toastId });
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error("Failed to generate PDF. Please try again.", { id: toastId });
        } finally {
            setIsExporting(false);
        }
    };

    const copyAllTweets = () => {
        const allTweets = kit.twitterThread.join("\n\n");
        navigator.clipboard.writeText(allTweets);
        toast.success("All tweets copied!");
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 animate-fade-in">
            {/* MOBILE BACK BUTTON */}
            <div className="mb-6 lg:hidden">
                <Button
                    variant="ghost"
                    asChild
                    className="pl-0 text-text-secondary hover:text-text-primary"
                >
                    <Link href="/dashboard">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Dashboard
                    </Link>
                </Button>
            </div>

            {/* FREE USER BADGE */}
            {isFree && (
                <div className="mb-8 bg-surface-2 border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-primary">
                                Free Brand Kit
                            </p>
                            <p className="text-xs text-text-secondary leading-relaxed">
                                Upgrade to Pro for unlimited kits and
                                block-level refreshing.
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        size="sm"
                        className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold h-10"
                    >
                        <Link href="/settings">Upgrade to Pro</Link>
                    </Button>
                </div>
            )}

            {isPro && isOwner && (
                <div className="mb-8 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs font-semibold text-primary-text">
                        Refresh individual blocks anytime to get fresh, tailored
                        data
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-12">
                <div ref={kitRef} className="space-y-12 bg-background p-4 sm:p-8 rounded-2xl">
                    <section>
                        <p className="text-xs font-bold text-[#4ADE80] uppercase tracking-widest mb-3">
                            Generated Kit
                        </p>
                        <div className="border-l-2 border-[#16A34A] pl-4">
                            <p className="text-[#9CA3AF] text-sm italic leading-relaxed">
                                "{kit.ideaPrompt}"
                            </p>
                        </div>
                    </section>

                    {/* B) BRAND NAMES SECTION */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.brandNames && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="brandNames">
                            Brand Names
                        </SectionLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {kit.brandNames.map((bn, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedNameIndex(i)}
                                    className={cn(
                                        "flex-1 border rounded-xl p-5 cursor-pointer transition-all duration-300",
                                        selectedNameIndex === i
                                            ? "border-[#16A34A] bg-[#14532D1A] shadow-lg shadow-primary/5"
                                            : "border-[#1F2937] bg-surface hover:border-[#16A34A]/30",
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-text-primary truncate pr-2">
                                            {bn.name}
                                        </h3>
                                        {selectedNameIndex === i && (
                                            <Badge className="bg-primary text-white text-[10px] px-2 h-5">
                                                Selected
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed italic opacity-80">
                                        {bn.reason}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* C) TAGLINE SECTION */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.tagline && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="tagline">Tagline</SectionLabel>
                        <div className="bg-surface border border-border rounded-xl p-6 relative group overflow-hidden">
                            <div className="absolute top-4 right-4 z-10">
                                <CopyIcon text={kit.tagline} label="tagline" />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-text-primary leading-tight pr-8">
                                {kit.tagline}
                            </p>
                        </div>
                    </section>

                    {/* NEW: USER PERSONAS */}
                    {kit?.userPersonas && Array.isArray(kit.userPersonas) && kit.userPersonas.length > 0 && (
                        <section
                            className={cn(
                                "transition-opacity",
                                refreshingBlocks.userPersonas && "opacity-50",
                            )}
                        >
                            <SectionLabel blockKey="userPersonas">
                                Target Audience
                            </SectionLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {kit.userPersonas.map((persona, i) => (
                                    <div
                                        key={i}
                                        className="bg-surface border border-border rounded-xl p-5 space-y-3 relative group"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-primary" />
                                            </div>
                                            <h4 className="font-bold text-text-primary">
                                                {persona.name}
                                            </h4>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">
                                                Profile
                                            </p>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {persona.description}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-error uppercase font-bold mb-1 opacity-80">
                                                Pain Point
                                            </p>
                                            <p className="text-sm text-text-secondary leading-relaxed italic">
                                                "{persona.painPoint}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* D) COLORS SECTION */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.colors && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="colors">
                            Color Palette
                        </SectionLabel>
                        <ColorSwatch colors={kit.colors} />
                    </section>

                    {/* NEW: LOGO PROMPTS */}
                    {kit?.logoPrompts && Array.isArray(kit.logoPrompts) && kit.logoPrompts.length > 0 && (
                        <section
                            className={cn(
                                "transition-opacity",
                                refreshingBlocks.logoPrompts && "opacity-50",
                            )}
                        >
                            <SectionLabel blockKey="logoPrompts">
                                Logo Design Prompts
                            </SectionLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {kit.logoPrompts.map((prompt, i) => (
                                    <div
                                        key={i}
                                        className="bg-surface border border-border rounded-xl p-5 relative group"
                                    >
                                        <div className="absolute top-4 right-4">
                                            <CopyIcon
                                                text={prompt}
                                                label={`Logo Prompt ${i + 1}`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <PenTool className="w-4 h-4 text-primary" />
                                            <p className="text-[10px] text-text-muted uppercase font-bold">
                                                {i === 0
                                                    ? "Minimalist"
                                                    : "Detailed"}
                                            </p>
                                        </div>
                                        <p className="text-sm text-text-primary leading-relaxed pr-6">
                                            {prompt}
                                        </p>
                                        <p className="mt-4 text-[10px] text-text-muted italic">
                                            Use this with DALL-E or Midjourney
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* E) FONTS SECTION */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.fonts && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="fonts">Typography</SectionLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                    Heading Font
                                </p>
                                <p
                                    className="text-2xl font-bold text-text-primary"
                                    style={{ fontFamily: kit.fonts.heading }}
                                >
                                    {kit.fonts.heading}
                                </p>
                                <p className="text-sm text-text-secondary italic">
                                    Perfect for bold statements and titles
                                </p>
                            </div>
                            <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
                                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                    Body Font
                                </p>
                                <p
                                    className="text-lg text-text-primary leading-relaxed"
                                    style={{ fontFamily: kit.fonts.body }}
                                >
                                    {kit.fonts.body}
                                </p>
                                <p className="text-sm text-text-secondary italic">
                                    Designed for readability and clarity
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* F) LANDING PAGE COPY */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.landingCopy && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="landingCopy">
                            Landing Page Copy
                        </SectionLabel>
                        <div className="space-y-4">
                            {[
                                {
                                    label: "Hero Headline",
                                    value: kit?.landingCopy?.hero,
                                },
                                {
                                    label: "Subtext / Value Prop",
                                    value: kit?.landingCopy?.subtext,
                                },
                                {
                                    label: "Primary CTA",
                                    value: kit?.landingCopy?.cta,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-surface border border-border rounded-xl p-5 relative group"
                                >
                                    <div className="absolute top-4 right-4">
                                        <CopyIcon
                                            text={item.value}
                                            label={item.label}
                                        />
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase mb-2 font-bold">
                                        {item.label}
                                    </p>
                                    <p className="text-text-primary pr-8 leading-relaxed">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* G) TWITTER THREAD */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.twitterThread && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="twitterThread">
                            Twitter Thread
                        </SectionLabel>
                        <div className="space-y-4">
                            {kit?.twitterThread?.map((tweet, i) => (
                                <div
                                    key={i}
                                    className="bg-surface border border-border rounded-xl p-5 relative group"
                                >
                                    <div className="absolute top-4 right-4">
                                        <CopyIcon
                                            text={tweet}
                                            label={`Tweet ${i + 1}`}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <p className="text-text-primary pr-8 text-sm leading-relaxed">
                                        {tweet}
                                    </p>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={copyAllTweets}
                                className="w-full border-dashed border-border hover:border-primary/50 text-text-secondary hover:text-text-primary h-11 font-semibold"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy All Tweets
                            </Button>
                        </div>
                    </section>

                    {/* NEW: SOCIAL BIOS */}
                    {kit?.socialBios && typeof kit.socialBios === 'object' && (
                        <section
                            className={cn(
                                "transition-opacity",
                                refreshingBlocks.socialBios && "opacity-50",
                            )}
                        >
                            <SectionLabel blockKey="socialBios">
                                Social Media Bios
                            </SectionLabel>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    {
                                        label: "Instagram",
                                        value: kit.socialBios?.instagram,
                                        icon: FaInstagram,
                                    },
                                    {
                                        label: "TikTok",
                                        value: kit.socialBios?.tiktok,
                                        icon: FaTiktok,
                                    },
                                    {
                                        label: "Twitter / X",
                                        value: kit.socialBios?.twitter,
                                        icon: FaXTwitter,
                                    },
                                ].map((bio, i) => (
                                    <div
                                        key={i}
                                        className="bg-surface border border-border rounded-xl p-5 relative group flex flex-col"
                                    >
                                        <div className="absolute top-4 right-4">
                                            <CopyIcon
                                                text={bio.value}
                                                label={`${bio.label} bio`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <bio.icon className="w-4 h-4 text-primary" />
                                            <p className="text-[10px] text-text-muted uppercase font-bold">
                                                {bio.label}
                                            </p>
                                        </div>
                                        <p className="text-sm text-text-primary leading-relaxed pr-6 flex-grow">
                                            {bio.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* H) PRODUCT HUNT */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.productHunt && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="productHunt">
                            Product Launch
                        </SectionLabel>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-surface border border-border rounded-xl p-5 relative group">
                                <div className="absolute top-4 right-4">
                                    <CopyIcon
                                        text={
                                            kit?.productHunt?.tagline ||
                                            kit?.productHuntDesc?.tagline
                                        }
                                        label="PH tagline"
                                    />
                                </div>
                                <p className="text-[10px] text-text-muted uppercase mb-2 font-bold">
                                    Launch Tagline
                                </p>
                                <p className="text-text-primary pr-8 font-bold">
                                    {kit?.productHunt?.tagline ||
                                        kit?.productHuntDesc?.tagline}
                                </p>
                            </div>
                            <div className="bg-surface border border-border rounded-xl p-5 relative group">
                                <div className="absolute top-4 right-4">
                                    <CopyIcon
                                        text={
                                            kit?.productHunt?.description ||
                                            kit?.productHuntDesc?.description
                                        }
                                        label="PH description"
                                    />
                                </div>
                                <p className="text-[10px] text-text-muted uppercase mb-2 font-bold">
                                    Launch Description
                                </p>
                                <p className="text-text-primary pr-8 text-sm leading-relaxed">
                                    {kit?.productHunt?.description ||
                                        kit?.productHuntDesc?.description}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* I) PRICING TIERS */}
                    <section
                        className={cn(
                            "transition-opacity",
                            refreshingBlocks.pricingCopy && "opacity-50",
                        )}
                    >
                        <SectionLabel blockKey="pricingCopy">
                            Pricing Copy
                        </SectionLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                kit?.pricingCopy?.tier1,
                                kit?.pricingCopy?.tier2,
                                kit?.pricingCopy?.tier3,
                            ].map((tier, i) => (
                                <div
                                    key={i}
                                    className="bg-surface border border-border rounded-xl p-5 relative flex flex-col justify-center group min-h-[120px]"
                                >
                                    <div className="absolute top-4 right-4">
                                        <CopyIcon
                                            text={tier}
                                            label={`Tier ${i + 1}`}
                                        />
                                    </div>
                                    <p className="text-[10px] text-text-muted uppercase mb-3 font-bold">
                                        Tier {i + 1}
                                    </p>
                                    <p className="text-text-primary text-sm pr-6 leading-relaxed">
                                        {tier}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* NEW: MARKETING & SEO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {kit?.marketingStrategy && (
                            <section className={cn("transition-opacity", refreshingBlocks.marketingStrategy && "opacity-50")}>
                                <SectionLabel blockKey="marketingStrategy">Marketing Strategy</SectionLabel>
                                <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                                    {kit.marketingStrategy.map((strat, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-primary">{i+1}</span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed">{strat}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        {kit?.growthHacks && (
                            <section className={cn("transition-opacity", refreshingBlocks.growthHacks && "opacity-50")}>
                                <SectionLabel blockKey="growthHacks">Growth Hacks</SectionLabel>
                                <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                                    {kit.growthHacks.map((hack, i) => (
                                        <div key={i} className="flex gap-3">
                                            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <p className="text-sm text-text-secondary leading-relaxed">{hack}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {kit?.seoKeywords && (
                        <section className={cn("transition-opacity", refreshingBlocks.seoKeywords && "opacity-50")}>
                            <SectionLabel blockKey="seoKeywords">SEO Keywords</SectionLabel>
                            <div className="bg-surface border border-border rounded-xl p-6 flex flex-wrap gap-2">
                                {kit.seoKeywords.map((keyword, i) => (
                                    <Badge key={i} variant="outline" className="bg-surface-2 border-border text-text-secondary px-3 py-1">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {kit?.brandVoice && (
                        <section className={cn("transition-opacity", refreshingBlocks.brandVoice && "opacity-50")}>
                            <SectionLabel blockKey="brandVoice">Brand Voice & Tone</SectionLabel>
                            <div className="bg-surface border border-border rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Tone</p>
                                        <p className="text-sm text-text-primary">{kit.brandVoice.tone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Style</p>
                                        <p className="text-sm text-text-primary">{kit.brandVoice.style}</p>
                                    </div>
                                </div>
                                <div className="bg-surface-2 rounded-lg p-4 border border-border/50 italic">
                                    <p className="text-[10px] text-text-muted uppercase font-bold mb-2 not-italic">Example</p>
                                    <p className="text-sm text-text-secondary">"{kit.brandVoice.example}"</p>
                                </div>
                            </div>
                        </section>
                    )}

                    <Separator className="bg-border/50" />

                    <div className="flex flex-col gap-3 pt-4">
                        {kit.isPublic && (
                            <Button
                                onClick={handleShare}
                                className="w-full bg-primary hover:bg-primary-hover text-white h-12 font-bold touch-target-mobile"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Kit
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            asChild
                            className="w-full border-border hover:bg-surface-2 text-text-primary h-12 font-semibold touch-target-mobile"
                        >
                            <Link href="/">Generate another kit</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="lg:sticky lg:top-20 space-y-4">
                        <div className="bg-[#111111] border border-[#1F2937] rounded-xl p-6 space-y-6 overflow-hidden relative">
                            <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-[0.03] pointer-events-none rotate-12">
                                <Image
                                    src="/logo.svg"
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-text-secondary">
                                        <Eye className="w-4 h-4 mr-2 text-text-muted" />
                                        Views
                                    </span>
                                    <span className="font-mono text-text-primary font-bold">
                                        {kit.views}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-text-secondary">
                                        <Calendar className="w-4 h-4 mr-2 text-text-muted" />
                                        Created
                                    </span>
                                    <span className="text-text-primary font-medium">
                                        {new Date(
                                            kit.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <Separator className="bg-[#1F2937]" />

                            <div className="space-y-3 relative z-10">
                                <Button
                                    onClick={handleDownloadPDF}
                                    disabled={isExporting}
                                    className="w-full bg-surface-2 hover:bg-surface-3 border border-border text-text-primary h-11 gap-2 font-bold touch-target-mobile"
                                >
                                    {isExporting ? (
                                        <RefreshCcw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {isExporting ? "Generating..." : "Download PDF"}
                                </Button>
                                <p className="text-[10px] text-text-muted text-center font-medium">
                                    Export this brand kit as a professional PDF
                                </p>
                            </div>

                            <Separator className="bg-[#1F2937]" />

                            <div className="space-y-4 relative z-10">
                                {kit.isPublic ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-[#14532D] text-[#4ADE80] border-none px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold text-[10px]">
                                                <Globe className="w-3 h-3" />
                                                PUBLISHED
                                            </Badge>
                                        </div>
                                        <div className="bg-surface-2 border border-border rounded-lg p-3 flex items-center justify-between group">
                                            <span className="text-[10px] font-mono text-text-secondary truncate pr-2">
                                                {typeof window !== "undefined"
                                                    ? `${window.location.origin}/kit/${kit.slug}`
                                                    : `/kit/${kit.slug}`}
                                            </span>
                                            <CopyIcon
                                                text={
                                                    typeof window !==
                                                    "undefined"
                                                        ? `${window.location.origin}/kit/${kit.slug}`
                                                        : ""
                                                }
                                                label="Share link"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleShare}
                                            className="w-full border-border hover:bg-surface-2 text-text-primary h-10 gap-2 font-semibold touch-target-mobile"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share Kit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {isOwner ? (
                                            <>
                                                <Button
                                                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-11 touch-target-mobile"
                                                    onClick={handlePublish}
                                                    disabled={isPublishing}
                                                >
                                                    {isPublishing
                                                        ? "Publishing..."
                                                        : "Publish to Gallery"}
                                                </Button>
                                                <p className="text-[10px] text-text-muted text-center font-medium">
                                                    Make this kit visible to
                                                    everyone in the gallery
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
                                <div className="space-y-3 relative z-10">
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="w-full border-border hover:bg-surface-2 text-text-primary h-10 font-semibold touch-target-mobile"
                                    >
                                        <Link href="/signup">
                                            Save this kit
                                        </Link>
                                    </Button>
                                    <p className="text-[10px] text-text-muted text-center font-medium">
                                        Free account required to save kits
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-2 relative z-10">
                                    {isOwner ? (
                                        <p className="text-xs text-[#4ADE80] font-bold flex items-center justify-center gap-1.5">
                                            <Check className="w-4 h-4" />
                                            Saved to your dashboard
                                        </p>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            className="w-full border-border hover:bg-surface-2 text-text-primary h-10 font-semibold touch-target-mobile"
                                        >
                                            Save to my kits
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        <Button
                            variant="link"
                            asChild
                            className="w-full text-text-muted hover:text-text-primary text-xs font-medium"
                        >
                            <Link href="/">← Generate another kit</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
