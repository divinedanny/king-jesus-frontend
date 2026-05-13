'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCartStore } from '@/lib/store';

interface LocaleProviderProps {
  children: React.ReactNode;
  isLocal: boolean;
  onToggleLocale: () => void;
}

function LocaleProvider({ children, isLocal, onToggleLocale }: LocaleProviderProps) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Update the document title based on locale
    const baseTitle = 'King Jesus Collection';
    document.title = isLocal ? `🇳🇬 ${baseTitle}` : `🌍 ${baseTitle}`;
  }, [isLocal]);

  return (
    <>
      <Header isLocal={isLocal} onToggleLocale={onToggleLocale} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-primary-600">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="antialiased">
        <LocaleProvider isLocal={isLocal} onToggleLocale={handleToggleLocale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}