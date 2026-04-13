'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/store';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * 10, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/orders', data);
      return response.data;
    },
    onSuccess: (order) => {
      initializePaymentMutation.mutate({
        orderId: order.id,
        amount: total,
        email,
      });
    },
  });

  const initializePaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/payments/initialize', data);
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    createOrderMutation.mutate({
      cartItems: items,
      totalAmount: total,
      shippingAddress,
    });
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleCheckout} className="space-y-6">
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Shipping Address</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>Item {item.productId.slice(0, 8)} x{item.quantity}</span>
                  <span>${(item.quantity * 10).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Powered by Paystack</p>
              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                You will be redirected to Paystack to complete your payment securely.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
