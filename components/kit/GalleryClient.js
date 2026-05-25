'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, LayoutGrid, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import KitCard from './KitCard';
import EmptyState from '@/components/shared/EmptyState';

const SkeletonCard = () => (
  <div className="rounded-md overflow-hidden border border-[#1F2937] bg-[#111111] h-[180px] flex flex-col animate-pulse">
    <div className="h-2 w-full bg-[#1A1A1A]" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-1/3 bg-[#1A1A1A] rounded" />
      <div className="h-3 w-full bg-[#1A1A1A] rounded" />
      <div className="h-3 w-2/3 bg-[#1A1A1A] rounded" />
      <div className="mt-auto flex justify-between">
        <div className="h-2 w-1/4 bg-[#1A1A1A] rounded" />
        <div className="h-2 w-1/4 bg-[#1A1A1A] rounded" />
      </div>
    </div>
  </div>
);

export default function GalleryClient({ initialKits, totalCount: initialTotalCount, totalPages: initialTotalPages }) {
  const [kits, setKits] = useState(initialKits);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch kits when page or debouncedSearch changes
  useEffect(() => {
    // Skip initial fetch if it's the first page and no search
    if (page === 1 && !debouncedSearch && kits === initialKits) return;

    const fetchKits = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/kit?page=${page}&limit=12&search=${encodeURIComponent(debouncedSearch)}`);
        const data = await res.json();
        if (res.ok) {
          setKits(data.kits);
          setTotalCount(data.totalCount);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch kits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKits();
  }, [page, debouncedSearch]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      gridRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      gridRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">Gallery</h1>
          <Badge variant="outline" className="bg-primary-muted text-primary-text border-primary/20 font-medium">
            {totalCount} kits published
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input 
          placeholder="Search kits..." 
          className="pl-10 bg-surface-3 border-border focus:border-primary/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : kits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {kits.map((kit) => (
              <KitCard key={kit._id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            {debouncedSearch ? (
              <EmptyState 
                icon={Search}
                title="No kits match your search"
                description={`We couldn't find any results for "${debouncedSearch}". Try a different keyword.`}
                actionLabel="Clear search"
                actionHref="#" // handled by onClick below but need to satisfy props
              />
            ) : (
              <EmptyState 
                icon={LayoutGrid}
                title="No kits published yet"
                description="Be the first to share your brand kit with the community!"
                actionLabel="Generate your first kit"
                actionHref="/"
              />
            )}
            {debouncedSearch && !kits.length && (
              <div className="mt-[-40px] flex justify-center">
                <Button variant="ghost" onClick={() => setSearch('')} className="text-primary hover:text-primary-text">
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-8">
          <Button 
            variant="ghost" 
            onClick={handlePrevPage} 
            disabled={page === 1 || isLoading}
            className="text-text-secondary hover:text-text-primary disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          
          <span className="text-sm text-text-muted font-medium">
            Page <span className="text-text-primary">{page}</span> of {totalPages}
          </span>

          <Button 
            variant="ghost" 
            onClick={handleNextPage} 
            disabled={page === totalPages || isLoading}
            className="text-text-secondary hover:text-text-primary disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
