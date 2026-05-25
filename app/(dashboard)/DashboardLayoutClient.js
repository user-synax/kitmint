'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children, session }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar user={session.user} />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-64 bg-[#111111] border-[#111827]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access your dashboard, gallery and settings</SheetDescription>
            <Sidebar 
              user={session.user} 
              isMobile={true} 
              onLinkClick={() => setOpen(false)} 
            />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#111827] z-30">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(true)}
            className="text-[#9CA3AF] hover:text-[#F9FAFB]"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Open menu</span>
          </Button>
          
          <div className="flex items-center gap-1">
            <span className="text-primary font-extrabold text-lg tracking-tight">Kit</span>
            <span className="text-[#4ADE80] font-extrabold text-lg tracking-tight">Mint</span>
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
