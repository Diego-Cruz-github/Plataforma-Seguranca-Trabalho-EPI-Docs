'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import KPICard from '@/components/Dashboard/KPICard';
import { 
  mockEmployees, 
  mockEPIs, 
  mockEPIDeliveries, 
  mockSectors, 
  mockPositions, 
  mockRisks 
} from '@/data/mockData';
import {
  HardHat,
  Users,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle,
  Calendar,
  TrendingUp,
  DollarSign,
  Shield,
  Briefcase,
  Target
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
  Area,
  AreaChart
} from 'recharts';

export default function EPIDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // Calcular KPIs
  const totalEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const totalEPIs = mockEPIs.length;
  const totalDeliveries = mockEPIDeliveries.length;
  const lowStockEPIs = mockEPIs.filter(epi => epi.currentStock <= epi.minimumStock).length;
  const outOfStockEPIs = mockEPIs.filter(epi => epi.currentStock <= 0).length;
  const totalStockValue = mockEPIs.reduce((sum, epi) => sum + (epi.currentStock * (epi.price || 0)), 0);

  // Dados para gráficos
  const deliveriesByMonth = [
    { month: 'Jan', deliveries: 8, employees: 12 },
    { month: 'Fev', deliveries: 12, employees: 18 },
    { month: 'Mar', deliveries: 15, employees: 22 },
    { month: 'Abr', deliveries: 10, employees: 15 },
    { month: 'Mai', deliveries: 18, employees: 25 },
    { month: 'Jun', deliveries: 14, employees: 20 },
  ];

  const stockByCategory = mockEPIs.reduce((acc, epi) => {
    const existing = acc.find(item => item.category === epi.type);
    if (existing) {
      existing.stock += epi.currentStock;
      existing.items += 1;
    } else {
      acc.push({
        category: epi.type,
        stock: epi.currentStock,
        items: 1,
      });
    }
    return acc;
  }, [] as any[]);

  const stockStatusData = [
    { 
      status: 'OK', 
      count: mockEPIs.filter(epi => epi.currentStock > epi.minimumStock).length, 
      color: '#10b981' 
    },
    { 
      status: 'Baixo', 
      count: mockEPIs.filter(epi => epi.currentStock <= epi.minimumStock && epi.currentStock > 0).length, 
      color: '#f59e0b' 
    },
    { 
      status: 'Vazio', 
      count: mockEPIs.filter(epi => epi.currentStock <= 0).length, 
      color: '#ef4444' 
    },
  ];

  const sectorDistribution = mockEmployees.reduce((acc, emp) => {
    const existing = acc.find(item => item.sector === emp.sector);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ sector: emp.sector, count: 1 });
    }
    return acc;
  }, [] as any[]);

  const topEPIsDelivered = mockEPIDeliveries
    .flatMap(delivery => delivery.episDelivered)
    .reduce((acc, item) => {
      const epi = mockEPIs.find(e => e.id === item.epiId);
      if (epi) {
        const existing = acc.find(i => i.id === item.epiId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push({
            id: item.epiId,
            name: epi.name,
            ca: epi.ca,
            quantity: item.quantity,
          });
        }
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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
    <MainLayout title="Dashboard EPI" breadcrumb={['Início', 'EPI', 'Dashboard']}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <HardHat className="w-8 h-8 text-primary-green" />
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Dashboard EPI</h2>
          <p className="text-text-gray">Visão geral da gestão de equipamentos de proteção individual</p>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Colaboradores Ativos"
          value={totalEmployees}
          icon={Users}
          color="blue"
          trend={{ value: 8, isPositive: true }}
          onClick={() => router.push('/epi/employees')}
        />
        <KPICard
          title="Total de EPIs"
          value={totalEPIs}
          icon={Package}
          color="green"
          trend={{ value: 12, isPositive: true }}
          onClick={() => router.push('/epi/items')}
        />
        <KPICard
          title="Entregas Realizadas"
          value={totalDeliveries}
          icon={Truck}
          color="purple"
          trend={{ value: 25, isPositive: true }}
          onClick={() => router.push('/epi/delivery')}
        />
        <KPICard
          title="Alertas de Estoque"
          value={lowStockEPIs}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 15, isPositive: false }}
          onClick={() => router.push('/epi/stock')}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-text-dark">Valor do Estoque</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-text-gray mt-1">Valor total em estoque</p>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-text-dark">Setores Cadastrados</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{mockSectors.length}</p>
          <p className="text-sm text-text-gray mt-1">Setores com EPIs obrigatórios</p>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-text-dark">Funções/Riscos</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{mockPositions.length + mockRisks.length}</p>
          <p className="text-sm text-text-gray mt-1">Funções e riscos mapeados</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Deliveries by Month */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Entregas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={deliveriesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="deliveries" stackId="1" stroke="#047857" fill="#047857" />
              <Area type="monotone" dataKey="employees" stackId="1" stroke="#0369a1" fill="#0369a1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Status */}
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        {/* Employees by Sector */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Colaboradores por Setor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0369a1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top EPIs Delivered */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">EPIs Mais Entregues</h3>
          <div className="space-y-3">
            {topEPIsDelivered.map((epi, index) => (
              <div key={epi.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-dark">{epi.name}</p>
                  <p className="text-sm text-text-gray">CA {epi.ca}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-green">{epi.quantity}</p>
                  <p className="text-sm text-text-gray">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Alertas Recentes</h3>
          <div className="space-y-3">
            {mockEPIs
              .filter(epi => epi.currentStock <= epi.minimumStock)
              .slice(0, 5)
              .map((epi) => (
                <div key={epi.id} className="flex items-center gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-text-dark">{epi.name}</p>
                    <p className="text-sm text-text-gray">
                      Estoque: {epi.currentStock} / Mín: {epi.minimumStock}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/epi/stock')}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Ver
                  </button>
                </div>
              ))}
            
            {outOfStockEPIs > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-100 border-l-4 border-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <div className="flex-1">
                  <p className="font-medium text-red-800">EPIs sem estoque</p>
                  <p className="text-sm text-red-600">{outOfStockEPIs} itens precisam de reposição urgente</p>
                </div>
                <button
                  onClick={() => router.push('/epi/stock?filter=out')}
                  className="text-red-700 hover:text-red-800 text-sm font-medium"
                >
                  Verificar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}