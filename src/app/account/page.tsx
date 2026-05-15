'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { ordersApi, authApi } from '@/lib/api';
import { formatCurrency } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Order } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await ordersApi.getAll();
      if (Array.isArray(data)) {
        setOrders(data);
      } else if ((data as any).results) {
        setOrders((data as any).results);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (authLoading || (isLoading && isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-bold mb-4">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
                  <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                    icon={LogOut}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 bg-white shadow-sm" icon={Package}>
                My Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3" icon={MapPin}>
                Addresses
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3" icon={User}>
                Profile Settings
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:border-primary-300 transition-colors cursor-pointer" onClick={() => router.push(`/tracking?number=${order.tracking_number}`)}>
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-mono font-medium">#{order.id.slice(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'paid' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-bold text-primary-600">{formatCurrency(order.total_amount, order.currency)}</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                          <div className="flex -space-x-2 overflow-hidden">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px]">
                                📦
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-medium">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-primary-600 font-medium">
                            {order.tracking_number ? 'Track Shipment' : 'View Details'}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your history!</p>
                  <Button onClick={() => router.push('/products')}>Browse Products</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
