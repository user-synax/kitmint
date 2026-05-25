'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Eye, Globe, Lock, Trash2, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

export default function DashboardClient({ kits: initialKits, user }) {
  const [kits, setKits] = useState(initialKits);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
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
        body: JSON.stringify({ slug, action: 'publish' }),
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
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-8 md:space-y-10 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">Your Kits</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your brand identities</p>
        </div>
        
        <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 h-11 px-6 font-bold touch-target-mobile">
          <Link href="/">
            <Plus className="w-4 h-4 mr-2" />
            New Kit
          </Link>
        </Button>
      </div>

      {/* Stats/Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.plan === 'free' && (
          <div className="bg-surface border border-border rounded-xl p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Free Plan Usage</p>
                <p className="text-xl font-bold text-text-primary">
                  {used} <span className="text-sm font-normal text-text-secondary">/ {limit} kits</span>
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Monthly</Badge>
            </div>
            <Progress value={progress} className="h-2 bg-surface-3" />
            <p className="text-[11px] text-text-muted leading-relaxed">
              Resets on the 1st of every month. <Link href="/settings" className="text-primary hover:underline">Upgrade for unlimited</Link>
            </p>
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Total Views</p>
              <p className="text-2xl font-bold text-text-primary">
                {kits.reduce((acc, k) => acc + (k.views || 0), 0)}
              </p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-[11px] text-text-muted">Total reach across all your published kits</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Visibility</p>
              <p className="text-2xl font-bold text-text-primary">
                {kits.filter(k => k.isPublic).length} <span className="text-sm font-normal text-text-secondary">Public</span>
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-[11px] text-text-muted">Manage privacy settings in each kit</p>
        </div>
      </div>

      {/* Kits List/Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold text-text-primary">All Kits</h2>
          <div className="hidden sm:flex items-center bg-surface-2 p-1 rounded-lg border border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className={cn("h-8 w-8 p-0", viewMode === 'grid' && "bg-surface-3 text-primary")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('list')}
              className={cn("h-8 w-8 p-0", viewMode === 'list' && "bg-surface-3 text-primary")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {kits.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {kits.map((kit) => (
              <div key={kit._id} className="relative group">
                <KitCard kit={kit} />
                <div className="absolute top-3 right-3 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/80 border border-white/10 backdrop-blur-sm touch-target-mobile">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-surface border-border">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/kit/${kit.slug}`} className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View Kit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => togglePublish(kit.slug, kit.isPublic)}
                      >
                        {kit.isPublic ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Make Private
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 mr-2" />
                            Make Public
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        className="cursor-pointer text-error hover:text-error hover:bg-error/10"
                        onClick={() => setDeleteSlug(kit.slug)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Kit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No kits found"
            description="Start by creating your first brand kit."
            actionText="Generate New Kit"
            actionLink="/"
          />
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent className="bg-surface border-border max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-text-primary">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-text-secondary">
              This will permanently delete your brand kit and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="bg-surface-2 border-border text-text-primary hover:bg-surface-3 mt-0 touch-target-mobile">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-error hover:bg-error/90 text-white touch-target-mobile"
            >
              {isDeleting ? 'Deleting...' : 'Delete Kit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
