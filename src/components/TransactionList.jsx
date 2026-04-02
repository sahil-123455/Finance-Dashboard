import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Download, Trash2, Pencil, X, Check,
  ArrowUpDown, ChevronDown,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ALL_CATEGORIES, SORT_OPTIONS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../services/expense-service';

const TransactionList = () => {
  const {
    filteredTransactions, filters, updateFilter, resetFilters,
    handleDeleteTransaction, handleUpdateTransaction,
    isAdmin, isLoading, transactions,
  } = useFinance();

  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const startEdit = (tx) => {
    if (!isAdmin) return;
    setEditingId(tx.id);
    setEditForm({ ...tx });
  };

  const saveEdit = () => {
    const amt = parseFloat(editForm.amount);
    if (isNaN(amt) || amt <= 0) return;
    handleUpdateTransaction(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const confirmDelete = (id) => {
    handleDeleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category !== 'All';

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header + Search + Actions */}
      <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
        {/* Row 1: title + controls (wrap on small screens) */}
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="mr-auto text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Transactions
            <span className="ml-2 text-xs font-normal normal-case text-gray-400">
              ({filteredTransactions.length}{hasActiveFilters ? ` of ${transactions.length}` : ''})
            </span>
          </h3>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search..."
              className="w-36 sm:w-44 pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500
                focus:w-52 transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Filter toggle with active dot */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2 rounded-xl border transition-colors duration-200 ${showFilters
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            title="Filters"
          >
            <SlidersHorizontal size={16} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </motion.button>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={e => updateFilter('sortBy', e.target.value)}
              className="appearance-none pl-7 pr-6 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer max-w-[130px]"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ArrowUpDown size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Export */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => exportToCSV(filteredTransactions)}
            disabled={!filteredTransactions.length}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800
              transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export CSV"
          >
            <Download size={16} />
          </motion.button>
        </div>

        {/* Filter bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Type filter pills */}
                <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-0.5">
                  {['all', 'income', 'expense'].map((t, i) => (
                    <motion.button
                      key={t}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => updateFilter('type', t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 capitalize
                        ${filters.type === t
                          ? t === 'income'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : t === 'expense'
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>

                {/* Category filter */}
                <select
                  value={filters.category}
                  onChange={e => updateFilter('category', e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 max-w-[150px]"
                >
                  <option value="All">All Categories</option>
                  <optgroup label="Expense">
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Income">
                    {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </select>

                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium transition-colors"
                  >
                    <X size={12} /> Clear all
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction rows */}
      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => {
              const isEditing = editingId === tx.id;
              const isConfirmingDelete = deleteConfirmId === tx.id;
              const isIncome = tx.type === 'income';

              if (isEditing) {
                const editCategories = editForm.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
                return (
                  <motion.div
                    key={tx.id}
                    layout
                    className="px-4 sm:px-5 py-3 bg-emerald-50/50 dark:bg-emerald-900/10"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editForm.amount}
                        onChange={e => {
                          if (e.target.value !== '' && !/^\d*\.?\d*$/.test(e.target.value)) return;
                          setEditForm(p => ({ ...p, amount: e.target.value }));
                        }}
                        className="col-span-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                      />
                      <select
                        value={editForm.category}
                        onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                        className="col-span-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                      >
                        {editCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input
                        type="text"
                        value={editForm.description || ''}
                        onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                        className="col-span-1 sm:col-span-2 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                        placeholder="Description"
                        maxLength={100}
                      />
                      <div className="col-span-1 flex items-center gap-1 justify-end">
                        <button onClick={saveEdit} className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="group px-4 sm:px-5 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Type indicator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {tx.description || tx.category}
                        </span>
                        <span className={`hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded-full
                          ${isIncome
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                          {tx.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(tx.date)}
                        <span className="sm:hidden ml-2 text-[10px] font-medium">
                          {tx.category}
                        </span>
                      </p>
                    </div>

                    {/* Amount */}
                    <span className={`text-sm font-semibold whitespace-nowrap
                      ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {isIncome ? '+' : '−'} {formatCurrency(tx.amount)}
                    </span>

                    {/* Actions (admin only) */}
                    {isAdmin && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => startEdit(tx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => confirmDelete(tx.id)}
                              className="p-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                              title="Confirm delete"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : isAdmin ? 'Add your first transaction to get started' : 'Transactions will appear here'}
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransactionList;
