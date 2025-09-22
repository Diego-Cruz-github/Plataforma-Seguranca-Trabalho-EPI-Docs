'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  HardHat,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface User {
  role: string;
  [key: string]: any;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Users,
    label: 'Usuários',
    href: '/users',
  },
  {
    icon: FileText,
    label: 'Documentos',
    href: '/documents',
  },
  {
    icon: HardHat,
    label: 'Gestão EPI',
    href: '/epi',
    submenu: [
      { label: 'Colaboradores', href: '/epi/employees' },
      { label: 'EPIs', href: '/epi/items' },
      { label: 'Entrega', href: '/epi/delivery' },
      { label: 'Estoque', href: '/epi/stock' },
    ]
  },
  {
    icon: Settings,
    label: 'Configurações',
    href: '/settings',
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleSubmenu = (href: string) => {
    setExpandedMenu(expandedMenu === href ? null : href);
  };

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-primary-green text-white transition-all duration-300 z-30
        ${isCollapsed ? 'w-24' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-green-light">
        <div className="relative group">
          <Link href="/dashboard" className={`flex items-center gap-3 hover:bg-primary-green-light rounded-lg p-2 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
            <Shield className="w-8 h-8 text-white" />
            {!isCollapsed && (
              <div>
                <h1 className="text-sm font-bold leading-tight">Plataforma Segurança</h1>
                <p className="text-xs text-green-200">Trabalho e Saúde Ocupacional</p>
              </div>
            )}
          </Link>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Voltar ao Dashboard
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="p-1 hover:bg-primary-green-light rounded transition-colors flex-shrink-0"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === item.href;

            return (
              <li key={item.href}>
                {hasSubmenu ? (
                  <div className="relative group">
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                        ${isActive 
                          ? 'bg-primary-green-light text-white' 
                          : 'text-green-100 hover:bg-primary-green-light hover:text-white'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                          />
                        </>
                      )}
                    </button>
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 transition-colors
                        ${isActive 
                          ? 'bg-primary-green-light text-white' 
                          : 'text-green-100 hover:bg-primary-green-light hover:text-white'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <ul className="bg-primary-green-dark">
                    {item.submenu?.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={`
                            block px-12 py-2 text-sm transition-colors
                            ${pathname === subItem.href
                              ? 'bg-primary-green-light text-white'
                              : 'text-green-200 hover:bg-primary-green-light hover:text-white'
                            }
                          `}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Submenu Tooltip for collapsed state with expanded submenu */}
                {hasSubmenu && isExpanded && isCollapsed && (
                  <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 min-w-48">
                    <div className="p-3">
                      <div className="font-medium mb-2">{item.label}</div>
                      <div className="space-y-1">
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-2 py-1 text-xs hover:bg-gray-700 rounded transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="absolute left-0 top-4 transform -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </li>
            );
          })}
          
          {/* Preferências - apenas para admin */}
          {user?.role === 'admin' && (
            <li>
              <div className="relative group">
                <Link
                  href="/preferences"
                  className={`
                    flex items-center gap-3 px-4 py-3 transition-colors
                    ${pathname === '/preferences'
                      ? 'bg-red-600 text-white' 
                      : 'text-green-100 hover:bg-red-600 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>Preferências</span>}
                </Link>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Preferências
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}