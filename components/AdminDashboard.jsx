'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import CustomerUpload from './CustomerUpload';
import EmailComposer from './EmailComposer';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <CustomerUpload />;
      case 'compose':
        return <EmailComposer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 