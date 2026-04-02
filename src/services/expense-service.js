const STORAGE_KEY = 'financeDashboardData';

// Safely read from localStorage
const readStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    // Validate each item has required fields
    return parsed.filter(
      tx => tx && typeof tx.amount === 'number' && tx.id && tx.date && tx.type
    );
  } catch {
    console.error('Corrupted localStorage data — resetting.');
    localStorage.removeItem(STORAGE_KEY);
    return [];
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
  return readStorage().sort((a, b) => new Date(b.date) - new Date(a.date));
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
    id, // prevent id overwrite
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
    if (existing.length > 0) return; // don't overwrite new data

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