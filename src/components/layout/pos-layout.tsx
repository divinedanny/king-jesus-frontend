'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { siteConfig } from '../../lib/config';
import { Monitor, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface POSLayoutProps {
  children: React.ReactNode;
}

export function POSLayout({ children }: POSLayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = `POS | ${siteConfig.name}`;
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* POS Top Bar */}
      <header className="h-14 border-b border-white/10 bg-black flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center text-black font-bold">
              K
            </div>
            <span className="font-bold tracking-tight hidden sm:inline-block uppercase">
              POS System
            </span>
          </div>
          <div className="h-4 w-px bg-white/20 mx-2" />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline-block">Main Branch</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium leading-none">{user?.full_name || 'Staff'}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Attendant</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 border border-primary-500/50">
              <User className="w-4 h-4" />
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* POS Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
