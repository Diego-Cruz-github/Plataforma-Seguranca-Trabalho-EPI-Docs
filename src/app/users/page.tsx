'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import ViewToggle from '@/components/UI/ViewToggle';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  Eye
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  company: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@demo.com',
    role: 'admin',
    company: 'Cia Modelo Ltda',
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'João Silva Santos',
    email: 'user@demo.com',
    role: 'user',
    company: 'Cia Modelo Ltda',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Maria Oliveira Costa',
    email: 'viewer@demo.com',
    role: 'viewer',
    company: 'TechCorp Industrial',
    status: 'active',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Carlos Eduardo Lima',
    email: 'carlos@demo.com',
    role: 'user',
    company: 'Verde Segurança',
    status: 'inactive',
    createdAt: new Date('2024-02-01'),
  },
];

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'user': return 'Usuário';
    case 'viewer': return 'Visualizador';
    default: return role;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800';
    case 'user': return 'bg-blue-100 text-blue-800';
    case 'viewer': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'user': return Users;
    case 'viewer': return Eye;
    default: return Users;
  }
};

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <MainLayout title="Gestão de Usuários" breadcrumb={['Início', 'Usuários']}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-green" />
          <div>
            <h2 className="text-2xl font-bold text-text-dark">Usuários</h2>
            <p className="text-text-gray">Gerencie usuários do sistema</p>
          </div>
        </div>
        
        {user.role === 'admin' && (
          <button className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-text-dark">Nome</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Email</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Nível</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Empresa</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Status</th>
                  <th className="text-left p-4 font-semibold text-text-dark">Criado em</th>
                  {user.role === 'admin' && (
                    <th className="text-left p-4 font-semibold text-text-dark">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => {
                  const RoleIcon = getRoleIcon(userItem.role);
                  return (
                    <tr key={userItem.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-text-gray" />
                          </div>
                          <span className="font-medium text-text-dark">{userItem.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-gray">{userItem.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <RoleIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                            {getRoleLabel(userItem.role)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-text-gray">{userItem.company}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {userItem.status === 'active' ? (
                            <UserCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <UserX className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userItem.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userItem.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-text-gray">
                        {userItem.createdAt.toLocaleDateString('pt-BR')}
                      </td>
                      {user.role === 'admin' && (
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
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((userItem) => {
            const RoleIcon = getRoleIcon(userItem.role);
            return (
              <div key={userItem.id} className="bg-white rounded-lg p-6 card-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-text-gray" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-dark">{userItem.name}</h3>
                      <p className="text-sm text-text-gray">{userItem.email}</p>
                    </div>
                  </div>
                  
                  {userItem.status === 'active' ? (
                    <UserCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RoleIcon className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                      {getRoleLabel(userItem.role)}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-gray">Empresa</p>
                    <p className="font-medium text-text-dark">{userItem.company}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-gray">Criado em</p>
                    <p className="font-medium text-text-dark">
                      {userItem.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-dark mb-2">Nenhum usuário encontrado</h3>
          <p className="text-text-gray">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
}