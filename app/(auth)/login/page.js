import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Sign In - KitMint',
  description: 'Sign in to your KitMint account',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
