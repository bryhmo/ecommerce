'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import apiClient from '@/lib/axios';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: [] as string[],
  });

  const { data: products, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: () => apiClient.get('/admin/products').then((res) => res.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => apiClient.get('/admin/orders/stats').then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.post('/products', data),
    onSuccess: () => {
      refetchProducts();
      setFormData({ name: '', description: '', price: 0, stock: 0, category: '', images: [] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: typeof formData }) =>
      apiClient.put(`/products/${data.id}`, data.updates),
    onSuccess: () => {
      refetchProducts();
      setEditingId(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/products/${id}`),
    onSuccess: () => refetchProducts(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue?.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Completed Orders</p>
              <p className="text-3xl font-bold">{stats.completedOrders}</p>
            </div>
          </div>
        )}

        {/* Product Management */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ name: '', description: '', price: 0, stock: 0, category: '', images: [] });
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="px-4 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="px-4 py-2 border rounded"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{product.stock}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => {
                          setEditingId(product.id);
                          setFormData({
                            name: product.name,
                            description: '',
                            price: product.price,
                            stock: product.stock,
                            category: product.category,
                            images: [],
                          });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this product?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
