'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  trackingNumber?: string;
  shippingAddress: string;
}

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order-tracking', orderId],
    queryFn: () => apiClient.get(`/orders/tracking/${orderId}`).then((res) => res.data),
    enabled: !!orderId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = () => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.map((step) => ({
      label: step.charAt(0).toUpperCase() + step.slice(1),
      completed: order && steps.indexOf(order.status) >= steps.indexOf(step),
      current: order && order.status === step,
    }));
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {isLoading && <div className="text-center text-gray-500">Loading order...</div>}

        {order && (
          <div className="max-w-2xl mx-auto">
            {/* Order Header */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600">Order ID</p>
                  <p className="text-xl font-bold">{order.id}</p>
                </div>
                <span className={`px-4 py-2 rounded font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600">
                Total: <span className="font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
              </p>
              <p className="text-gray-600 text-sm">
                Ordered: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="font-bold mb-6">Order Status</h2>
              <div className="flex justify-between">
                {getStatusSteps().map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        step.completed ? 'bg-green-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <p className={`text-sm mt-2 ${step.current ? 'font-bold' : ''}`}>{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="font-bold mb-4">Shipping Address</h2>
              <p className="text-gray-700">{order.shippingAddress}</p>
            </div>

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="bg-white p-6 rounded shadow">
                <h2 className="font-bold mb-4">Tracking Number</h2>
                <p className="font-mono text-lg bg-gray-100 p-3 rounded">{order.trackingNumber}</p>
                <p className="text-gray-600 text-sm mt-2">
                  <a href={`https://tracking.example.com/${order.trackingNumber}`} className="text-primary hover:underline">
                    View full tracking details
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {!order && orderId && !isLoading && (
          <div className="text-center text-gray-500">Order not found</div>
        )}
      </div>

      <Footer />
    </>
  );
}
