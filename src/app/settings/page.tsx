'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Download,
  Upload,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notifications: {
      documentExpiry: true,
      stockAlerts: true,
      systemUpdates: false,
    },
    theme: 'light',
    language: 'pt-BR',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Preenchendo dados do formulário com dados do usuário
    setFormData(prev => ({
      ...prev,
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      company: parsedUser.company || '',
    }));
  }, [router]);

  const handleSave = () => {
    // Aqui seria a lógica para salvar as configurações
    alert('Configurações salvas com sucesso!');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'data', label: 'Dados', icon: Database },
  ];

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
    <MainLayout title="Configurações" breadcrumb={['Início', 'Configurações']}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-primary-green" />
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Configurações</h2>
          <p className="text-text-gray">Gerencie suas preferências do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg card-shadow p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-green text-white'
                        : 'text-text-gray hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg card-shadow p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Informações do Perfil</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-2">Empresa</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-md font-medium text-text-dark mb-3">Alterar Senha</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Senha Atual</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">Nova Senha</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Preferências de Notificação</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-dark">Vencimento de Documentos</h4>
                      <p className="text-sm text-text-gray">Receber alertas quando documentos estão próximos do vencimento</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.documentExpiry}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, documentExpiry: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-dark">Alertas de Estoque</h4>
                      <p className="text-sm text-text-gray">Notificações quando EPIs estão com estoque baixo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.stockAlerts}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, stockAlerts: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-dark">Atualizações do Sistema</h4>
                      <p className="text-sm text-text-gray">Receber notificações sobre novas funcionalidades</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.systemUpdates}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, systemUpdates: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Aparência</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-3">Tema</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="radio"
                          id="light"
                          name="theme"
                          value="light"
                          checked={formData.theme === 'light'}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="light"
                          className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-green peer-checked:bg-green-50"
                        >
                          <span className="font-medium">Claro</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="radio"
                          id="dark"
                          name="theme"
                          value="dark"
                          checked={formData.theme === 'dark'}
                          onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor="dark"
                          className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-green peer-checked:bg-green-50"
                        >
                          <span className="font-medium">Escuro</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">Idioma</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Gerenciamento de Dados</h3>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-text-dark mb-2">Exportar Dados</h4>
                    <p className="text-sm text-text-gray mb-4">Baixe todos os seus dados em formato JSON</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Exportar Dados
                    </button>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-text-dark mb-2">Importar Dados</h4>
                    <p className="text-sm text-text-gray mb-4">Importe dados de um backup anterior</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Importar Dados
                    </button>
                  </div>

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800 mb-2">Resetar Configurações</h4>
                    <p className="text-sm text-red-600 mb-4">Restore todas as configurações para o padrão</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Resetar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <button
                onClick={handleSave}
                className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}