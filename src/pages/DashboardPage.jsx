import React from 'react';
import { motion } from 'framer-motion';
import SummaryCards from '../components/SummaryCards';
import TrendChart from '../components/TrendChart';
import CategoryChart from '../components/CategoryChart';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useFinance } from '../context/FinanceContext';

const DashboardPage = () => {
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Overview of your financial activity
        </p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts + Form row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <div className="lg:col-span-1">
          {isAdmin ? (
            <TransactionForm />
          ) : (
            <CategoryChart />
          )}
        </div>
      </div>

      {/* Category chart (shown below if admin, since form takes the sidebar spot) */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart />
          {/* Recent transactions preview */}
          <div>
            <TransactionList />
          </div>
        </div>
      )}

      {/* If viewer, show transactions below charts */}
      {!isAdmin && (
        <TransactionList />
      )}

      {/* Mobile FAB for adding transactions */}
      {isAdmin && <TransactionForm compact />}
    </motion.div>
  );
};

export default DashboardPage;
