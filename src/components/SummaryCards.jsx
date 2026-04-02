import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    getValue: (s) => s.totalBalance,
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/30',
    iconBg: 'bg-emerald-500/10',
    textColor: 'text-emerald-700 dark:text-emerald-400',
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    getValue: (s) => s.totalIncome,
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/30',
    iconBg: 'bg-blue-500/10',
    textColor: 'text-blue-700 dark:text-blue-400',
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    getValue: (s) => s.totalExpenses,
    gradient: 'from-rose-500 to-pink-600',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/30',
    iconBg: 'bg-rose-500/10',
    textColor: 'text-rose-700 dark:text-rose-400',
  },
];

const SkeletonCard = () => (
  <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
    <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
  </div>
);

const SummaryCards = () => {
  const { summary, isLoading } = useFinance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, getValue, iconBg, textColor }, index) => {
        const value = getValue(summary);
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
              hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-emerald-400 to-teal-500" />

            <div className="relative flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
              </span>
              <div className={`p-2 rounded-xl ${iconBg}`}>
                <Icon size={18} className={textColor} strokeWidth={2} />
              </div>
            </div>

            <p className={`relative text-2xl sm:text-xl lg:text-2xl font-bold ${textColor} tracking-tight`}>
              {formatCurrency(value)}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
