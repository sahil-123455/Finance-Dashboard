# 💰 FinDash — Finance Dashboard

## 🔗 Live Demo

Check out the fully functional app here:  
👉 https://finance-dashboard-mauve-six.vercel.app/

---

## 🎯 Project Overview

**FinDash** is a modern, fintech-style personal finance dashboard built with **React 19**, **Tailwind CSS v4**, **Framer Motion**, and **Recharts**. Originally a simple expense tracker, it has been fully upgraded into a recruiter-level frontend project showcasing advanced UI/UX, smart analytics, and production-quality code architecture.

---

## ✨ Features

### 📊 Dashboard
- **Summary Cards** — Total Balance, Income, and Expenses with animated gradient icons and hover glow effects
- **Monthly Trend Chart** — Area chart showing income vs expenses over the last 12 months
- **Expense Breakdown Chart** — Donut/pie chart with category color-coding and percentage tooltips
- **Recent Transactions** — Quick preview list directly on the dashboard

### 💸 Transactions
- **Add / Edit / Delete** transactions with full validation
- **Edit-via-form flow** — Clicking edit pre-fills the form; button text changes to "Update Transaction"
- **Delete Confirmation Modal** — Centered modal with warning icon: *"Are you sure you want to delete?"*
- **Search** — Real-time search across description, category, and amount
- **Filters** — Filter by type (All / Income / Expense) and category with animated filter bar
- **Sort** — By date (newest/oldest) or amount (highest/lowest)
- **Export to CSV** — Download filtered transactions as a `.csv` file
- **Scrollable list** — Max-height container prevents overflow on large datasets

### 🔍 Insights (Smart Analytics)
- **Top Spending Category** — Highest total spend by category
- **Most Frequent Category** — Category with the most number of transactions
- **Average Expense** — Mean expense value across all transactions
- **Savings Rate** — Percentage of income saved, with healthy/low savings alerts
- **Monthly Comparison** — Dynamic text: *"You spent X% more/less than last month"*
- **Spending Trend** — Detects upward / downward / stable trend over the last 3 months
- **Overspending Alert** — Triggers when monthly expenses exceed monthly income
- **Smart Observations** — Dynamic insight cards that appear based on your actual data
- **Monthly Bar Chart** — Side-by-side income vs expense comparison for the last 6 months

### 🎨 UI / UX
- **Fully Responsive** — Mobile-first design; works at 320px, tablet, and desktop
- **Hamburger Sidebar** — Collapsible drawer on mobile with spring animation
- **Animated Active Nav** — Framer Motion `layoutId` sliding highlight follows active page
- **Page Transitions** — Smooth fade + slide up/down on every page change
- **Toast Notifications** — Global success/info/error toasts with spring-in animation and auto-dismiss
- **Skeleton Loaders** — Pulsing placeholders during initial data load
- **Dark / Light Mode** — Class-based (Tailwind v4), persisted in `localStorage`
- **Card Hover Effects** — Scale lift, glow shadow, and gradient overlay on cards
- **Micro-interactions** — Button scale, icon rotation on theme toggle, form transitions

### 🛡️ Role-Based UI
- **Admin Mode** — Full access: add, edit, delete transactions; form visible
- **Viewer Mode** — Read-only access; form and action buttons hidden

### ✅ Form UX
- Required field indicators (red asterisk)
- Real-time validation with red border highlight on error fields
- Inline error messages per field
- Reset on submit; form stays type-consistent after add
- Editing banner: *"Editing transaction — make changes and click Update"*
- Cancel edit restores the empty form

### 🚨 Empty State Handling
- **No transactions** — Shows *"No transactions yet"* with CTA: *"Add your first transaction"*
- **No chart data** — Illustrated placeholder with descriptive text
- **Filters with no results** — *"No transactions match your filters"* with clear-all button
- **localStorage empty or corrupted** — Safe fallback with data validation on every read

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Tailwind CSS | v4 | Styling (class-based dark mode) |
| Framer Motion | 12 | Animations & page transitions |
| Recharts | 3 | Charts (Area, Pie, Bar) |
| Lucide React | 1 | Icon library |
| date-fns | 4 | Date formatting |
| Vite | 7 | Build tool |

---

## 📁 Project Structure

```
src/
├── context/
│   └── FinanceContext.jsx     # Global state: transactions, filters, toast, edit state, computed summary
├── services/
│   └── expense-service.js     # localStorage CRUD + CSV export + data migration
├── utils/
│   ├── constants.js           # Category lists, colors, sort options
│   └── formatters.js          # Currency (₹ INR), date, clamp helpers
├── components/
│   ├── DashboardLayout.jsx    # App shell + global Toast component
│   ├── Sidebar.jsx            # Nav, dark mode toggle, role toggle, mobile drawer
│   ├── SummaryCards.jsx       # Balance / Income / Expenses cards
│   ├── TrendChart.jsx         # Monthly area chart
│   ├── CategoryChart.jsx      # Expense breakdown donut chart
│   ├── TransactionForm.jsx    # Add & Edit form (inline + mobile bottom sheet)
│   ├── TransactionList.jsx    # Filterable list + delete modal
│   └── InsightsPanel.jsx      # Smart analytics cards + bar chart
└── pages/
    ├── DashboardPage.jsx      # Main overview
    ├── TransactionsPage.jsx   # Full transaction management
    └── InsightsPage.jsx       # Analytics page
```

---

## ⚙️ Core Implementation Details

### State Management
All global state lives in `FinanceContext` (React Context + hooks). Key slices:
- `transactions` — loaded from localStorage with validation
- `editingTransaction` — drives the edit-via-form flow across pages
- `toast` — `{ message, type, id }` drives the global notification system
- `summary` — memoized: totals, category breakdowns, monthly comparison, most frequent category
- `filteredTransactions` — memoized: applies search + type + category + sort

### Data Persistence
`expense-service.js` wraps all localStorage operations with:
- Safe JSON parse + array validation on every read
- Corrupted data auto-reset with console warning
- Old data format migration (`expenseTrackerData` → `financeDashboardData`)

### Performance
- `useMemo` on `summary` and `filteredTransactions` — recompute only when `transactions` or `filters` change
- `useCallback` on all handlers to keep references stable
- `AnimatePresence` with `mode="popLayout"` on transaction list for smooth add/remove

### Accessibility
- All interactive elements have `aria-label`
- Form inputs use `htmlFor` / `id` pairs
- Keyboard-navigable with custom focus ring (`outline: 2px solid #10b981`)
- Sufficient color contrast on both light and dark themes

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

---

## 📸 App Pages

| Page | Description |
|---|---|
| **Dashboard** | Summary cards, trend chart, category breakdown, recent transactions |
| **Transactions** | Full CRUD with search, filter, sort, CSV export |
| **Insights** | Smart analytics, monthly comparison, observations, bar chart |
