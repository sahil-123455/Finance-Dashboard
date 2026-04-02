import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';
import { migrateOldData } from './services/expense-service';

// Migrate old data on first load
migrateOldData();

const PageRouter = () => {
  const { activePage } = useFinance();

  return (
    <AnimatePresence mode="wait">
      {activePage === 'dashboard' && <DashboardPage key="dashboard" />}
      {activePage === 'transactions' && <TransactionsPage key="transactions" />}
      {activePage === 'insights' && <InsightsPage key="insights" />}
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <FinanceProvider>
      <DashboardLayout>
        <PageRouter />
      </DashboardLayout>
    </FinanceProvider>
  );
};

export default App;