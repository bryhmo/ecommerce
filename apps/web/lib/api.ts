export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  products: '/products',
  cart: '/cart',
  orders: '/orders',
  users: '/users',
};
