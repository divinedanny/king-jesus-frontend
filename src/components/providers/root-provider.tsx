'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCartStore } from '@/lib/store';
import { siteConfig } from '@/lib/config';

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  const [isLocal, setIsLocal] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { setCurrency } = useCartStore();

  useEffect(() => {
    setMounted(true);
    // Check stored preference
    const storedLocale = localStorage.getItem('king-jesus-locale');
    if (storedLocale) {
      setIsLocal(storedLocale === 'local');
    }
  }, []);

  const handleToggleLocale = () => {
    const newIsLocal = !isLocal;
    setIsLocal(newIsLocal);
    localStorage.setItem('king-jesus-locale', newIsLocal ? 'local' : 'international');
    setCurrency(newIsLocal ? 'NGN' : 'USD');
  };

  useEffect(() => {
    if (mounted) {
      const baseTitle = siteConfig.name;
      document.title = isLocal ? `🇳🇬 ${baseTitle}` : `🌍 ${baseTitle}`;
    }
  }, [isLocal, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Header isLocal={isLocal} onToggleLocale={handleToggleLocale} />
      <main className="min-h-screen">
        <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
