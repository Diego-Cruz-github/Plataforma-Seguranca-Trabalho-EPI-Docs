'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ViewToggle from '@/components/UI/ViewToggle';
import { mockEPIs, mockEPIDeliveries } from '@/data/mockData';
import { 
  Package, 
  Plus, 
  Minus,
  Search, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Upload,
  ShoppingCart,
  Calendar,
  DollarSign,
  Archive
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const getStockStatus = (current: number, minimum: number) => {
  if (current <= 0) return { status: 'out', label: 'Sem Estoque', color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' };
  if (current <= minimum) return { status: 'low', label: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' };
  return { status: 'ok', label: 'Estoque OK', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' };
};

export default function StockPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [epis, setEpis] = useState(mockEPIs);
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Simular movimentações de estoque baseadas nas entregas
    const stockMovements = mockEPIDeliveries.flatMap(delivery => 
      delivery.episDelivered.map(item => ({
        id: `out_${delivery.id}_${item.epiId}`,
        epiId: item.epiId,
        type: 'out',
        quantity: item.quantity,
        date: delivery.deliveryDate,
        reason: `Entrega para colaborador`,
        user: delivery.deliveredBy,
      }))
    );

    // Adicionar algumas entradas simuladas
    const stockEntries = [
      {
        id: 'in_1',
        epiId: '1',
        type: 'in',
        quantity: 20,
        date: new Date('2024-02-20'),
        reason: 'Compra - Fornecedor XYZ',
        user: 'admin@demo.com',
      },
      {
        id: 'in_2',
        epiId: '2',
        type: 'in',
        quantity: 30,
        date: new Date('2024-02-25'),
        reason: 'Compra - Fornecedor ABC',
        user: 'admin@demo.com',
      },
    ];

    setMovements([...stockEntries, ...stockMovements].sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, [router]);

  const filteredEPIs = epis.filter(epi => {
    const matchesSearch = epi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epi.ca.includes(searchTerm) ||
                         epi.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'low') {
      matchesStatus = epi.currentStock <= epi.minimumStock;
    } else if (filterStatus === 'ok') {
      matchesStatus = epi.currentStock > epi.minimumStock;
    } else if (filterStatus === 'out') {
      matchesStatus = epi.currentStock <= 0;
    }
    
    return matchesSearch && matchesStatus;
  });

  const updateStock = (epiId: string, quantity: number, type: 'in' | 'out') => {
    setEpis(currentEpis => 
      currentEpis.map(epi => 
        epi.id === epiId 
          ? { 
              ...epi, 
              currentStock: type === 'in' 
                ? epi.currentStock + quantity 
                : Math.max(0, epi.currentStock - quantity)
            }
          : epi
      )
    );

    // Adicionar movimento
    const newMovement = {
      id: `${type}_${Date.now()}`,
      epiId,
      type,
      quantity,
      date: new Date(),
      reason: type === 'in' ? 'Entrada manual' : 'Saída manual',
      user: user.email,
    };
    
    setMovements(prev => [newMovement, ...prev]);
  };

  // Dados para gráficos
  const stockByCategory = mockEPIs.reduce((acc, epi) => {
    const existing = acc.find(item => item.category === epi.type);
    if (existing) {
      existing.stock += epi.currentStock;
      existing.value += epi.currentStock * (epi.price || 0);
    } else {
      acc.push({
        category: epi.type,
        stock: epi.currentStock,
        value: epi.currentStock * (epi.price || 0),
      });
    }
    return acc;
  }, [] as any[]);

  const stockStatusData = [
    { status: 'Estoque OK', count: epis.filter(epi => epi.currentStock > epi.minimumStock).length, color: '#10b981' },
    { status: 'Estoque Baixo', count: epis.filter(epi => epi.currentStock <= epi.minimumStock && epi.currentStock > 0).length, color: '#f59e0b' },
    { status: 'Sem Estoque', count: epis.filter(epi => epi.currentStock <= 0).length, color: '#ef4444' },
  ];

  const totalValue = epis.reduce((sum, epi) => sum + (epi.currentStock * (epi.price || 0)), 0);
  const lowStockCount = epis.filter(epi => epi.currentStock <= epi.minimumStock).length;
  const outOfStockCount = epis.filter(epi => epi.currentStock <= 0).length;

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
    <MainLayout title="Controle de Estoque" breadcrumb={['Início', 'EPI', 'Estoque']}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-dark">Controle de Estoque</h2>
            <p className="text-text-gray">Gerencie entrada, saída e níveis de estoque de EPIs</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Relatório
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Pedido de Compra
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Valor Total</p>
              <p className="text-xl font-bold text-green-600">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Total EPIs</p>
              <p className="text-xl font-bold text-text-dark">{epis.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Estoque Baixo</p>
              <p className="text-xl font-bold text-yellow-600">{lowStockCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Sem Estoque</p>
              <p className="text-xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Stock by Category */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Estoque por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#047857" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Status do Estoque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Control */}
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg p-4 card-shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
                <input
                  type="text"
                  placeholder="Buscar EPIs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="ok">Estoque OK</option>
                <option value="low">Estoque Baixo</option>
                <option value="out">Sem Estoque</option>
              </select>
              
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>

          {/* Stock Items */}
          <div className="bg-white rounded-lg card-shadow">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-text-dark">EPI</th>
                      <th className="text-left p-4 font-semibold text-text-dark">Estoque</th>
                      <th className="text-left p-4 font-semibold text-text-dark">Status</th>
                      <th className="text-left p-4 font-semibold text-text-dark">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEPIs.map((epi) => {
                      const stockStatus = getStockStatus(epi.currentStock, epi.minimumStock);
                      
                      return (
                        <tr key={epi.id} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-text-dark">{epi.name}</span>
                              <span className="text-sm text-text-gray">CA {epi.ca}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-dark">{epi.currentStock} un</span>
                              <span className="text-sm text-text-gray">Mín: {epi.minimumStock}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  const quantity = parseInt(prompt('Quantidade de entrada:') || '0');
                                  if (quantity > 0) updateStock(epi.id, quantity, 'in');
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Entrada"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const quantity = parseInt(prompt('Quantidade de saída:') || '0');
                                  if (quantity > 0) updateStock(epi.id, quantity, 'out');
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Saída"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 gap-4">
                {filteredEPIs.map((epi) => {
                  const stockStatus = getStockStatus(epi.currentStock, epi.minimumStock);
                  
                  return (
                    <div key={epi.id} className={`p-4 rounded-lg border-l-4 ${stockStatus.bgColor} ${
                      stockStatus.status === 'out' ? 'border-red-500' :
                      stockStatus.status === 'low' ? 'border-yellow-500' : 'border-green-500'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-text-dark">{epi.name}</h4>
                          <p className="text-sm text-text-gray">CA {epi.ca} - {epi.type}</p>
                          <div className="mt-2">
                            <span className="text-lg font-bold text-text-dark">{epi.currentStock}</span>
                            <span className="text-sm text-text-gray ml-1">/ {epi.minimumStock} mín</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const quantity = parseInt(prompt('Quantidade de entrada:') || '0');
                              if (quantity > 0) updateStock(epi.id, quantity, 'in');
                            }}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                            title="Entrada"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const quantity = parseInt(prompt('Quantidade de saída:') || '0');
                              if (quantity > 0) updateStock(epi.id, quantity, 'out');
                            }}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                            title="Saída"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Movements */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Movimentações Recentes</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {movements.slice(0, 20).map((movement) => {
              const epi = mockEPIs.find(e => e.id === movement.epiId);
              if (!epi) return null;
              
              return (
                <div key={movement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {movement.type === 'in' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-text-dark">{epi.name}</p>
                        <p className="text-sm text-text-gray">{movement.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-text-gray">
                          {movement.date.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}