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

export default function HomePage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => apiClient.get('/products').then((res) => res.data),
  });

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to EShop</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <button className="bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

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
      </section>

      <Footer />
    </>
  );
}
