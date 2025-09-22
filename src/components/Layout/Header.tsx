'use client';

import { Bell, User, Search, ChevronDown, Settings, Shield, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationPanel from '../UI/NotificationPanel';

interface HeaderProps {
  isCollapsed: boolean;
  title: string;
  breadcrumb?: string[];
}

export default function Header({ isCollapsed, title, breadcrumb = [] }: HeaderProps) {
  const [notifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fechar menus ao clicar fora
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-white border-b border-border-gray z-20 transition-all duration-300
        ${isCollapsed ? 'left-24' : 'left-64'}
      `}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Breadcrumb */}
        <div>
          <h1 className="text-xl font-semibold text-text-dark">{title}</h1>
          {breadcrumb.length > 0 && (
            <nav className="text-sm text-text-gray">
              {breadcrumb.map((item, index) => (
                <span key={index}>
                  {index > 0 && ' / '}
                  {item}
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="notification-container">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-text-gray hover:text-primary-green transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="user-menu-container relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-4 border-l border-border-gray hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-text-dark">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-text-gray">
                  {user?.role === 'admin' ? 'Administrador' : 
                   user?.role === 'user' ? 'Usuário' : 
                   user?.role === 'viewer' ? 'Visualizador' : 'Usuário'}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-text-gray transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-text-dark">{user?.name || 'Usuário'}</p>
                      <p className="text-sm text-text-gray">{user?.email}</p>
                      <p className="text-xs text-text-gray">
                        {user?.role === 'admin' ? 'Administrador' : 
                         user?.role === 'user' ? 'Usuário' : 
                         user?.role === 'viewer' ? 'Visualizador' : 'Usuário'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      window.location.href = '/settings';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-text-gray" />
                    <span className="text-text-dark">Configurações</span>
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = '/preferences';
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-text-dark">Preferências do Sistema</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
}