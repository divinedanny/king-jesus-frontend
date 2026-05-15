'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { siteConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function AuthPage() {
  const router = useRouter();
  const { setUser, setLoading, isLoading, error, loginWithGoogle } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleResponse = useCallback(async (response: { credential?: string }) => {
    if (response.credential) {
      await loginWithGoogle(response.credential);
      router.push('/');
    }
  }, [loginWithGoogle, router]);

  useEffect(() => {
    // Initialize Google Identity Services
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    }
  }, [handleGoogleResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call for demo - in production this would call the backend
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock user response
    const mockUser = {
      id: 'user-123',
      email: formData.email,
      full_name: isLogin ? 'Returning User' : formData.full_name,
      is_staff: false,
      date_joined: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setIsSubmitting(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <div className="p-6 border-b border-gray-100 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? `Sign in to your ${siteConfig.name} account`
                : `Join the ${siteConfig.name} community`}
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Google Auth Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (window.google) {
                  window.google.accounts.id.prompt();
                }
              }}
              isLoading={isLoading}
              className="w-full"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  error={errors.full_name}
                  placeholder="John Doe"
                />
              )}
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="you@example.com"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                placeholder="••••••••"
              />

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-6 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}