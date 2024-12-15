'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';

interface Business {
  id: number;
  name: string;
}

interface TransactionFormData {
  date: string;
  business: string;
  transaction_type: 'Cr' | 'Dr';
  amount: string;
  description: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AddTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TransactionFormData>({
    date: '',
    business: '',
    transaction_type: 'Cr',
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: businessesData } = useSWR<{ results: Business[] }>('http://localhost:8000/api/businesses/', fetcher);

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
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
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
            <label htmlFor="date" className="block text-sm font-medium mb-2">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="business" className="block text-sm font-medium mb-2">Business</label>
            <select
              id="business"
              name="business"
              value={formData.business}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Business</option>
              {businessesData?.results.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="transaction_type" className="block text-sm font-medium mb-2">Type</label>
            <select
              id="transaction_type"
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
            <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
            <input
              id="amount"
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
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              id="description"
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
