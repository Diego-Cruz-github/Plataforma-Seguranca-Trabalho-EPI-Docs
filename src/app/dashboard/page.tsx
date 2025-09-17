'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import KPICard from '@/components/Dashboard/KPICard';
import { mockDashboardKPIs } from '@/data/mockData';
import {
  FileText,
  Users,
  HardHat,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Package,
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

const documentsByTypeData = [
  { name: 'PGR', value: 3, color: '#047857' },
  { name: 'PCSMO', value: 2, color: '#059669' },
  { name: 'LTCAT', value: 2, color: '#10b981' },
  { name: 'Outros', value: 1, color: '#34d399' },
];

const episDeliveryData = [
  { month: 'Jan', entregas: 35 },
  { month: 'Fev', entregas: 42 },
  { month: 'Mar', entregas: 38 },
  { month: 'Abr', entregas: 45 },
  { month: 'Mai', entregas: 52 },
  { month: 'Jun', entregas: 48 },
];

const documentStatusData = [
  { status: 'Válidos', count: 5, color: '#10b981' },
  { status: 'A Vencer', count: 1, color: '#f59e0b' },
  { status: 'Vencidos', count: 2, color: '#ef4444' },
];

export default function DashboardPage() {
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
    <MainLayout title="Dashboard" breadcrumb={['Início', 'Dashboard']}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total de Documentos"
          value={mockDashboardKPIs.totalDocuments}
          icon={FileText}
          color="blue"
          trend={{ value: 12, isPositive: true }}
          onClick={() => router.push('/documents')}
        />
        <KPICard
          title="Colaboradores Ativos"
          value={mockDashboardKPIs.totalEmployees}
          icon={Users}
          color="green"
          trend={{ value: 8, isPositive: true }}
          onClick={() => router.push('/epi/employees')}
        />
        <KPICard
          title="EPIs Entregues (Mês)"
          value={mockDashboardKPIs.episDeliveredThisMonth}
          icon={HardHat}
          color="purple"
          trend={{ value: 15, isPositive: true }}
          onClick={() => router.push('/epi/delivery')}
        />
        <KPICard
          title="Alertas de Estoque"
          value={mockDashboardKPIs.lowStockEPIs}
          icon={AlertTriangle}
          color="red"
          trend={{ value: 2, isPositive: false }}
          onClick={() => router.push('/epi/stock')}
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-text-dark">Documentos Válidos</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{mockDashboardKPIs.validDocuments}</p>
          <p className="text-sm text-text-gray mt-1">Em conformidade</p>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-text-dark">A Vencer (30 dias)</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{mockDashboardKPIs.expiringDocuments}</p>
          <p className="text-sm text-text-gray mt-1">Requer atenção</p>
        </div>

        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-text-dark">Documentos Vencidos</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">{mockDashboardKPIs.expiredDocuments}</p>
          <p className="text-sm text-text-gray mt-1">Ação necessária</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Documents by Type */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Documentos por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentsByTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {documentsByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* EPI Deliveries */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <h3 className="text-lg font-semibold text-text-dark mb-4">Entregas de EPI por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={episDeliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="entregas" 
                stroke="#047857" 
                strokeWidth={3}
                dot={{ fill: '#047857', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Document Status Chart */}
      <div className="bg-white rounded-lg p-6 card-shadow">
        <h3 className="text-lg font-semibold text-text-dark mb-4">Status dos Documentos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={documentStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#047857">
              {documentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </MainLayout>
  );
}