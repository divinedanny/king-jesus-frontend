'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Globe } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { siteConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isLocal: boolean;
  onToggleLocale: () => void;
}

export function Header({ isLocal, onToggleLocale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-black shadow-lg border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent uppercase tracking-tighter">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold">
            <Link href="/products" className="text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest">
              Catalog
            </Link>
            <Link href="/tracking" className="text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest">
              Orders
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Locale Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLocale}
              className="flex items-center gap-2 text-gray-400 hover:text-primary-500 hover:bg-white/5 h-8"
            >
              <Globe className="h-4 w-4" />
              <span className="text-[10px] font-bold">{isLocal ? 'NGN' : 'USD'}</span>
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <Link href="/account">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary-500 hover:bg-white/5 h-8">
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider">
                    {user?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary-500 hover:bg-white/5 h-8">
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-primary-500 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-black text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-black">
                  {itemCount > 9 ? '9' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-primary-500"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5 bg-black">
            <div className="flex flex-col gap-4 px-2">
              <Link
                href="/products"
                className="text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest text-[11px] font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link
                href="/tracking"
                className="text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest text-[11px] font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/cart"
                className="text-gray-400 hover:text-primary-500 transition-colors uppercase tracking-widest text-[11px] font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart ({itemCount})
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
