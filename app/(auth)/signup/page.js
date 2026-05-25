import { Suspense } from 'react';
import SignupForm from '@/components/auth/SignupForm';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Sign Up - KitMint',
  description: 'Create your KitMint account',
};

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
