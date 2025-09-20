'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string[];
}

export default function MainLayout({ children, title, breadcrumb }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Inicializar com valor do localStorage se disponível
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado após primeira renderização
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    // Salvar no localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };


  // Se não hidratou ainda, não renderizar para evitar flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-bg-gray">
        <div 
          className="fixed left-0 top-0 h-full bg-primary-green text-white z-30"
          style={{ width: sidebarCollapsed ? '6rem' : '16rem' }}
        />
        <main 
          className="pt-20"
          style={{ 
            marginLeft: sidebarCollapsed ? '6rem' : '16rem',
            transition: 'none'
          }}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-gray">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Header isCollapsed={sidebarCollapsed} title={title} breadcrumb={breadcrumb} />
      
      <main
        data-main-layout
        className="pt-20"
        style={{ 
          transition: 'none',
          marginLeft: sidebarCollapsed ? '6rem' : '16rem'
        }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}