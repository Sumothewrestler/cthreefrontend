'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, PlusCircle, ListOrdered, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-white tracking-tight drop-shadow-md">
          Business Management System
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg border border-white border-opacity-30 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <Building2 className="mr-2" size={24} />
              Business
            </h2>
            <div className="space-y-4">
              <Link 
                href="/businesses/add" 
                className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg text-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Business
              </Link>
              <Link 
                href="/businesses" 
                className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-3 rounded-lg text-center hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <ListOrdered className="mr-2" size={20} />
                View Businesses
              </Link>
            </div>
          </motion.div>

          {/* Transactions Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-md bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg border border-white border-opacity-30 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <CreditCard className="mr-2" size={24} />
              Transactions
            </h2>
            <div className="space-y-4">
              <Link 
                href="/transactions/add" 
                className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg text-center hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Transaction
              </Link>
              <Link 
                href="/transactions" 
                className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-3 rounded-lg text-center hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <ListOrdered className="mr-2" size={20} />
                View Transactions
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

