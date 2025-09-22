'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  FileText,
  HardHat,
  Users,
  Package
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'document' | 'epi' | 'stock' | 'delivery' | 'system';
  actionUrl?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Documento próximo ao vencimento',
    message: 'PCSMO_TechCorp_2024.pdf vence em 15 dias',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: false,
    category: 'document',
    actionUrl: '/documents',
  },
  {
    id: '2',
    type: 'error',
    title: 'Estoque crítico',
    message: 'Óculos de Proteção com estoque zerado',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
  },
  {
    id: '3',
    type: 'success',
    title: 'Entrega de EPI realizada',
    message: 'EPIs entregues para João Silva Santos',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: true,
    category: 'delivery',
    actionUrl: '/epi/delivery',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Estoque baixo',
    message: 'Cinto de Segurança abaixo do estoque mínimo',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
  },
  {
    id: '5',
    type: 'info',
    title: 'Novo colaborador cadastrado',
    message: 'Fernanda Alves foi adicionada ao sistema',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    read: true,
    category: 'epi',
    actionUrl: '/epi/employees',
  },
  {
    id: '6',
    type: 'error',
    title: 'Documento vencido',
    message: 'LTCAT_Verde_2023.pdf expirou',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 dia atrás
    read: false,
    category: 'document',
    actionUrl: '/documents',
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'warning': return AlertTriangle;
    case 'success': return CheckCircle;
    case 'error': return AlertTriangle;
    case 'info': return Info;
    default: return Info;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'document': return FileText;
    case 'epi': return Users;
    case 'stock': return Package;
    case 'delivery': return HardHat;
    case 'system': return Info;
    default: return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'success': return 'text-green-600 bg-green-50 border-green-200';
    case 'error': return 'text-red-600 bg-red-50 border-red-200';
    case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
};

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'warning' | 'error'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread': return !notif.read;
      case 'warning': return notif.type === 'warning';
      case 'error': return notif.type === 'error';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      <div
        ref={panelRef}
        className="w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-green" />
            <h3 className="font-semibold text-text-dark">Notificações</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-text-gray" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'all'
                  ? 'bg-primary-green text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'unread'
                  ? 'bg-primary-green text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Avisos
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-gray hover:bg-gray-200'
              }`}
            >
              Críticas
            </button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary-green hover:text-green-700"
            >
              Marcar todas como lidas
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-text-gray">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => {
                const NotificationIcon = getNotificationIcon(notification.type);
                const CategoryIcon = getCategoryIcon(notification.category);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      getNotificationColor(notification.type)
                    } ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <NotificationIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryIcon className="w-3 h-3 text-text-gray" />
                          <h4 className="text-sm font-medium text-text-dark truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-text-gray mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text-gray">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-text-gray" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 text-center">
          <button
            onClick={() => window.location.href = '/notifications'}
            className="text-sm text-primary-green hover:text-green-700"
          >
            Ver todas as notificações
          </button>
        </div>
      </div>
    </div>
  );
}