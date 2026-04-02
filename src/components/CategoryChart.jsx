import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const CategoryChart = () => {
  const { summary, isLoading } = useFinance();

  const data = useMemo(() => {
    return Object.entries(summary.categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [summary.categoryTotals]);

  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Expense Breakdown
        </h3>
        <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M12 2a10 10 0 0110 10" />
          </svg>
          <p className="text-sm">Add expenses to see breakdown</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    const total = data.reduce((s, d) => s + d.value, 0);
    const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-300">{name}</p>
        <p className="text-gray-500 dark:text-gray-400">{formatCurrency(value)} ({pct}%)</p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Expense Breakdown
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
        {data.slice(0, 6).map(({ name }) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[name] || '#6b7280' }}
            />
            <span className="truncate max-w-[80px]">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
