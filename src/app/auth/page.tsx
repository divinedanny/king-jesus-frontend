'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Globe, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { useAuthStore } from '@/lib/auth-store';
import { siteConfig } from '../../lib/config';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, isLoading, error } = useAuthStore();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleGoogleLogin = async () => {
    // In a real app, this would redirect to Google or use a library
    // For this implementation, we simulate receiving a token
    try {
      // Mock token for simulation
      await loginWithGoogle('mock-google-token');
      router.push(callbackUrl);
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(callbackUrl);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Branding Side */}
      <div className="hidden md:flex flex-1 bg-black relative p-16 flex-col justify-between">
         <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
         
         <div className="relative z-10">
            <h1 className="text-4xl font-black text-primary-500 tracking-tighter uppercase">{siteConfig.name}</h1>
         </div>

         <div className="relative z-10 space-y-12">
            <div className="space-y-4">
               <h2 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">Join the <br /><span className="text-primary-500">Community.</span></h2>
               <p className="text-gray-400 text-lg max-w-sm uppercase tracking-wide font-medium">Premium faith-based apparel for the modern world.</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-3">
                  <ShieldCheck className="w-8 h-8 text-primary-500" />
                  <p className="text-xs font-black text-white uppercase tracking-widest">Secure Access</p>
               </div>
               <div className="space-y-3">
                  <Globe className="w-8 h-8 text-primary-500" />
                  <p className="text-xs font-black text-white uppercase tracking-widest">Global Reach</p>
               </div>
            </div>
         </div>
         
         <div className="relative z-10 text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">
            © {new Date().getFullYear()} {siteConfig.name} Portal. All Rights Reserved.
         </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-12">
          <div className="md:hidden text-center space-y-4">
             <h1 className="text-2xl font-black text-black tracking-tighter uppercase">{siteConfig.name}</h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-black tracking-tighter uppercase">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{isLogin ? 'Welcome back to the collection' : 'Become a member of our faith community'}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
               <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">!</div>
               <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <Button
              variant="black"
              size="lg"
              onClick={handleGoogleLogin}
              isLoading={isLoading}
              className="w-full h-14 rounded-xl text-[10px] font-black uppercase tracking-widest gap-4"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest">
                <span className="px-4 bg-white text-gray-400">or use email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {!isLogin && (
                  <Input
                    placeholder="FULL NAME"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6"
                  />
                )}
                <Input
                  placeholder="EMAIL ADDRESS"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6"
                />
                <Input
                  placeholder="PASSWORD"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6"
                />
              </div>

              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary-500/10">
                {isLogin ? 'Enter The Collection' : 'Create Member Account'}
              </Button>
            </form>

            <div className="text-center pt-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {isLogin ? "Don't have an account?" : 'Already a member?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-black hover:text-primary-500 transition-colors ml-1"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
