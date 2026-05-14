'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Package, Menu, X, Globe } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { siteConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isLocal: boolean;
  onToggleLocale: () => void;
}

export function Header({ isLocal, onToggleLocale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { getItemCount } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition-colors">
              Cart
            </Link>
            <Link href="/tracking" className="text-gray-700 hover:text-primary-600 transition-colors">
              Track Order
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Locale Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLocale}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span>{isLocal ? 'NGN' : 'USD'}</span>
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <Link href="/account">
                <Button variant="ghost" size="sm" icon={User}>
                  {user?.full_name?.split(' ')[0] || 'Account'}
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm" icon={User}>
                  Sign In
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
              </Link>
              <Link
                href="/tracking"
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}