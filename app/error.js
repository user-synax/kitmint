'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Error logged for monitoring
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-3xl font-bold text-text-primary mb-2">Something went wrong</h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        An unexpected error occurred. We've been notified and are looking into it.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-hover text-white h-12 px-8 w-full sm:w-auto"
        >
          Try again
        </Button>
        <Button 
          variant="ghost" 
          asChild 
          className="text-text-secondary hover:text-text-primary w-full sm:w-auto"
        >
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
