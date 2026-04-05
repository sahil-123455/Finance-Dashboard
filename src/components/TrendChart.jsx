import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { MONTHS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const TrendChart = () => {
  const { transactions, isDarkMode, isLoading } = useFinance();

  const data = useMemo(() => {
    if (!transactions.length) return [];

    const monthMap = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
      if (tx.type === 'income') monthMap[key].income += tx.amount;
      else monthMap[key].expense += tx.amount;
    });

    return Object.keys(monthMap)
      .sort()
      .slice(-12)
      .map(key => {
        const [y, m] = key.split('-');
        return {
          name: `${MONTHS[parseInt(m) - 1]} ${y.slice(2)}`,
          Income: monthMap[key].income,
          Expenses: monthMap[key].expense,
        };
      });
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col animate-pulse">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex-1 min-h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Monthly Trends
        </h3>
        <div className="flex-1 min-h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13l4-4 4 4 4-8 4 4" />
          </svg>
          <p className="text-sm">Add transactions to see trends</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const gridColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const axisColor = isDarkMode ? '#6b7280' : '#9ca3af';

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Monthly Trends
      </h3>
      <div className="flex-1 min-h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2}
              fillOpacity={1} fill="url(#incomeGrad)" animationDuration={1200}
            />
            <Area
              type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2}
              fillOpacity={1} fill="url(#expenseGrad)" animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;