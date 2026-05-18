'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  MoreVertical, 
  Filter,
  Download,
  Calendar,
  ChevronRight,
  Package,
  User,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { apiConfig } from '@/lib/config';
import { formatCurrency } from '@/lib/config';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, we would use ordersApi.getAll()
      const response = await fetch(`${apiConfig.baseUrl}/api/orders/`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
         }
      });
      const data = await response.json();
      setOrders(data.results || data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Order Fulfillment</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Order <span className="text-gray-300">Management</span></h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest h-12 px-6" icon={Download}>Export Orders</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by Order ID or Customer..." 
            className="pl-12 h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 bg-gray-50 border-none rounded-xl text-[10px] font-bold uppercase tracking-widest"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Source</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
               <tr><td colSpan={6} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">No orders found</td></tr>
            ) : filteredOrders.map((order, i) => (
              <tr key={i} className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <td className="px-8 py-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tight text-black">#{order.id.slice(0, 8)}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight text-black">{order.user?.full_name || 'Guest Customer'}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{order.shipping_address?.email || 'No email'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {order.order_source === 'POS' ? (
                       <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          <Package className="w-3 h-3" />
                          POS Retail
                       </div>
                    ) : (
                       <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          <Globe className="w-3 h-3" />
                          Web Store
                       </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    order.status === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' :
                    order.status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    order.status === 'Delivered' ? 'bg-purple-50 border-purple-200 text-purple-700' :
                    'bg-gray-50 border-gray-200 text-gray-700'
                  }`}>
                    {order.status}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-[11px] font-black text-black">{formatCurrency(order.total_amount, order.currency)}</span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex justify-end gap-2">
                      <button className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all">
                         <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-50 rounded-lg hover:bg-black hover:text-primary-500 transition-all">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
