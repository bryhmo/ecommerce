'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.post('/auth/login', data),
    onSuccess: (response) => {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Login successful!');
      window.location.href = '/';
    },
    onError: () => {
      alert('Invalid credentials');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 border rounded shadow">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <a href="/auth/register" className="text-primary hover:underline">Sign up</a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
