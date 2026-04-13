'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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

export default function ProductsFilterPage() {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'newest'>('newest');

  const { data: categories } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/products/categories').then((res) => res.data),
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['filtered-products', category, minPrice, maxPrice, sortBy],
    queryFn: () =>
      apiClient
        .get('/products/filter', {
          params: {
            category: category || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            sortBy,
          },
        })
        .then((res) => res.data),
  });

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded shadow h-fit">
            <h3 className="font-bold text-lg mb-4">Filters</h3>

            {/* Category */}
            <div className="mb-6">
              <label className="font-semibold mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="font-semibold mb-2 block">Price Range</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="font-semibold mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="newest">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-6">
              {category ? `${category} Products` : 'All Products'}
            </h2>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.images?.[0] || '/placeholder.png'}
                    rating={product.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No products found</div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
