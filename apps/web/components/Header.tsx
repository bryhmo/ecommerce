'use client';

import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiUser } from 'react-icons/fi';
import { useCart } from '@/lib/store';

export default function Header() {
  const cartTotal = useCart((state) => state.getTotal());

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          EShop
        </Link>

        <div className="flex-1 mx-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none w-full ml-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auth/login" className="flex items-center gap-2 hover:text-primary">
            <FiUser size={20} />
            <span>Account</span>
          </Link>

          <Link href="/cart" className="relative flex items-center gap-2 hover:text-primary">
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartTotal}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
