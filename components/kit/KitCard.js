'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Type } from 'lucide-react';

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
    <Link href={`/kit/${kit.slug}`} className="group">
      <div className="relative rounded-md overflow-hidden border border-[#1F2937] bg-[#111111] hover:bg-[#1A1A1A] hover:border-[#16A34A]/30 transition-colors duration-150 h-full flex flex-col">
        
        {/* Color bar */}
        <div className="flex h-2 w-full">
          {kit.colors.map((color, i) => (
            <div 
              key={i} 
              className="flex-1 h-full" 
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-[#F9FAFB] truncate pr-2">
              {brandName}
            </h3>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 bg-surface-2 border-border text-text-muted capitalize">
              {kit.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>

          <p className="text-sm text-[#9CA3AF] line-clamp-2 mb-4 flex-1">
            {kit.tagline}
          </p>

          <div className="mt-auto space-y-2">
            <div className="flex justify-between items-center text-[10px] text-[#6B7280]">
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <Type className="w-3 h-3" />
                {kit.fonts.heading} / {kit.fonts.body}
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <Eye className="w-3 h-3" />
                {kit.views}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
              <Clock className="w-3 h-3" />
              {timeAgo(kit.createdAt)}
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span className="text-white font-bold text-sm">View Kit →</span>
        </div>
      </div>
    </Link>
  );
}
