'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WishlistItem {
  id: string;
  productId: string;
  product: any;
  addedAt: string;
}

export default function WishlistPage() {
  const { data: wishlist, refetch } = useQuery<WishlistItem[]>({
    queryKey: ['wishlist'],
    queryFn: () => apiClient.get('/wishlist').then((res) => res.data),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => apiClient.delete(`/wishlist/${productId}`),
    onSuccess: () => refetch(),
  });

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 aspect-square overflow-hidden">
                  <img
                    src={item.product.images?.[0] || '/placeholder.png'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.product.name}</h3>

                  <div className="flex items-center justify-between mt-2 mb-4">
                    <span className="text-lg font-bold text-primary">
                      ${item.product.price.toFixed(2)}
                    </span>
                    <div className="text-sm text-yellow-500">⭐ {item.product.rating.toFixed(1)}</div>
                  </div>

                  <button
                    onClick={() => removeMutation.mutate(item.productId)}
                    disabled={removeMutation.isPending}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your wishlist is empty</p>
            <a
              href="/products"
              className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Continue Shopping
            </a>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
