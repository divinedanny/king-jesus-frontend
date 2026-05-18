'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EcommerceLayout } from '@/components/layout/ecommerce-layout';
import { POSLayout } from '@/components/layout/pos-layout';
import { AdminLayout } from '@/components/layout/admin-layout';
import { useAuthStore } from '@/lib/auth-store';

interface RootProviderProps {
  children: React.ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-pulse text-primary-500 font-bold">Loading...</div>
      </div>
    );
  }

  // Determine which layout shell to use based on the pathname
  if (pathname?.startsWith('/pos')) {
    return <POSLayout>{children}</POSLayout>;
  }

  if (pathname?.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Default to E-commerce layout
  return <EcommerceLayout>{children}</EcommerceLayout>;
}
