const STORAGE_KEY = 'financeDashboardData_v2';

const SEED_DATA = [
  { id: 'seed-1',  description: 'Monthly Salary',     amount: 75000, type: 'income',  category: 'Salary',         date: '2026-03-01' },
  { id: 'seed-2',  description: 'Apartment Rent',      amount: 18000, type: 'expense', category: 'Rent & Housing', date: '2026-03-02' },
  { id: 'seed-3',  description: 'Grocery Shopping',    amount: 3200,  type: 'expense', category: 'Food & Dining',  date: '2026-03-05' },
  { id: 'seed-4',  description: 'Netflix & Spotify',   amount: 1100,  type: 'expense', category: 'Entertainment',  date: '2026-03-06' },
  { id: 'seed-5',  description: 'Electricity Bill',    amount: 2400,  type: 'expense', category: 'Utilities',      date: '2026-03-08' },
  { id: 'seed-6',  description: 'Freelance Project',   amount: 22000, type: 'income',  category: 'Salary',         date: '2026-03-10' },
  { id: 'seed-7',  description: 'Uber & Metro',        amount: 1800,  type: 'expense', category: 'Transportation', date: '2026-03-12' },
  { id: 'seed-8',  description: 'Doctor Visit',        amount: 900,   type: 'expense', category: 'Healthcare',     date: '2026-03-14' },
  { id: 'seed-9',  description: 'New Shoes',           amount: 3500,  type: 'expense', category: 'Shopping',       date: '2026-03-16' },
  { id: 'seed-10', description: 'Mutual Fund SIP',     amount: 5000,  type: 'expense', category: 'Investment',     date: '2026-03-18' },
  { id: 'seed-11', description: 'Monthly Salary',      amount: 75000, type: 'income',  category: 'Salary',         date: '2026-02-01' },
  { id: 'seed-12', description: 'Apartment Rent',      amount: 18000, type: 'expense', category: 'Rent & Housing', date: '2026-02-02' },
  { id: 'seed-13', description: 'Restaurant Dinner',   amount: 2100,  type: 'expense', category: 'Food & Dining',  date: '2026-02-07' },
  { id: 'seed-14', description: 'Internet Bill',       amount: 999,   type: 'expense', category: 'Utilities',      date: '2026-02-09' },
  { id: 'seed-15', description: 'Freelance Design',    amount: 15000, type: 'income',  category: 'Salary',         date: '2026-02-12' },
  { id: 'seed-16', description: 'Movie Tickets',       amount: 800,   type: 'expense', category: 'Entertainment',  date: '2026-02-15' },
  { id: 'seed-17', description: 'Cab Rides',           amount: 1500,  type: 'expense', category: 'Transportation', date: '2026-02-18' },
  { id: 'seed-18', description: 'Monthly Salary',      amount: 75000, type: 'income',  category: 'Salary',         date: '2026-01-01' },
  { id: 'seed-19', description: 'Apartment Rent',      amount: 18000, type: 'expense', category: 'Rent & Housing', date: '2026-01-02' },
  { id: 'seed-20', description: 'Zomato Orders',       amount: 2800,  type: 'expense', category: 'Food & Dining',  date: '2026-01-10' },
  { id: 'seed-21', description: 'Gym Membership',      amount: 1200,  type: 'expense', category: 'Healthcare',     date: '2026-01-15' },
  { id: 'seed-22', description: 'Amazon Shopping',     amount: 4500,  type: 'expense', category: 'Shopping',       date: '2026-01-20' },
  { id: 'seed-23', description: 'Bonus Payout',        amount: 10000, type: 'income',  category: 'Salary',         date: '2026-01-25' },
];

// Safely read from localStorage
const readStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null; // null = first visit, [] = user cleared data
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      tx => tx && typeof tx.amount === 'number' && tx.id && tx.date && tx.type
    );
  } catch {
    console.error('Corrupted localStorage data — resetting.');
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const writeStorage = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
  }
};

export const getTransactions = () => {
  const stored = readStorage();
  // First visit — seed data automatically
  if (stored === null) {
    writeStorage(SEED_DATA);
    return [...SEED_DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return stored.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const addTransaction = (newTx) => {
  const transactions = getTransactions();
  const tx = {
    ...newTx,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    amount: Math.abs(parseFloat(newTx.amount)) || 0,
    type: newTx.type || 'expense',
    category: newTx.category || 'Other',
    description: newTx.description || '',
    date: newTx.date || new Date().toISOString().split('T')[0],
  };
  transactions.unshift(tx);
  writeStorage(transactions);
  return transactions;
};

export const updateTransaction = (id, updatedData) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(tx => tx.id === id);
  if (index === -1) return transactions;
  transactions[index] = {
    ...transactions[index],
    ...updatedData,
    amount: Math.abs(parseFloat(updatedData.amount ?? transactions[index].amount)) || 0,
    id,
  };
  writeStorage(transactions);
  return transactions;
};

export const deleteTransaction = (id) => {
  const transactions = getTransactions().filter(tx => tx.id !== id);
  writeStorage(transactions);
  return transactions;
};

export const exportToCSV = (transactions) => {
  if (!transactions.length) return;
  const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
  const rows = transactions.map(tx => [
    tx.date,
    tx.type,
    tx.category,
    tx.amount.toFixed(2),
    `"${(tx.description || '').replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `finance-data-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Migrate old data format if present
export const migrateOldData = () => {
  try {
    const oldData = localStorage.getItem('expenseTrackerData');
    if (!oldData) return;
    const oldExpenses = JSON.parse(oldData);
    if (!Array.isArray(oldExpenses) || oldExpenses.length === 0) return;

    const existing = readStorage();
    if (existing && existing.length > 0) return;

    const migrated = oldExpenses.map(exp => ({
      id: `${exp.id || Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount: Math.abs(parseFloat(exp.amount)) || 0,
      type: 'expense',
      category: exp.category || 'Other',
      description: exp.summary || '',
      date: exp.date || new Date().toISOString().split('T')[0],
    }));

    writeStorage(migrated);
    localStorage.removeItem('expenseTrackerData');
  } catch {
    // Silent migration failure
  }
};