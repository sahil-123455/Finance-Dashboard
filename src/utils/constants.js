export const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Utilities', 'Shopping',
  'Entertainment', 'Health', 'Education', 'Rent', 'Other',
];

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Refund', 'Other',
];

export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

export const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Utilities: '#8b5cf6',
  Shopping: '#ec4899',
  Entertainment: '#06b6d4',
  Health: '#10b981',
  Education: '#6366f1',
  Rent: '#f97316',
  Salary: '#22c55e',
  Freelance: '#14b8a6',
  Investment: '#a855f7',
  Gift: '#f43f5e',
  Refund: '#64748b',
  Other: '#6b7280',
};

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];