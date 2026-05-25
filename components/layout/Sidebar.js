'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutGrid, GalleryVertical, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Gallery', href: '/gallery', icon: GalleryVertical },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const adminItems = [
  { label: 'Admin Panel', href: '/admin/users', icon: ShieldCheck },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <aside className="w-56 flex-shrink-0 bg-[#111111] border-r border-[#111827] h-full flex flex-col">
      {/* Top: Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7">
            <Image 
              src="/logo.svg" 
              alt="KitMint Logo" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-extrabold text-lg tracking-tight">Kit</span>
            <span className="text-[#4ADE80] font-extrabold text-lg tracking-tight">Mint</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1" />
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#F9FAFB] border-r-2 border-[#16A34A]'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A1A1A]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-[#111827]">
            <p className="px-3 mb-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Admin
            </p>
            {adminItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F9FAFB] border-r-2 border-[#16A34A]'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Bottom: User info */}
      <div className="p-4 border-t border-[#111827] space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-surface-2 text-text-primary text-xs">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1.5 py-0 h-4 capitalize font-medium",
                user.plan === 'pro' 
                  ? "bg-[#14532D] text-[#4ADE80] border-[#16A34A]/50 animate-unlimited-glow" 
                  : "bg-primary-muted text-primary-text border-primary/20"
              )}
            >
              {user.plan}
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full justify-start gap-3 text-text-muted hover:text-error hover:bg-error/10 h-9 px-3"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
