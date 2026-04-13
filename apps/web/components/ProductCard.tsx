'use client';

import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export default function ProductCard({ id, name, price, image, rating }: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <div className="bg-gray-200 aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{name}</h3>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <div className="text-sm text-yellow-500">⭐ {rating.toFixed(1)}</div>
        </div>

        <button className="w-full mt-3 bg-primary text-white py-2 rounded hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </Link>
  );
}
