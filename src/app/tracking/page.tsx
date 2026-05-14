'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, Badge } from '@/components/ui/card';
import { TrackingInfo, TrackingEvent } from '@/types';
import { trackingApi } from '@/lib/api';

// Mock tracking data
const mockTrackingData: Record<string, TrackingInfo> = {
  'TA123456789': {
    tracking_number: 'TA123456789',
    shipment_id: 'SHP001',
    carrier: 'Terminal Africa',
    status: 'in_transit',
    estimated_delivery: '2024-05-15',
    events: [
      {
        id: '1',
        status: 'picked_up',
        description: 'Package picked up from sender',
        location: 'Lagos, Nigeria',
        timestamp: '2024-05-10T09:00:00Z',
      },
      {
        id: '2',
        status: 'in_transit',
        description: 'Package in transit to destination',
        location: 'Abuja Sorting Facility',
        timestamp: '2024-05-11T14:30:00Z',
      },
      {
        id: '3',
        status: 'in_transit',
        description: 'Package departed from sorting facility',
        location: 'Abuja Sorting Facility',
        timestamp: '2024-05-12T08:15:00Z',
      },
    ],
  },
  'TA987654321': {
    tracking_number: 'TA987654321',
    shipment_id: 'SHP002',
    carrier: 'Terminal Africa',
    status: 'delivered',
    estimated_delivery: '2024-05-08',
    events: [
      {
        id: '1',
        status: 'picked_up',
        description: 'Package picked up from sender',
        location: 'Lagos, Nigeria',
        timestamp: '2024-05-05T10:00:00Z',
      },
      {
        id: '2',
        status: 'in_transit',
        description: 'Package in transit',
        location: 'Lagos Hub',
        timestamp: '2024-05-05T16:00:00Z',
      },
      {
        id: '3',
        status: 'delivered',
        description: 'Package delivered successfully',
        location: 'Abuja, Nigeria',
        timestamp: '2024-05-08T11:30:00Z',
      },
    ],
  },
};

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

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      performTrack(number);
    }
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    performTrack(trackingNumber.trim());
  };

  const performTrack = async (number: string) => {
    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await trackingApi.getStatus(number);
      
      // Map Terminal Africa tracking response to TrackingInfo type
      // Based on Terminal Africa API docs, tracking response has a data field
      if (response && response.status) {
        const data = response.data;
        const mappedData: TrackingInfo = {
          tracking_number: data.tracking_number,
          shipment_id: data.shipment_id,
          carrier: data.carrier_name || 'Terminal Africa',
          status: data.status,
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
        // Fallback to mock data for demo if API fails or return no results
        const mockData = mockTrackingData[trackingNumber.toUpperCase()];
        if (mockData) {
          setTrackingData(mockData);
        } else {
          setError('No tracking information found for this number. Please check and try again.');
        }
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      // Fallback to mock data for demo
      const mockData = mockTrackingData[trackingNumber.toUpperCase()];
      if (mockData) {
        setTrackingData(mockData);
      } else {
        setError(error.message || 'Failed to fetch tracking information. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
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
                  placeholder="Enter tracking number (e.g., TA123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button type="submit" size="lg" isLoading={isLoading} icon={Search}>
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Try tracking numbers TA123456789 or TA987654321
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && (
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
                      Carrier: {trackingData.carrier} • Shipment ID: {trackingData.shipment_id}
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
                        <div className={`flex-1 pb-8 ${isLast ? '' : ''}`}>
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
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
      </div>
    </div>
  );
}