'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ViewToggle from '@/components/UI/ViewToggle';
import { mockDocuments, mockCompanies } from '@/data/mockData';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'valid': return 'bg-green-100 text-green-800';
    case 'expiring': return 'bg-yellow-100 text-yellow-800';
    case 'expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'valid': return CheckCircle;
    case 'expiring': return Clock;
    case 'expired': return AlertTriangle;
    default: return FileText;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'valid': return 'Válido';
    case 'expiring': return 'A Vencer';
    case 'expired': return 'Vencido';
    default: return status;
  }
};

const getCompanyName = (companyId: string) => {
  const company = mockCompanies.find(c => c.id === companyId);
  return company?.name || 'Empresa não encontrada';
};

const getUnitName = (companyId: string, unitId: string) => {
  const company = mockCompanies.find(c => c.id === companyId);
  const unit = company?.units.find(u => u.id === unitId);
  return unit?.name || 'Unidade não encontrada';
};

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents] = useState(mockDocuments);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getCompanyName(doc.companyId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getUnitName(doc.companyId, doc.unitId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
    <MainLayout title="Controle de Documentos" breadcrumb={['Início', 'Documentos']}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-dark">Documentos</h2>
            <p className="text-text-gray">Gerencie documentos de segurança do trabalho</p>
          </div>
        </div>
        
        <button className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Documento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 card-shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
            <input
              type="text"
              placeholder="Buscar documentos..."
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
            <option value="PGR">PGR</option>
            <option value="PCSMO">PCSMO</option>
            <option value="LTCAT">LTCAT</option>
            <option value="CUSTOM">Personalizado</option>
          </select>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os status</option>
            <option value="valid">Válidos</option>
            <option value="expiring">A Vencer</option>
            <option value="expired">Vencidos</option>
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
                  <th className="text-left p-4 font-semibold text-text-dark">Documento</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Tipo</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Empresa/Unidade</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Status</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Validade</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Upload</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const StatusIcon = getStatusIcon(doc.status);
                  return (
                    <tr key={doc.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary-green" />
                          <span className="font-medium text-text-dark">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-sm">
                            <Building2 className="w-3 h-3" />
                            <span className="font-medium">{getCompanyName(doc.companyId)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-text-gray">
                            <MapPin className="w-3 h-3" />
                            <span>{getUnitName(doc.companyId, doc.unitId)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-text-gray" />
                          <span className="text-sm text-text-gray">
                            {doc.validityDate.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-text-gray">
                        {doc.uploadDate.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                            <Download className="w-4 h-4" />
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
          {filteredDocuments.map((doc) => {
            const StatusIcon = getStatusIcon(doc.status);
            return (
              <div key={doc.id} className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-green" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark line-clamp-2">{doc.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {doc.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusLabel(doc.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-text-gray" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-dark">
                        {getCompanyName(doc.companyId)}
                      </span>
                      <span className="text-xs text-text-gray">
                        {getUnitName(doc.companyId, doc.unitId)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-gray" />
                    <div className="flex flex-col">
                      <span className="text-xs text-text-gray">Validade</span>
                      <span className="text-sm font-medium text-text-dark">
                        {doc.validityDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-text-gray" />
                    <div className="flex flex-col">
                      <span className="text-xs text-text-gray">Upload</span>
                      <span className="text-sm font-medium text-text-dark">
                        {doc.uploadDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-dark mb-2">Nenhum documento encontrado</h3>
          <p className="text-text-gray">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
}