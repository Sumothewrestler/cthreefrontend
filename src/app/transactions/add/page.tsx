// app/transactions/add/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

export default function AddTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    business: '',
    transaction_type: 'Cr',
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch businesses for dropdown
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data: businesses } = useSWR('http://localhost:8000/api/businesses/', fetcher);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Transaction created successfully');
        router.push('/transactions');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create transaction');
      }
    } catch (error) {
      toast.error('Error occurred while creating transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Transaction</h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business</label>
            <select
              name="business"
              value={formData.business}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Business</option>
              {businesses?.results.map((business: any) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Cr">Credit</option>
              <option value="Dr">Debit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Transaction'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}