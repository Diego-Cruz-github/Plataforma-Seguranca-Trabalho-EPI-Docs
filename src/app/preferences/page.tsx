'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Settings, 
  Shield, 
  Database, 
  Mail, 
  Zap, 
  Users,
  FileText,
  HardHat,
  AlertTriangle,
  Save,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

export default function PreferencesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('system');
  const [preferences, setPreferences] = useState({
    system: {
      maintenanceMode: false,
      autoBackup: true,
      logRetention: 30,
      sessionTimeout: 60,
    },
    security: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
      maxLoginAttempts: 3,
      twoFactorAuth: false,
      apiRateLimit: 100,
    },
    email: {
      smtpServer: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      emailNotifications: true,
      alertEmails: ['admin@empresa.com'],
    },
    documents: {
      maxFileSize: 50, // MB
      allowedFormats: ['pdf', 'doc', 'docx'],
      autoDeleteExpired: false,
      expiryWarningDays: 30,
    },
    epi: {
      stockAlertThreshold: 20,
      biometricRequired: true,
      autoGeneratePDF: true,
      defaultDeliveryDays: 365,
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Verificar se é admin
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [router]);

  const handleSave = () => {
    // Aqui seria a lógica para salvar as preferências do sistema
    alert('Preferências do sistema salvas com sucesso!');
  };

  const sections = [
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'epi', label: 'EPI', icon: HardHat },
  ];

  if (!user || user.role !== 'admin') {
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
    <MainLayout title="Preferências do Sistema" breadcrumb={['Início', 'Preferências']}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Preferências do Sistema</h2>
          <p className="text-text-gray">Configurações avançadas - Apenas Administradores</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">Atenção</h3>
          <p className="text-sm text-yellow-700">
            Estas configurações afetam todo o sistema. Alterações inadequadas podem causar instabilidade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg card-shadow p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-red-600 text-white'
                        : 'text-text-gray hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg card-shadow p-6">
            {activeSection === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Configurações do Sistema</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-text-dark">Modo Manutenção</h4>
                        <p className="text-sm text-text-gray">Bloquear acesso para manutenção</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.system.maintenanceMode}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            system: { ...prev.system, maintenanceMode: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-text-dark">Backup Automático</h4>
                        <p className="text-sm text-text-gray">Backup diário dos dados</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.system.autoBackup}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            system: { ...prev.system, autoBackup: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Retenção de Logs (dias)
                      </label>
                      <input
                        type="number"
                        value={preferences.system.logRetention}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          system: { ...prev.system, logRetention: parseInt(e.target.value) }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Timeout de Sessão (minutos)
                      </label>
                      <input
                        type="number"
                        value={preferences.system.sessionTimeout}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          system: { ...prev.system, sessionTimeout: parseInt(e.target.value) }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Configurações de Segurança</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-text-dark mb-4">Política de Senhas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Tamanho Mínimo
                        </label>
                        <input
                          type="number"
                          value={preferences.security.passwordPolicy.minLength}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              passwordPolicy: {
                                ...prev.security.passwordPolicy,
                                minLength: parseInt(e.target.value)
                              }
                            }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Tentativas Máximas de Login
                        </label>
                        <input
                          type="number"
                          value={preferences.security.maxLoginAttempts}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                          }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="uppercase"
                          checked={preferences.security.passwordPolicy.requireUppercase}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              passwordPolicy: {
                                ...prev.security.passwordPolicy,
                                requireUppercase: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="uppercase" className="text-sm text-text-dark">
                          Maiúsculas obrigatórias
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="numbers"
                          checked={preferences.security.passwordPolicy.requireNumbers}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              passwordPolicy: {
                                ...prev.security.passwordPolicy,
                                requireNumbers: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="numbers" className="text-sm text-text-dark">
                          Números obrigatórios
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="special"
                          checked={preferences.security.passwordPolicy.requireSpecialChars}
                          onChange={(e) => setPreferences(prev => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              passwordPolicy: {
                                ...prev.security.passwordPolicy,
                                requireSpecialChars: e.target.checked
                              }
                            }
                          }))}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <label htmlFor="special" className="text-sm text-text-dark">
                          Caracteres especiais
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Configurações de Documentos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Tamanho Máximo de Arquivo (MB)
                    </label>
                    <input
                      type="number"
                      value={preferences.documents.maxFileSize}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        documents: { ...prev.documents, maxFileSize: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Dias de Aviso Antes do Vencimento
                    </label>
                    <input
                      type="number"
                      value={preferences.documents.expiryWarningDays}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        documents: { ...prev.documents, expiryWarningDays: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-text-dark">Excluir Automaticamente Documentos Vencidos</h4>
                    <p className="text-sm text-text-gray">Remove documentos vencidos há mais de 1 ano</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.documents.autoDeleteExpired}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        documents: { ...prev.documents, autoDeleteExpired: e.target.checked }
                      }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'epi' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-dark">Configurações de EPI</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Limite de Alerta de Estoque (%)
                    </label>
                    <input
                      type="number"
                      value={preferences.epi.stockAlertThreshold}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        epi: { ...prev.epi, stockAlertThreshold: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Dias Padrão de Entrega
                    </label>
                    <input
                      type="number"
                      value={preferences.epi.defaultDeliveryDays}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        epi: { ...prev.epi, defaultDeliveryDays: parseInt(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-dark">Biometria Obrigatória</h4>
                      <p className="text-sm text-text-gray">Exigir captura biométrica em todas as entregas</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.epi.biometricRequired}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          epi: { ...prev.epi, biometricRequired: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-dark">Gerar PDF Automaticamente</h4>
                      <p className="text-sm text-text-gray">Criar ficha de entrega em PDF após cada entrega</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.epi.autoGeneratePDF}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          epi: { ...prev.epi, autoGeneratePDF: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-between pt-6 border-t mt-6">
              <button
                onClick={() => setPreferences({})}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetar
              </button>
              
              <button
                onClick={handleSave}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}