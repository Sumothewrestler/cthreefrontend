// app/businesses/page.tsx (View Businesses)

'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function BusinessesPage() {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, error, mutate } = useSWR('http://localhost:8000/api/businesses/', fetcher);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this business?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/businesses/${id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Business deleted successfully');
          mutate(); // Refresh the data
        } else {
          toast.error('Failed to delete business');
        }
      } catch (error) {
        toast.error('Error occurred while deleting');
      }
    }
  };

  if (error) return <div className="p-6">Failed to load businesses</div>;
  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Businesses</h1>
        <Link 
          href="/businesses/add"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Business
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Created At</th>
              <th className="px-6 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((business: any) => (
              <tr key={business.id}>
                <td className="px-6 py-4 border-b">{business.name}</td>
                <td className="px-6 py-4 border-b">
                  {new Date(business.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">
                  <Link 
                    href={`/businesses/edit/${business.id}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(business.id)}
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