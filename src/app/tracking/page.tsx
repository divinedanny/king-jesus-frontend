'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, Badge } from '@/components/ui/card';
import { TrackingInfo, TrackingEvent } from '@/types';
import { trackingApi } from '@/lib/api';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'picked_up':
      return Package;
    case 'in_transit':
      return Truck;
    case 'delivered':
      return CheckCircle;
    case 'pending':
      return Clock;
    default:
      return MapPin;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'picked_up':
      return 'info';
    case 'in_transit':
      return 'warning';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState('');

  const performTrack = useCallback(async (number: string) => {
    if (!number.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await trackingApi.getStatus(number);
      
      if (response && response.data) {
        const data = response.data;
        const mappedData: TrackingInfo = {
          tracking_number: data.tracking_number || number,
          shipment_id: data.shipment_id || '',
          carrier: data.carrier_name || 'Terminal Africa',
          status: data.status || 'unknown',
          estimated_delivery: data.estimated_delivery_date,
          events: (data.events || []).map((event: any, index: number) => ({
            id: index.toString(),
            status: event.status,
            description: event.description,
            location: event.location,
            timestamp: event.created_at,
          })),
        };
        setTrackingData(mappedData);
      } else {
        setError('No tracking information found for this number. Please check and try again.');
      }
    } catch (err: any) {
      console.error('Tracking error:', err);
      setError(err.message || 'Failed to fetch tracking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      performTrack(number);
    }
  }, [searchParams, performTrack]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(trackingNumber.trim());
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your tracking number to see the status of your shipment
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" size="lg" isLoading={isLoading} icon={Search} disabled={isLoading}>
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Fetching tracking information...</p>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Tracking Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && !isLoading && (
          <div className="space-y-6">
            {/* Status Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {trackingData.tracking_number}
                      </h2>
                      <Badge variant={getStatusColor(trackingData.status) as any}>
                        {trackingData.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      Carrier: {trackingData.carrier} 
                      {trackingData.shipment_id && ` • Shipment ID: ${trackingData.shipment_id}`}
                    </p>
                  </div>
                  {trackingData.estimated_delivery && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(trackingData.estimated_delivery).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Shipment Timeline</h3>
              </div>
              <CardContent className="p-6">
                {trackingData.events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tracking events yet</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {trackingData.events.map((event, index) => {
                      const Icon = getStatusIcon(event.status);
                      const isLast = index === trackingData.events.length - 1;

                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isLast
                                  ? 'bg-primary-100 text-primary-600'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            {!isLast && (
                              <div className="w-0.5 h-full bg-gray-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <p className="font-medium text-gray-900">{event.description}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(event.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Need Help?</p>
                    <p className="text-sm text-gray-600">
                      If you have any questions about your shipment, please contact our customer
                      support via WhatsApp at +234 704 949 7394 or email support@kingjesuscollection.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results Yet */}
        {!trackingData && !isLoading && !error && (
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter your tracking number above to see your order status</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}