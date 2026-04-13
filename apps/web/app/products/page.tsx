'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
}

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: () => apiClient.get('/products?skip=0&take=50').then((res) => res.data),
  });

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || '/placeholder.png'}
                rating={product.rating || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No products available</div>
        )}
      </div>

      <Footer />
    </>
  );
}
