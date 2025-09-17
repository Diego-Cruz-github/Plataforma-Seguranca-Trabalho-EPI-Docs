'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string[];
}

export default function MainLayout({ children, title, breadcrumb }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-bg-gray">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Header isCollapsed={sidebarCollapsed} title={title} breadcrumb={breadcrumb} />
      
      <main
        className={`
          transition-all duration-300 pt-16
          ${sidebarCollapsed ? 'ml-24' : 'ml-64'}
        `}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}