'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ViewToggle from '@/components/UI/ViewToggle';
import { mockEPIs } from '@/data/mockData';
import { 
  HardHat, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  Package,
  DollarSign,
  Calendar,
  Shield,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react';

const getStockStatus = (current: number, minimum: number) => {
  if (current <= 0) return { status: 'out', label: 'Sem Estoque', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
  if (current <= minimum) return { status: 'low', label: 'Estoque Baixo', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
  return { status: 'ok', label: 'Estoque OK', color: 'bg-green-100 text-green-800', icon: CheckCircle };
};

export default function EPIItemsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [epis] = useState(mockEPIs);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const filteredEPIs = epis.filter(epi => {
    const matchesSearch = epi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         epi.ca.includes(searchTerm) ||
                         epi.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || epi.type === filterType;
    
    let matchesStock = true;
    if (filterStock === 'low') {
      matchesStock = epi.currentStock <= epi.minimumStock;
    } else if (filterStock === 'ok') {
      matchesStock = epi.currentStock > epi.minimumStock;
    } else if (filterStock === 'out') {
      matchesStock = epi.currentStock <= 0;
    }
    
    return matchesSearch && matchesType && matchesStock;
  });

  const uniqueTypes = [...new Set(epis.map(epi => epi.type))];
  const lowStockCount = epis.filter(epi => epi.currentStock <= epi.minimumStock).length;
  const outOfStockCount = epis.filter(epi => epi.currentStock <= 0).length;
  const totalValue = epis.reduce((sum, epi) => sum + (epi.currentStock * (epi.price || 0)), 0);

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
    <MainLayout title="Gestão de EPIs" breadcrumb={['Início', 'EPI', 'EPIs']}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <HardHat className="w-8 h-8 text-primary-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-dark">EPIs</h2>
            <p className="text-text-gray">Gerencie equipamentos de proteção individual</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo EPI
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 card-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar por nome, CA, tipo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Todos os tipos</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
          >
            <option value="all">Todos os estoques</option>
            <option value="ok">Estoque OK</option>
            <option value="low">Estoque Baixo</option>
            <option value="out">Sem Estoque</option>
          </select>
          
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-text-dark">EPI</th>
                  <th className="text-left p-4 font-semibold text-text-dark">CA / Tipo</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Estoque</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Status</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Preço</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Valor Total</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEPIs.map((epi) => {
                  const stockStatus = getStockStatus(epi.currentStock, epi.minimumStock);
                  const StatusIcon = stockStatus.icon;
                  
                  return (
                    <tr key={epi.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <HardHat className="w-5 h-5 text-primary-green" />
                          </div>
                          <span className="font-medium text-text-dark">{epi.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded w-fit">
                            CA {epi.ca}
                          </span>
                          <span className="text-sm text-text-gray mt-1">{epi.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-dark">{epi.currentStock} un</span>
                          <span className="text-sm text-text-gray">Mín: {epi.minimumStock}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-text-dark">
                        R$ {(epi.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 font-semibold text-text-dark">
                        R$ {(epi.currentStock * (epi.price || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Consultar CA">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded" title="Editar">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEPIs.map((epi) => {
            const stockStatus = getStockStatus(epi.currentStock, epi.minimumStock);
            const StatusIcon = stockStatus.icon;
            
            return (
              <div key={epi.id} className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <HardHat className="w-6 h-6 text-primary-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark line-clamp-2">{epi.name}</h3>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        CA {epi.ca}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-text-gray" />
                    <span className="text-sm text-text-dark">{epi.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-text-gray">Estoque Atual</span>
                      <p className="font-semibold text-text-dark">{epi.currentStock} un</p>
                    </div>
                    <div>
                      <span className="text-xs text-text-gray">Estoque Mínimo</span>
                      <p className="font-semibold text-text-dark">{epi.minimumStock} un</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-text-gray">Preço Unitário</span>
                      <p className="font-semibold text-green-600">
                        R$ {(epi.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-text-gray">Valor Total</span>
                      <p className="font-semibold text-green-600">
                        R$ {(epi.currentStock * (epi.price || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-gray" />
                    <div className="flex flex-col">
                      <span className="text-xs text-text-gray">Cadastrado em</span>
                      <span className="text-sm font-medium text-text-dark">
                        {epi.createdAt.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <button 
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    title="Consultar CA"
                  >
                    <ExternalLink className="w-4 h-4" />
                    CA
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {filteredEPIs.length === 0 && (
        <div className="text-center py-12">
          <HardHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-dark mb-2">Nenhum EPI encontrado</h3>
          <p className="text-text-gray">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
}