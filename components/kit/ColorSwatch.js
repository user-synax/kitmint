'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ColorSwatch({ colors }) {
  const [copiedHex, setCopiedHex] = useState(null);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Color bar */}
      <div className="flex h-12 w-full rounded-lg overflow-hidden border border-border">
        {colors.map((color, i) => (
          <div 
            key={i} 
            className="flex-1 h-full" 
            style={{ backgroundColor: color.hex }}
            title={`${color.role}: ${color.hex}`}
          />
        ))}
      </div>

      {/* Detail tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {colors.map((color, i) => (
          <div key={i} className="bg-surface border border-border rounded-md p-3 flex flex-col items-center text-center">
            <div 
              className="w-8 h-8 rounded-full mb-2 border border-white/10" 
              style={{ backgroundColor: color.hex }}
            />
            <div 
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => copyToClipboard(color.hex)}
            >
              <span className="font-mono text-xs text-text-primary">{color.hex}</span>
              {copiedHex === color.hex ? (
                <Check className="w-3 h-3 text-primary-text" />
              ) : (
                <Copy className="w-3 h-3 text-text-muted group-hover:text-text-primary transition-colors" />
              )}
            </div>
            <span className="text-[10px] text-text-secondary mt-1 font-medium truncate w-full">
              {color.name}
            </span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
              {color.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
