'use client';

import { Bell, User, Search, ChevronDown, ChevronRight, Settings, Shield, LogOut, ChevronLeft, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationPanel from '../UI/NotificationPanel';

interface HeaderProps {
  isCollapsed: boolean;
  title: string;
  breadcrumb?: string[];
}

const mockNotifications = [
  {
    id: '1',
    type: 'warning',
    title: 'Documento próximo ao vencimento',
    message: 'PCSMO_TechCorp_2024.pdf vence em 15 dias',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    category: 'document',
    actionUrl: '/documents',
  },
  {
    id: '2',
    type: 'error',
    title: 'Estoque crítico',
    message: 'Óculos de Proteção com estoque zerado',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
  },
  {
    id: '3',
    type: 'success',
    title: 'Entrega de EPI realizada',
    message: 'EPIs entregues para João Silva Santos',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    category: 'delivery',
    actionUrl: '/epi/delivery',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Estoque baixo',
    message: 'Cinto de Segurança abaixo do estoque mínimo',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
  },
  {
    id: '5',
    type: 'info',
    title: 'Novo colaborador cadastrado',
    message: 'Fernanda Alves foi adicionada ao sistema',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    category: 'epi',
    actionUrl: '/epi/employees',
  },
  {
    id: '6',
    type: 'error',
    title: 'Documento vencido',
    message: 'LTCAT_Verde_2023.pdf expirou',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    category: 'document',
    actionUrl: '/documents',
  },
];

export default function Header({ isCollapsed, title, breadcrumb = [] }: HeaderProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sistema de navegação simples
  const navigationStructure = [
    { path: '/ehs', title: 'Central QSSMA' },
    { path: '/dashboard', title: 'Dashboard Geral' },
    { path: '/safety', title: 'Segurança' },
    { path: '/documents', title: 'Controle de Documentos' },
    { path: '/epi/employees', title: 'Gestão de Colaboradores' },
    { path: '/epi/items', title: 'Gestão de EPIs' },
    { path: '/epi/delivery', title: 'Entrega de EPI' },
    { path: '/epi/stock', title: 'Controle de Estoque' },
    { path: '/users', title: 'Gestão de Usuários' },
    { path: '/settings', title: 'Configurações' },
  ];

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentIndex = navigationStructure.findIndex(item => item.path === currentPath);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < navigationStructure.length - 1;

  const goBack = () => {
    if (canGoBack) {
      window.location.href = navigationStructure[currentIndex - 1].path;
    }
  };

  const goForward = () => {
    if (canGoForward) {
      window.location.href = navigationStructure[currentIndex + 1].path;
    }
  };

  const refresh = () => {
    window.location.reload();
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

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
        fixed top-0 right-0 h-20 bg-gradient-to-r from-primary-green via-primary-green to-green-700 text-white shadow-lg z-20
        ${isCollapsed ? 'left-24' : 'left-64'}
      `}
      style={{ transition: 'none' }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Breadcrumb Section - Modern ERP Style */}
        <div className="flex items-center space-x-4">
          <div className="w-1 h-12 bg-white/30 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            
            {/* Navegação estilo Windows Explorer */}
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={goBack}
                disabled={!canGoBack}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${
                  canGoBack ? 'text-white cursor-pointer' : 'text-white/40 cursor-not-allowed'
                }`}
                title="Voltar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goForward}
                disabled={!canGoForward}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${
                  canGoForward ? 'text-white cursor-pointer' : 'text-white/40 cursor-not-allowed'
                }`}
                title="Avançar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={refresh}
                className="p-1 rounded hover:bg-white/20 transition-colors text-white cursor-pointer ml-1"
                title="Atualizar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {breadcrumb.length > 0 && (
              <nav className="flex items-center text-sm text-white/70 mt-1">
                {breadcrumb.map((item, index) => (
                  <span key={index} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="w-3 h-3 mx-2 text-white/50" />
                    )}
                    <span className={`${index === breadcrumb.length - 1 ? 'text-white font-medium' : 'hover:text-white cursor-pointer transition-colors'}`}>
                      {item}
                    </span>
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Search Section - Clean White Background */}
        <div className="flex-1 max-w-lg mx-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-green transition-colors" />
            <input
              type="text"
              placeholder="Buscar no EHSPro..."
              className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* User Actions - ERP Professional Style */}
        <div className="flex items-center gap-4">
          {/* Notifications - Glass Morphism */}
          <div className="notification-container relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-200 group"
            >
              <Bell className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/20"></div>

          {/* User Profile - Professional ERP Design */}
          <div className="user-menu-container relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-200">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-white/70 font-medium">
                  {user?.role === 'admin' ? 'Administrador' : 
                   user?.role === 'user' ? 'Usuário' : 
                   user?.role === 'viewer' ? 'Visualizador' : 'Usuário'}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-all duration-200 group-hover:text-white ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu - Enhanced */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200/60 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-dark">{user?.name || 'Usuário'}</p>
                      <p className="text-sm text-text-gray">{user?.email}</p>
                      <p className="text-xs text-primary-green font-medium">
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
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-green/5 transition-colors group"
                  >
                    <Settings className="w-4 h-4 text-text-gray group-hover:text-primary-green" />
                    <span className="text-text-dark font-medium">Configurações</span>
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = '/preferences';
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-green/5 transition-colors group"
                    >
                      <Shield className="w-4 h-4 text-text-gray group-hover:text-primary-green" />
                      <span className="text-text-dark font-medium">Preferências do Sistema</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100/60 my-2"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                    <span className="text-red-600 font-medium">Sair do Sistema</span>
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
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </header>
  );
}