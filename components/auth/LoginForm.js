'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { validateEmail } from '@/lib/validation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const validateField = (name, value) => {
    let error = null;
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      if (!value) error = "Password is required";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = formData.password ? null : "Password is required";

    const newErrors = { email: emailError, password: passwordError };
    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result.error) {
        throw new Error('Invalid email or password');
      }

      toast.success('Welcome back!');
      router.push(callbackUrl);
      router.refresh();
    } catch (error) { 
      toast.error(error.message);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  if (status === 'loading' || status === 'authenticated') return null;

  const renderField = (name, label, type = 'text', placeholder = '') => {
    const error = errors[name];
    const isTouched = touched[name];
    const isValid = isTouched && !error && formData[name] !== '';
    const isInvalid = isTouched && error;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-medium text-text-secondary uppercase tracking-widest" htmlFor={name}>
            {label}
          </label>
          {isValid && <CheckCircle2 className="w-3 h-3 text-success" />}
        </div>
        <div className="relative">
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            value={formData[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            className={cn(
              "bg-surface-3 border-border focus:border-primary/50 h-11 transition-all duration-200",
              isInvalid && "border-error focus:border-error ring-error/20",
              isValid && "border-success focus:border-success ring-success/20",
              isInvalid && isShaking && "animate-shake"
            )}
            disabled={isLoading}
            aria-invalid={isInvalid ? "true" : "false"}
            aria-describedby={isInvalid ? `${name}-error` : undefined}
          />
          {isInvalid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-4 h-4 text-error" />
            </div>
          )}
        </div>
        {isInvalid && (
          <p id={`${name}-error`} className="text-[11px] text-error font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 group">
            <span className="text-primary font-extrabold text-2xl tracking-tight">Kit</span>
            <span className="text-[#4ADE80] font-extrabold text-2xl tracking-tight">Mint</span>
            <span className="w-2 h-2 rounded-full bg-[#16A34A] mt-1" />
          </Link>
        </div>

        <Card className="bg-[#111111] border-[#1F2937] rounded-lg p-2 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-text-primary">Welcome back</CardTitle>
            <CardDescription className="text-text-secondary">
              Enter your details to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Button 
              variant="outline" 
              className="w-full bg-surface-2 border-border hover:bg-surface-3 text-text-primary flex items-center justify-center gap-3 h-11"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative flex items-center justify-center">
              <Separator className="bg-border" />
              <span className="absolute bg-[#111111] px-3 text-[10px] text-text-muted uppercase tracking-widest">
                or
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {renderField('email', 'Email Address', 'email', 'name@example.com')}
              {renderField('password', 'Password', 'password', '••••••••')}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold h-11 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="w-full text-sm text-text-secondary text-center">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:text-primary-text font-semibold">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
