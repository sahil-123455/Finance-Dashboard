import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Sparkles, PiggyBank, Target,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORY_COLORS, MONTHS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const InsightCard = ({ icon: Icon, title, value, detail, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800
      hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300"
  >
    <div className="flex items-start gap-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-0.5 truncate">{value}</p>
        {detail && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{detail}</p>}
      </div>
    </div>
  </motion.div>
);

const InsightsPanel = () => {
  const { transactions, summary, isLoading, isDarkMode } = useFinance();

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');

    const catEntries = Object.entries(summary.categoryTotals);
    const topCategory = catEntries.length
      ? catEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
      : null;

    const monthlyData = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
      if (tx.type === 'income') monthlyData[key].income += tx.amount;
      else monthlyData[key].expense += tx.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const previousMonth = sortedMonths.length > 1 ? sortedMonths[sortedMonths.length - 2] : null;

    const currentExpense = currentMonth ? monthlyData[currentMonth].expense : 0;
    const previousExpense = previousMonth ? monthlyData[previousMonth].expense : 0;

    const spendingChange = previousExpense > 0
      ? ((currentExpense - previousExpense) / previousExpense * 100).toFixed(1)
      : null;

    const avgExpense = expenses.length ? summary.totalExpenses / expenses.length : 0;

    const savingsRate = summary.totalIncome > 0
      ? ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome * 100).toFixed(1)
      : 0;

    const observations = [];

    if (spendingChange !== null) {
      if (parseFloat(spendingChange) > 20) {
        observations.push({
          icon: AlertTriangle,
          title: 'Spending Alert',
          value: `+${spendingChange}% from last month`,
          detail: `You spent ${formatCurrency(currentExpense - previousExpense)} more than last month`,
          color: 'bg-amber-500',
        });
      } else if (parseFloat(spendingChange) < -10) {
        observations.push({
          icon: TrendingDown,
          title: 'Great Savings',
          value: `${spendingChange}% vs last month`,
          detail: `You saved ${formatCurrency(previousExpense - currentExpense)} compared to last month`,
          color: 'bg-emerald-500',
        });
      }
    }

    if (parseFloat(savingsRate) > 30) {
      observations.push({
        icon: PiggyBank,
        title: 'Healthy Savings',
        value: `${savingsRate}% savings rate`,
        detail: 'You\'re saving more than 30% of your income — excellent!',
        color: 'bg-teal-500',
      });
    } else if (parseFloat(savingsRate) < 10 && summary.totalIncome > 0) {
      observations.push({
        icon: AlertTriangle,
        title: 'Low Savings',
        value: `${savingsRate}% savings rate`,
        detail: 'Consider reducing expenses to save more',
        color: 'bg-red-500',
      });
    }

    const barData = sortedMonths.slice(-6).map(key => {
      const [y, m] = key.split('-');
      return {
        name: `${MONTHS[parseInt(m) - 1]}`,
        Income: monthlyData[key].income,
        Expenses: monthlyData[key].expense,
      };
    });

    return {
      topCategory,
      currentExpense,
      spendingChange,
      avgExpense,
      savingsRate,
      observations,
      barData,
      totalTransactions: transactions.length,
      expenseCount: expenses.length,
      incomeCount: incomes.length,
    };
  }, [transactions, summary]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="rounded-2xl p-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <Sparkles size={24} className="text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No insights yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Add some transactions to see analytics</p>
      </div>
    );
  }

  const gridColor = isDarkMode ? '#1f2937' : '#f3f4f6';
  const axisColor = isDarkMode ? '#6b7280' : '#9ca3af';

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

  return (
    <div className="space-y-6">
      {/* Key metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.topCategory && (
          <InsightCard
            index={0}
            icon={Target}
            title="Top Spending Category"
            value={insights.topCategory[0]}
            detail={`${formatCurrency(insights.topCategory[1])} total spent`}
            color={`bg-[${CATEGORY_COLORS[insights.topCategory[0]] || '#6b7280'}]`}
          />
        )}
        <InsightCard
          index={1}
          icon={TrendingDown}
          title="Average Expense"
          value={formatCurrency(insights.avgExpense)}
          detail={`Across ${insights.expenseCount} expense${insights.expenseCount !== 1 ? 's' : ''}`}
          color="bg-rose-500"
        />
        <InsightCard
          index={2}
          icon={PiggyBank}
          title="Savings Rate"
          value={`${insights.savingsRate}%`}
          detail={summary.totalIncome > 0 ? `${formatCurrency(summary.totalBalance)} saved` : 'Add income to calculate'}
          color="bg-emerald-500"
        />
        {insights.spendingChange !== null && (
          <InsightCard
            index={3}
            icon={parseFloat(insights.spendingChange) > 0 ? TrendingUp : TrendingDown}
            title="Monthly Spending Change"
            value={`${parseFloat(insights.spendingChange) > 0 ? '+' : ''}${insights.spendingChange}%`}
            detail={`This month: ${formatCurrency(insights.currentExpense)}`}
            color={parseFloat(insights.spendingChange) > 0 ? 'bg-amber-500' : 'bg-emerald-500'}
          />
        )}
      </div>

      {/* Smart Observations */}
      {insights.observations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} /> Smart Observations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.observations.map((obs, i) => (
              <InsightCard key={i} index={i} {...obs} />
            ))}
          </div>
        </div>
      )}

      {/* Monthly comparison bar chart */}
      {insights.barData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Monthly Comparison
          </h3>
          <div className="h-64 w-full overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insights.barData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InsightsPanel;