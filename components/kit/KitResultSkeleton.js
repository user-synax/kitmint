import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/layout/Navbar";

export default function KitResultSkeleton() {
    return (
        <div className="min-h-screen bg-background animate-fade-in">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
                {/* Mobile Back Button Skeleton */}
                <div className="mb-6 lg:hidden">
                    <Skeleton className="h-10 w-32" />
                </div>

                {/* Free User Badge Skeleton */}
                <div className="mb-8 bg-surface-2 border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full sm:w-auto sm:w-40" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-12">
                    {/* Left Column - Main Content */}
                    <div className="space-y-12 bg-background p-4 sm:p-8 rounded-2xl">
                        {/* Idea Prompt Section */}
                        <section>
                            <Skeleton className="h-4 w-28 mb-3" />
                            <div className="border-l-2 border-border pl-4">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </section>

                        {/* Brand Names Section */}
                        <section>
                            <Skeleton className="h-4 w-28 mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Skeleton className="h-36 rounded-xl" />
                                <Skeleton className="h-36 rounded-xl" />
                            </div>
                        </section>

                        {/* Tagline Section */}
                        <section>
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-32 rounded-xl" />
                        </section>

                        {/* User Personas Section */}
                        <section>
                            <Skeleton className="h-4 w-32 mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-48 rounded-xl" />
                                <Skeleton className="h-48 rounded-xl" />
                            </div>
                        </section>

                        {/* Color Palette Section */}
                        <section>
                            <Skeleton className="h-4 w-32 mb-3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-24 w-24 rounded-lg" />
                                <Skeleton className="h-24 w-24 rounded-lg" />
                                <Skeleton className="h-24 w-24 rounded-lg" />
                                <Skeleton className="h-24 w-24 rounded-lg" />
                                <Skeleton className="h-24 w-24 rounded-lg" />
                            </div>
                        </section>

                        {/* Logo Prompts Section */}
                        <section>
                            <Skeleton className="h-4 w-40 mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-44 rounded-xl" />
                                <Skeleton className="h-44 rounded-xl" />
                            </div>
                        </section>

                        {/* Typography Section */}
                        <section>
                            <Skeleton className="h-4 w-28 mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Skeleton className="h-40 rounded-xl" />
                                <Skeleton className="h-40 rounded-xl" />
                            </div>
                        </section>

                        {/* Landing Page Copy Section */}
                        <section>
                            <Skeleton className="h-4 w-40 mb-3" />
                            <div className="space-y-4">
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                                <Skeleton className="h-32 rounded-xl" />
                            </div>
                        </section>

                        {/* Twitter Thread Section */}
                        <section>
                            <Skeleton className="h-4 w-32 mb-3" />
                            <div className="space-y-4">
                                <Skeleton className="h-40 rounded-xl" />
                                <Skeleton className="h-40 rounded-xl" />
                                <Skeleton className="h-40 rounded-xl" />
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="relative">
                        <div className="lg:sticky lg:top-20 space-y-4">
                            <Skeleton className="h-96 rounded-xl" />
                            <Skeleton className="h-48 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
