import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../services/expense-service';

const FinanceContext = createContext(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
};

export const FinanceProvider = ({ children }) => {
  // --- Theme ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);

  // --- Role ---
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('userRole') || 'admin';
    } catch {
      return 'admin';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('userRole', role); } catch {}
  }, [role]);

  const toggleRole = useCallback(() => {
    setRole(prev => (prev === 'admin' ? 'viewer' : 'admin'));
  }, []);

  const isAdmin = role === 'admin';

  // --- Transactions ---
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate a brief loading delay for skeleton loaders
    const timer = setTimeout(() => {
      const data = getTransactions();
      setTransactions(data);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTransaction = useCallback((newTx) => {
    const updated = addTransaction(newTx);
    setTransactions(updated);
  }, []);

  const handleUpdateTransaction = useCallback((id, updatedData) => {
    const updated = updateTransaction(id, updatedData);
    setTransactions(updated);
  }, []);

  const handleDeleteTransaction = useCallback((id) => {
    const updated = deleteTransaction(id);
    setTransactions(updated);
  }, []);

  // --- Filters ---
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',         // 'all' | 'income' | 'expense'
    category: 'All',
    sortBy: 'date-desc', // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', type: 'all', category: 'All', sortBy: 'date-desc' });
  }, []);

  // --- Active Page (simple routing) ---
  const [activePage, setActivePage] = useState('dashboard');

  // --- Computed Data ---
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        const cat = tx.category || 'Uncategorized';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + tx.amount;
      }
    });

    return {
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      categoryTotals,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(tx => tx.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(tx => tx.category === filters.category);
    }

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(tx =>
        (tx.description || '').toLowerCase().includes(q) ||
        (tx.category || '').toLowerCase().includes(q) ||
        String(tx.amount).includes(q)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'date-desc':
      default:
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return result;
  }, [transactions, filters]);

  const value = {
    // Theme
    isDarkMode, toggleDarkMode,
    // Role
    role, toggleRole, isAdmin,
    // Data
    transactions, isLoading,
    handleAddTransaction, handleUpdateTransaction, handleDeleteTransaction,
    // Filters
    filters, updateFilter, resetFilters, filteredTransactions,
    // Summary
    summary,
    // Navigation
    activePage, setActivePage,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
