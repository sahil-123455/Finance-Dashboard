import React from 'react';
import { motion } from 'framer-motion';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useFinance } from '../context/FinanceContext';

const TransactionsPage = () => {
  const { isAdmin } = useFinance();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {isAdmin ? 'Manage all your income and expenses' : 'View all your transactions'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form — only visible to admin on desktop */}
        {isAdmin && (
          <div className="hidden md:block lg:col-span-1">
            <div className="sticky top-6">
              <TransactionForm />
            </div>
          </div>
        )}

        {/* List */}
        <div className={isAdmin ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <TransactionList />
        </div>
      </div>

      {/* Mobile FAB */}
      {isAdmin && <TransactionForm compact />}
    </motion.div>
  );
};

export default TransactionsPage;
