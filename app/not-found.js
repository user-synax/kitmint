import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center">
      <h1 className="text-[120px] font-extrabold text-[#4ADE80] leading-none mb-4">404</h1>
      <h2 className="text-3xl font-bold text-text-primary mb-2">Page not found</h2>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-primary hover:bg-primary-hover text-white h-12 px-8">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
