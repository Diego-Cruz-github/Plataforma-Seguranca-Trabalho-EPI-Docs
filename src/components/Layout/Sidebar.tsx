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
  Shield,
  Award,
  Heart,
  Leaf,
  Building2
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
    icon: Building2,
    label: 'Central QSSMA',
    href: '/ehs',
  },
  {
    icon: LayoutDashboard,
    label: 'Dashboard Geral',
    href: '/dashboard',
  },
  {
    icon: Award,
    label: 'Qualidade',
    href: '#',
    disabled: true,
  },
  {
    icon: Heart,
    label: 'Saúde',
    href: '#',
    disabled: true,
  },
  {
    icon: Shield,
    label: 'Segurança',
    href: '/safety',
    submenu: [
      { label: 'Dashboard', href: '/safety' },
      { label: 'Documentos', href: '/documents' },
      { label: 'Colaboradores', href: '/epi/employees' },
      { label: 'EPIs', href: '/epi/items' },
      { label: 'Entrega', href: '/epi/delivery' },
      { label: 'Estoque', href: '/epi/stock' },
    ]
  },
  {
    icon: Leaf,
    label: 'Meio Ambiente',
    href: '#',
    disabled: true,
  },
  {
    icon: Users,
    label: 'Usuários',
    href: '/users',
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

  // Reset expanded menu apenas quando sidebar muda de colapsado para expandido
  useEffect(() => {
    // Não resetar automaticamente quando colapsa, apenas quando expande
  }, [isCollapsed]);

  return (
    <div
      className="fixed left-0 top-0 h-full bg-primary-green text-white z-30"
      style={{ 
        transition: 'none',
        width: isCollapsed ? '6rem' : '16rem'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-green-light">
        <div className="relative group">
          <Link href="/ehs" className={`flex items-center gap-3 hover:bg-primary-green-light rounded-lg p-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center">
              {isCollapsed ? (
                <Shield className="w-10 h-10 text-white" />
              ) : (
                <img 
                  src="/images/ehspro-logo.png" 
                  alt="EHSPro" 
                  className="h-16 w-auto max-w-[200px] object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              )}
            </div>
          </Link>
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100  pointer-events-none whitespace-nowrap z-50">
              EHSPro
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="p-1 hover:bg-primary-green-light rounded flex-shrink-0"
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
            const isDisabled = item.disabled;

            return (
              <li key={item.href}>
                {hasSubmenu ? (
                  <div className="relative group">
                    {isCollapsed ? (
                      <button
                        onClick={() => toggleSubmenu(item.href)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left justify-center
                          ${isActive 
                            ? 'bg-primary-green-light text-white' 
                            : 'text-green-100 hover:bg-primary-green-light hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleSubmenu(item.href)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left
                          ${isActive 
                            ? 'bg-primary-green-light text-white' 
                            : 'text-green-100 hover:bg-primary-green-light hover:text-white'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        />
                      </button>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isExpanded && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100  pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}

                    {/* Submenu Tooltip for collapsed state when expanded */}
                    {isCollapsed && isExpanded && (
                      <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white rounded-lg shadow-lg z-50 min-w-56">
                        <div className="p-4">
                          <div className="font-medium mb-3 text-base">{item.label}</div>
                          <div className="space-y-2">
                            {item.submenu?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-3 py-2 text-sm hover:bg-gray-700 rounded transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="absolute left-0 top-4 transform -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    {isDisabled ? (
                      <div
                        className={`
                          flex items-center gap-3 px-4 py-3 opacity-50 cursor-not-allowed
                          text-green-200
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            <span>{item.label}</span>
                            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Em Breve</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-3 px-4 py-3
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
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100  pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        {isDisabled && <span className="ml-2 text-yellow-300">(Em Breve)</span>}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submenu - só renderiza se não estiver colapsado */}
                {hasSubmenu && isExpanded && !isCollapsed && (
                  <ul className="bg-primary-green-dark">
                    {item.submenu?.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={`
                            block px-12 py-2 text-sm
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
                    flex items-center gap-3 px-4 py-3
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
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100  pointer-events-none whitespace-nowrap z-50">
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