'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig, whatsappConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
              {siteConfig.name}
            </h3>
            <p className="text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary-500 transition-colors">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary-500 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-primary-500 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-primary-500 transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">Support</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary-500" />
                <span>+{whatsappConfig.phoneNumber}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary-500" />
                <span>support@kingjesuscollection.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary-500 mt-0.5" />
                <span>Mon-Fri: 9AM - 6PM WAT</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8">Visit</h4>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary-500 mt-0.5" />
              <span>Lagos, Nigeria</span>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-gray-600">
                Fulfillment by Terminal Africa
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} {siteConfig.name}. Premium Faithwear.
            </p>
            <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
