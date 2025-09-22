'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ViewToggle from '@/components/UI/ViewToggle';
import { mockEmployees, mockCompanies } from '@/data/mockData';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  Building2,
  MapPin,
  Briefcase,
  Download,
  Upload
} from 'lucide-react';

const getCompanyName = (companyId: string) => {
  const company = mockCompanies.find(c => c.id === companyId);
  return company?.name || 'Empresa não encontrada';
};

const getUnitName = (companyId: string, unitId: string) => {
  const company = mockCompanies.find(c => c.id === companyId);
  const unit = company?.units.find(u => u.id === unitId);
  return unit?.name || 'Unidade não encontrada';
};

export default function EmployeesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [employees] = useState(mockEmployees);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.cpf.includes(searchTerm) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCompanyName(employee.companyId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = filterSector === 'all' || employee.sector === filterSector;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  const uniqueSectors = [...new Set(employees.map(emp => emp.sector))];

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
    <MainLayout title="Gestão de Colaboradores" breadcrumb={['Início', 'EPI', 'Colaboradores']}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-dark">Colaboradores</h2>
            <p className="text-text-gray">Gerencie colaboradores para entregas de EPI</p>
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
            Novo Colaborador
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 card-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF, função..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
          >
            <option value="all">Todos os setores</option>
            {uniqueSectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Total</p>
              <p className="text-xl font-bold text-text-dark">{employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Ativos</p>
              <p className="text-xl font-bold text-green-600">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Inativos</p>
              <p className="text-xl font-bold text-red-600">
                {employees.filter(emp => emp.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-text-gray">Setores</p>
              <p className="text-xl font-bold text-purple-600">{uniqueSectors.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-text-dark">Colaborador</th>
                  <th className="text-left p-4 font-semibold text-text-dark">CPF</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Setor/Função</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Empresa/Unidade</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Status</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Cadastro</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-text-gray" />
                        </div>
                        <span className="font-medium text-text-dark">{employee.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-gray font-mono">{employee.cpf}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-text-dark">{employee.sector}</span>
                        <span className="text-sm text-text-gray">{employee.position}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm">
                          <Building2 className="w-3 h-3" />
                          <span className="font-medium">{getCompanyName(employee.companyId)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-gray">
                          <MapPin className="w-3 h-3" />
                          <span>{getUnitName(employee.companyId, employee.unitId)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {employee.status === 'active' ? (
                          <UserCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <UserX className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-gray">
                      {employee.createdAt.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-text-gray" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{employee.name}</h3>
                    <p className="text-sm text-text-gray font-mono">{employee.cpf}</p>
                  </div>
                </div>
                
                {employee.status === 'active' ? (
                  <UserCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <UserX className="w-5 h-5 text-red-600" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-text-gray" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-dark">{employee.sector}</span>
                    <span className="text-xs text-text-gray">{employee.position}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-text-gray" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-dark">
                      {getCompanyName(employee.companyId)}
                    </span>
                    <span className="text-xs text-text-gray">
                      {getUnitName(employee.companyId, employee.unitId)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-text-gray">Cadastrado em</span>
                    <span className="text-sm font-medium text-text-dark">
                      {employee.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => router.push(`/epi/delivery?employee=${employee.id}`)}
                  className="flex-1 bg-primary-green text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  Entregar EPI
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-dark mb-2">Nenhum colaborador encontrado</h3>
          <p className="text-text-gray">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
}