import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      {/* Main content area with left margin for sidebar on desktop */}
      <main className="md:ml-60 lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
