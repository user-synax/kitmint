'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu, LayoutGrid, Settings, LogOut, Home } from 'lucide-react';
import Image from 'next/image';

const NavLinks = ({ className, activePath }) => (
  <div className={className}>
    <Link 
      href="/gallery" 
      className={`text-sm transition-colors duration-150 ${
        activePath === '/gallery' ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      Gallery
    </Link>
  </div>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoading = status === 'loading';

  return (
    <nav className="sticky top-0 z-50 h-14 w-full bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#111827]">
      <div className="max-w-[1200px] mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo.svg" 
                alt="KitMint Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-primary font-extrabold text-xl tracking-tight">Kit</span>
              <span className="text-[#4ADE80] font-extrabold text-xl tracking-tight">Mint</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1" />
            </div>
          </Link>

          <NavLinks className="hidden md:flex items-center gap-6" activePath={pathname} />
        </div>

        <div className="flex items-center gap-4">
          {!session ? (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild className="text-text-secondary hover:text-text-primary hover:bg-surface-2">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary-hover text-white px-6" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              {session.user.plan === 'free' ? (
                <Badge variant="outline" className="bg-primary-muted text-primary-text border-primary/20 font-medium">
                  {Math.max(0, 3 - (session.user.kitsGeneratedThisMonth || 0))} kits left
                </Badge>
              ) : (
                <Badge 
                  variant="outline" 
                  className="bg-[#14532D] text-[#4ADE80] border-[#16A34A]/50 font-bold animate-unlimited-glow px-3"
                >
                  Unlimited Kits
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={session.user.image} alt={session.user.name} />
                      <AvatarFallback className="bg-surface-2 text-text-primary">
                        {session.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-surface border-border">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-surface-2">
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-surface-2">
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-error hover:bg-error/10 focus:bg-error/10" 
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-text-primary">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border w-[280px] p-6">
                <SheetTitle className="text-text-primary flex items-center gap-2 mb-8">
                  <span className="text-primary font-bold">Kit</span>Mint
                </SheetTitle>
                <SheetDescription className="sr-only">Navigation menu</SheetDescription>
                
                <div className="flex flex-col gap-6">
                  <Link href="/" className={`flex items-center gap-3 text-sm ${pathname === '/' ? 'text-primary' : 'text-text-secondary'}`}>
                    <Home className="w-4 h-4" /> Home
                  </Link>
                  <Link href="/gallery" className={`flex items-center gap-3 text-sm ${pathname === '/gallery' ? 'text-primary' : 'text-text-secondary'}`}>
                    <LayoutGrid className="w-4 h-4" /> Gallery
                  </Link>
                  
                  <div className="h-px bg-border my-2" />
                  
                  {session ? (
                    <>
                      <Link href="/dashboard" className={`flex items-center gap-3 text-sm ${pathname === '/dashboard' ? 'text-primary' : 'text-text-secondary'}`}>
                        <LayoutGrid className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/settings" className={`flex items-center gap-3 text-sm ${pathname === '/settings' ? 'text-primary' : 'text-text-secondary'}`}>
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button onClick={() => signOut()} className="flex items-center gap-3 text-sm text-error text-left">
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 pt-2">
                      <Button variant="outline" asChild className="w-full bg-surface-2 border-border">
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white">
                        <Link href="/signup">Get started</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
