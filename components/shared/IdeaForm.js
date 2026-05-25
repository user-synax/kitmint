'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import LoadingSteps from './LoadingSteps';

const EXAMPLES = [
  "A meditation app for developers",
  "AI-powered recipe generator for students",
  "Marketplace for local freelancers"
];

export default function IdeaForm() {
  const { data: session, update } = useSession();
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('kitmint_visited');
    if (!hasVisited) {
      toast.info("You have 1 free kit — no account needed", {
        duration: 4000,
      });
      sessionStorage.setItem('kitmint_visited', 'true');
    }
  }, []);

  const maxLength = 280;
  const remainingChars = maxLength - idea.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim() || idea.trim().length < 10) {
      toast.error('Idea must be at least 10 characters');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'GUEST_LIMIT_REACHED') {
          toast.info('Create a free account to generate more kits');
          setTimeout(() => router.push('/signup'), 1500);
          return;
        }
        if (data.error === 'FREE_LIMIT_REACHED') {
          toast.error("You've used all 3 free kits this month");
          return;
        }
        throw new Error(data.error || 'Something went wrong');
      }

      // Sync the kit count in the session immediately
      if (session && data.updatedKitsCount !== undefined) {
        await update({
          kitsGeneratedThisMonth: data.updatedKitsCount
        });
      }

      toast.success('Kit generated successfully!');
      router.push(`/kit/${data.slug}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <LoadingSteps isGenerating={isGenerating} />
      
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className={`absolute -inset-1 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-1000 ${isGenerating ? '' : 'animate-multi-color-glow'}`}></div>
            <div className="relative">
              <Textarea
                placeholder="A platform for sustainable fashion swaps..."
                className="min-h-[140px] bg-surface-3 border-border focus:border-white/20 focus:ring-0 text-text-primary resize-none p-5 rounded-lg transition-all duration-300 placeholder:text-text-muted/50"
                value={idea}
                onChange={(e) => setIdea(e.target.value.slice(0, maxLength))}
                disabled={isGenerating}
              />
              <div className={`absolute bottom-3 right-3 text-[10px] font-mono tracking-widest ${remainingChars < 20 ? 'text-error' : 'text-text-muted'}`}>
                {remainingChars} / {maxLength}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setIdea(example)}
                className="text-[11px] bg-surface-2 border border-border hover:border-primary/50 text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full transition-all"
              >
                {example}
              </button>
            ))}
          </div>

          <Button 
            type="submit" 
            disabled={isGenerating || !idea.trim() || idea.trim().length < 10}
            className="w-full md:w-fit bg-primary hover:bg-primary-hover text-white h-14 px-10 text-lg my-5 font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_-5px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_0px_rgba(22,163,74,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </div>
            ) : (
              'Generate My Kit'
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-text-muted text-sm font-medium">
          No account needed for your first kit
        </p>
      </div>
    </>
  );
}
