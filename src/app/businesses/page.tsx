'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

interface Business {
  id: number;
  name: string;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function BusinessesPage() {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { data, error, mutate } = useSWR<{ results: Business[] }>('http://localhost:8000/api/businesses/', fetcher);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this business?')) {
      setIsDeleting(id);
      try {
        const response = await fetch(`http://localhost:8000/api/businesses/${id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Business deleted successfully');
          mutate();
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to delete business');
        }
      } catch (error) {
        console.error('Error deleting business:', error);
        toast.error('An error occurred while deleting the business');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load businesses. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
        <Link 
          href="/businesses/add"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Business
        </Link>
      </div>

      {!data ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((business: Business) => (
                <tr key={business.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{business.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {new Date(business.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      <Link 
                        href={`/businesses/edit/${business.id}`}
                        className="text-blue-500 hover:text-blue-600 mr-4"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(business.id)}
                        disabled={isDeleting === business.id}
                        className="text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {isDeleting === business.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

