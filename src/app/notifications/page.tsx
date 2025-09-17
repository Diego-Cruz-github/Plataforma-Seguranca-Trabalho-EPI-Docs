'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Bell, 
  Search, 
  Filter,
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  FileText,
  HardHat,
  Users,
  Package,
  CheckSquare,
  Trash2,
  Eye,
  EyeOff,
  Calendar
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
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Documento próximo ao vencimento',
    message: 'PCSMO_TechCorp_2024.pdf vence em 15 dias. Providencie a renovação para manter a conformidade.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    category: 'document',
    actionUrl: '/documents',
    priority: 'high',
  },
  {
    id: '2',
    type: 'error',
    title: 'Estoque crítico - Reposição urgente',
    message: 'Óculos de Proteção Ampla Visão (CA 23456) com estoque zerado. Colaboradores sem proteção adequada.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
    priority: 'critical',
  },
  {
    id: '3',
    type: 'success',
    title: 'Entrega de EPI realizada com sucesso',
    message: 'EPIs entregues para João Silva Santos com biometria facial confirmada.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    category: 'delivery',
    actionUrl: '/epi/delivery',
    priority: 'low',
  },
  {
    id: '4',
    type: 'warning',
    title: 'Estoque baixo detectado',
    message: 'Cinto de Segurança Paraquedista (CA 67890) com 8 unidades, abaixo do mínimo de 10.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: false,
    category: 'stock',
    actionUrl: '/epi/stock',
    priority: 'medium',
  },
  {
    id: '5',
    type: 'info',
    title: 'Novo colaborador cadastrado',
    message: 'Fernanda Alves foi adicionada ao sistema no setor Laboratório.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    category: 'epi',
    actionUrl: '/epi/employees',
    priority: 'low',
  },
  {
    id: '6',
    type: 'error',
    title: 'Documento vencido - Ação necessária',
    message: 'LTCAT_Verde_2023.pdf expirou. Sistema em não conformidade.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
    category: 'document',
    actionUrl: '/documents',
    priority: 'critical',
  },
  {
    id: '7',
    type: 'warning',
    title: 'Entrega de EPI pendente',
    message: 'Carlos Eduardo Lima não recebeu EPIs obrigatórios há 30 dias.',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    read: false,
    category: 'delivery',
    actionUrl: '/epi/delivery',
    priority: 'high',
  },
  {
    id: '8',
    type: 'info',
    title: 'Relatório mensal disponível',
    message: 'Relatório de entregas de EPI do mês anterior está pronto para download.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
    category: 'system',
    priority: 'low',
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
    case 'warning': return 'border-l-yellow-500 bg-yellow-50';
    case 'success': return 'border-l-green-500 bg-green-50';
    case 'error': return 'border-l-red-500 bg-red-50';
    case 'info': return 'border-l-blue-500 bg-blue-50';
    default: return 'border-l-gray-500 bg-gray-50';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
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
  if (diffInDays === 1) return 'Ontem';
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  
  return date.toLocaleDateString('pt-BR');
};

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'warning' | 'error' | 'success' | 'info'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'document' | 'epi' | 'stock' | 'delivery' | 'system'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'unread' && !notif.read) ||
                       (filterType !== 'unread' && notif.type === filterType);
    
    const matchesCategory = filterCategory === 'all' || notif.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || notif.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesCategory && matchesPriority;
  });

  const markAsRead = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notif =>
        notificationIds.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.map(notif =>
        notificationIds.includes(notif.id) ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotifications = (notificationIds: string[]) => {
    setNotifications(prev =>
      prev.filter(notif => !notificationIds.includes(notif.id))
    );
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(visibleIds);
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto"></div>
          <p className="text-text-gray mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout title="Notificações" breadcrumb={['Início', 'Notificações']}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-primary-green" />
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Central de Notificações</h2>
          <p className="text-text-gray">
            {unreadCount} não lidas • {criticalCount} críticas
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Total</p>
              <p className="text-xl font-bold text-text-dark">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Não Lidas</p>
              <p className="text-xl font-bold text-yellow-600">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Críticas</p>
              <p className="text-xl font-bold text-red-600">{criticalCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Lidas</p>
              <p className="text-xl font-bold text-green-600">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 card-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar notificações..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
          >
            <option value="all">Todos os tipos</option>
            <option value="unread">Não lidas</option>
            <option value="error">Erros</option>
            <option value="warning">Avisos</option>
            <option value="success">Sucessos</option>
            <option value="info">Informações</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
          >
            <option value="all">Todas as categorias</option>
            <option value="document">Documentos</option>
            <option value="epi">EPI</option>
            <option value="stock">Estoque</option>
            <option value="delivery">Entregas</option>
            <option value="system">Sistema</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
          >
            <option value="all">Todas as prioridades</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-text-gray">
              {selectedNotifications.length} selecionada(s)
            </span>
            <button
              onClick={() => markAsRead(selectedNotifications)}
              className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              <Eye className="w-4 h-4" />
              Marcar como lida
            </button>
            <button
              onClick={() => markAsUnread(selectedNotifications)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <EyeOff className="w-4 h-4" />
              Marcar como não lida
            </button>
            <button
              onClick={() => deleteNotifications(selectedNotifications)}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
            <button
              onClick={clearSelection}
              className="text-sm text-text-gray hover:text-text-dark"
            >
              Limpar seleção
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg card-shadow">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-dark mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-text-gray">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Select All */}
            <div className="p-4 bg-gray-50">
              <button
                onClick={selectedNotifications.length === filteredNotifications.length ? clearSelection : selectAllVisible}
                className="flex items-center gap-2 text-sm text-primary-green hover:text-green-700"
              >
                <CheckSquare className="w-4 h-4" />
                {selectedNotifications.length === filteredNotifications.length ? 'Desmarcar todas' : 'Selecionar todas visíveis'}
              </button>
            </div>

            {filteredNotifications.map((notification) => {
              const NotificationIcon = getNotificationIcon(notification.type);
              const CategoryIcon = getCategoryIcon(notification.category);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 hover:bg-gray-50 transition-colors ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'bg-blue-50' : 'bg-white'} ${
                    selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary-green' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleSelectNotification(notification.id)}
                      className="mt-1 w-4 h-4 text-primary-green bg-gray-100 border-gray-300 rounded focus:ring-primary-green"
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      <NotificationIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryIcon className="w-4 h-4 text-text-gray" />
                        <h3 className="text-lg font-semibold text-text-dark">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority === 'critical' ? 'Crítica' :
                           notification.priority === 'high' ? 'Alta' :
                           notification.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                      
                      <p className="text-text-gray mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-text-gray">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead([notification.id])}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              Marcar como lida
                            </button>
                          )}
                          {notification.actionUrl && (
                            <button
                              onClick={() => {
                                markAsRead([notification.id]);
                                router.push(notification.actionUrl!);
                              }}
                              className="px-3 py-1 text-sm bg-primary-green text-white rounded hover:bg-green-700"
                            >
                              Ver detalhes
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}