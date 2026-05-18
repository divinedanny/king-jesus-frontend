'use client';

import React from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Store as StoreIcon,
  User,
  Smartphone,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">System Configuration</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Control <span className="text-gray-300">Settings</span></h1>
        </div>
        <Button variant="black" className="text-[10px] uppercase font-black tracking-widest h-12 px-8" icon={Save}>Save Changes</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm rounded-[40px] bg-white overflow-hidden">
               <CardHeader className="p-10 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-black text-primary-500 flex items-center justify-center">
                        <Globe className="w-6 h-6" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Store Identity</CardTitle>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">General branding and public info</p>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Store Name</label>
                        <Input defaultValue="King Jesus Collection" className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Support Email</label>
                        <Input defaultValue="support@kingjesus.com" className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">WhatsApp Contact</label>
                     <Input defaultValue="+234 704 949 7394" className="h-14 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest pl-6" />
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-[40px] bg-white overflow-hidden">
               <CardHeader className="p-10 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-black text-primary-500 flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                     </div>
                     <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Payments & Checkout</CardTitle>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Gateway configurations</p>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-10 space-y-8">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <span className="text-[10px] font-black text-blue-600">PS</span>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest">Paystack (Local)</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Enabled for NGN Transactions</p>
                        </div>
                     </div>
                     <div className="h-6 w-12 bg-primary-500 rounded-full flex items-center justify-end p-1 cursor-pointer">
                        <div className="h-4 w-4 bg-black rounded-full" />
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <span className="text-[10px] font-black text-indigo-600">ST</span>
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest">Stripe (International)</p>
                           <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Enabled for USD Transactions</p>
                        </div>
                     </div>
                     <div className="h-6 w-12 bg-primary-500 rounded-full flex items-center justify-end p-1 cursor-pointer">
                        <div className="h-4 w-4 bg-black rounded-full" />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[40px] bg-black text-white p-10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10 space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">Terminal Africa <br />Integration</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Your shipping engine is active. All web orders are automatically synced for fulfillment.</p>
                  <div className="pt-4 flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-widest">API Connection: Live</span>
                  </div>
               </div>
            </Card>

            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-black">System Access</h3>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-primary-500 transition-all">
                        <Shield className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Permissions</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-primary-500 transition-all">
                        <Bell className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Notifications</span>
                  </div>
                  <div className="flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-primary-500 transition-all">
                        <Smartphone className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">POS Devices</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
