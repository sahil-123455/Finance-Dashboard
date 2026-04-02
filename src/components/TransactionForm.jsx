import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';

const TransactionForm = ({ compact = false }) => {
  const { handleAddTransaction, isAdmin } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const todayISO = new Date().toISOString().split('T')[0];

  if (!isAdmin) return null;

  const validate = () => {
    const errs = {};
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) errs.amount = 'Enter a valid positive amount';
    if (!form.category) errs.category = 'Select a category';
    if (!form.date) errs.date = 'Select a date';
    if (form.date && form.date > todayISO) errs.date = 'Date cannot be in the future';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus('');
    setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'amount') {
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    }

    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Reset category when type changes
      if (name === 'type') updated.category = '';
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    handleAddTransaction(form);
    setStatus('Transaction added!');
    setTimeout(() => setStatus(''), 2500);
    setForm({ type: form.type, amount: '', category: '', date: '', description: '' });
    if (compact) setTimeout(() => setIsOpen(false), 1200);
  };

  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm transition-colors duration-200
    bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700
    focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500
    text-gray-800 dark:text-gray-200 placeholder-gray-400`;

  const formBody = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {['expense', 'income'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => handleChange({ target: { name: 'type', value: t } })}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize
              ${form.type === t
                ? t === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Amount (₹)</label>
        <input
          type="text"
          inputMode="decimal"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className={inputCls}
          placeholder="0.00"
        />
        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} max={todayISO} className={inputCls} />
        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description (optional)</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className={inputCls}
          placeholder="e.g., Dinner with friends"
          maxLength={100}
        />
      </div>

      {/* Status */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-xl"
          >
            <Check size={14} /> {status}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200
          ${form.type === 'expense'
            ? 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700'
            : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700'}
          shadow-sm hover:shadow-md active:scale-[0.98]`}
      >
        Add {form.type === 'income' ? 'Income' : 'Expense'}
      </button>
    </form>
  );

  // Compact mode: floating button + modal
  if (compact) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center md:hidden"
        >
          <Plus size={24} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">New Transaction</h3>
                  <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                {formBody}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline mode: rendered in-page
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        New Transaction
      </h3>
      {formBody}
    </div>
  );
};

export default TransactionForm;
