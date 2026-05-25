'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KitCard({ kit }) {
  const brandName = kit.brandNames[0]?.name || 'Kit';
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  return (
    <Link href={`/kit/${kit.slug}`} className="group block h-full">
      <div className="relative rounded-xl overflow-hidden border border-[#1F2937] bg-[#111111] hover:bg-[#1A1A1A] hover:border-[#16A34A]/40 transition-all duration-300 h-full flex flex-col group-hover:shadow-xl group-hover:shadow-primary/5">
        
        {/* Color bar */}
        <div className="flex h-2.5 w-full">
          {kit.colors.map((color, i) => (
            <div 
              key={i} 
              className="flex-1 h-full" 
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-[#F9FAFB] truncate pr-8 group-hover:text-primary transition-colors">
              {brandName}
            </h3>
            <Badge variant="outline" className={cn(
              "text-[10px] py-0 px-2 h-5 border-border text-text-muted capitalize font-semibold",
              kit.isPublic ? "bg-green-500/5 text-green-400 border-green-500/20" : "bg-surface-2"
            )}>
              {kit.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>

          <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-6 flex-1 leading-relaxed">
            {kit.tagline}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
            <div className="flex justify-between items-center text-[11px] text-[#6B7280] font-medium">
              <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                <Type className="w-3.5 h-3.5 text-primary/70" />
                <span className="truncate">{kit.fonts.heading}</span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <Eye className="w-3.5 h-3.5 text-blue-400/70" />
                {kit.views}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-medium">
              <Clock className="w-3.5 h-3.5 text-text-muted/70" />
              {timeAgo(kit.createdAt)}
            </div>
          </div>
        </div>

        {/* Desktop-only Hover overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex pointer-events-none">
          <div className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Kit →
          </div>
        </div>
      </div>
    </Link>
  );
}
