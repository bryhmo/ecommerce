'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, getTotal } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.quantity * 10, 0); // Mock price

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Product {item.productId.slice(0, 8)}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">${(item.quantity * 10).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 border rounded p-6 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(subtotal + subtotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-blue-700 transition mb-3">
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
