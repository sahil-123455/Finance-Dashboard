import React from 'react';
import { motion } from 'framer-motion';
import InsightsPanel from '../components/InsightsPanel';

const InsightsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Analytics and smart observations about your finances
        </p>
      </div>

      <InsightsPanel />
    </motion.div>
  );
};

export default InsightsPage;
