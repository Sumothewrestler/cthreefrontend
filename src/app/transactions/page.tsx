// app/transactions/page.tsx

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function TransactionsPage() {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, error, mutate } = useSWR('http://localhost:8000/api/transactions/', fetcher);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/transactions/${id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Transaction deleted successfully');
          mutate();
        } else {
          toast.error('Failed to delete transaction');
        }
      } catch (error) {
        toast.error('Error occurred while deleting');
      }
    }
  };

  if (error) return <div className="p-6">Failed to load transactions</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Link 
          href="/transactions/add"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Transaction
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Date</th>
              <th className="px-6 py-3 border-b">Business</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Amount</th>
              <th className="px-6 py-3 border-b">Description</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((transaction: any) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 border-b">{transaction.date}</td>
                <td className="px-6 py-4 border-b">{transaction.business_name}</td>
                <td className="px-6 py-4 border-b">{transaction.transaction_type}</td>
                <td className="px-6 py-4 border-b">{transaction.amount}</td>
                <td className="px-6 py-4 border-b">{transaction.description}</td>
                <td className="px-6 py-4 border-b">
                  <Link 
                    href={`/transactions/edit/${transaction.id}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-500 hover:underline"
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
  );
}