'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Eye, Globe, Lock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import KitCard from './KitCard';
import EmptyState from '@/components/shared/EmptyState';

export default function DashboardClient({ kits: initialKits, user }) {
  const [kits, setKits] = useState(initialKits);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const used = user.kitsGeneratedThisMonth || 0;
  const limit = 3;
  const progress = (used / limit) * 100;

  const handleDelete = async () => {
    if (!deleteSlug) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kit/${deleteSlug}`, { method: 'DELETE' });
      if (res.ok) {
        setKits(kits.filter(k => k.slug !== deleteSlug));
        toast.success('Kit deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting kit');
    } finally {
      setIsDeleting(false);
      setDeleteSlug(null);
    }
  };

  const togglePublish = async (slug, currentState) => {
    try {
      const res = await fetch('/api/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'publish' }), // The API currently only supports 'publish'
      });
      
      if (res.ok) {
        setKits(kits.map(k => k.slug === slug ? { ...k, isPublic: !currentState } : k));
        toast.success(currentState ? 'Kit unpublished' : 'Kit published to gallery!');
      }
    } catch (error) {
      toast.error('Error updating kit status');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Your Kits</h1>
          <p className="text-text-secondary mt-1">Manage your brand identities</p>
        </div>
        
        <Button asChild className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 h-11 px-6">
          <Link href="/">
            <Plus className="w-4 h-4 mr-2" />
            New Kit
          </Link>
        </Button>
      </div>

      {/* Usage Bar */}
      {user.plan === 'free' && (
        <div className="max-w-md bg-surface border border-border rounded-xl p-6 space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-sm font-medium text-text-primary">
              {used} / {limit} kits used this month
            </p>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Free Plan</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-[#1F2937]" />
          {used >= limit && (
            <p className="text-xs text-primary-text font-medium animate-pulse">
              Upgrade to Pro for unlimited kits
            </p>
          )}
        </div>
      )}

      {/* Grid */}
      {kits.length === 0 ? (
        <EmptyState 
          icon={Plus}
          title="No kits yet"
          description="You haven't generated any brand kits. Start by describing your idea!"
          actionLabel="Generate your first kit"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kits.map((kit) => (
            <div key={kit._id} className="relative group">
              <KitCard kit={kit} />
              
              {/* Dropdown Menu Overlay */}
              <div className="absolute top-4 right-4 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 text-white rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-surface border-border">
                    <DropdownMenuItem asChild>
                      <Link href={`/kit/${kit.slug}`} className="cursor-pointer flex items-center">
                        <Eye className="w-4 h-4 mr-2" /> View Kit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => togglePublish(kit.slug, kit.isPublic)}
                      className="cursor-pointer"
                    >
                      {kit.isPublic ? (
                        <><Lock className="w-4 h-4 mr-2" /> Unpublish</>
                      ) : (
                        <><Globe className="w-4 h-4 mr-2" /> Publish</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      onClick={() => setDeleteSlug(kit.slug)}
                      className="cursor-pointer text-error focus:text-error focus:bg-error/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent className="bg-surface border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              This action cannot be undone. This will permanently delete your brand kit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-surface-2 border-border text-text-primary hover:bg-surface-3">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-error hover:bg-error/90 text-white border-none"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Kit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
