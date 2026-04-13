'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/store';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number;
  reviews: any[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => apiClient.get(`/products/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        productId: product.id,
        quantity,
      });
      alert('Product added to cart!');
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-gray-500">Loading product...</div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gray-100 aspect-square rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={product.images?.[0] || '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                <div className="text-lg text-yellow-500">⭐ {product.rating.toFixed(1)}</div>
                <span className="text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {/* Reviews Section */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                  <div className="space-y-4">
                    {product.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">⭐ {review.rating}/5</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Product not found</div>
        )}
      </div>

      <Footer />
    </>
  );
}
