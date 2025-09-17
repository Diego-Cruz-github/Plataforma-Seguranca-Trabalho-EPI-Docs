'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  mockEmployees, 
  mockEPIs, 
  mockSectors, 
  mockPositions, 
  mockRisks,
  mockCompanies 
} from '@/data/mockData';
import { 
  Truck, 
  Users, 
  HardHat, 
  Plus, 
  Minus,
  Camera,
  FileText,
  Save,
  UserCheck,
  Building2,
  MapPin,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Scan
} from 'lucide-react';

interface DeliveryItem {
  epiId: string;
  quantity: number;
}

interface BiometricCapture {
  imageData: string;
  timestamp: Date;
  verified: boolean;
}

export default function EPIDeliveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [deliveryType, setDeliveryType] = useState<'individual' | 'batch'>('individual');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [biometricCapture, setBiometricCapture] = useState<BiometricCapture | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Verificar se há um colaborador pré-selecionado na URL
    const employeeParam = searchParams.get('employee');
    if (employeeParam) {
      setSelectedEmployee(employeeParam);
    }
  }, [router, searchParams]);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    // Auto-sugerir EPIs baseado no setor/função do colaborador
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (employee) {
      const sector = mockSectors.find(s => s.name === employee.sector);
      if (sector) {
        const suggestedEPIs = sector.requiredEPIs.map(epiId => ({
          epiId,
          quantity: 1
        }));
        setDeliveryItems(suggestedEPIs);
      }
    }
  };

  const handleSectorBasedDelivery = () => {
    if (selectedSector) {
      const sector = mockSectors.find(s => s.id === selectedSector);
      if (sector) {
        const suggestedEPIs = sector.requiredEPIs.map(epiId => ({
          epiId,
          quantity: 1
        }));
        setDeliveryItems(suggestedEPIs);
      }
    }
  };

  const handlePositionBasedDelivery = () => {
    if (selectedPosition) {
      const position = mockPositions.find(p => p.id === selectedPosition);
      if (position) {
        const suggestedEPIs = position.requiredEPIs.map(epiId => ({
          epiId,
          quantity: 1
        }));
        setDeliveryItems(suggestedEPIs);
      }
    }
  };

  const handleRiskBasedDelivery = () => {
    if (selectedRisk) {
      const risk = mockRisks.find(r => r.id === selectedRisk);
      if (risk) {
        const suggestedEPIs = risk.requiredEPIs.map(epiId => ({
          epiId,
          quantity: 1
        }));
        setDeliveryItems(suggestedEPIs);
      }
    }
  };

  const addEPIItem = (epiId: string) => {
    const existingItem = deliveryItems.find(item => item.epiId === epiId);
    if (existingItem) {
      setDeliveryItems(items =>
        items.map(item =>
          item.epiId === epiId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setDeliveryItems(items => [...items, { epiId, quantity: 1 }]);
    }
  };

  const updateEPIQuantity = (epiId: string, quantity: number) => {
    if (quantity <= 0) {
      setDeliveryItems(items => items.filter(item => item.epiId !== epiId));
    } else {
      setDeliveryItems(items =>
        items.map(item =>
          item.epiId === epiId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const simulateBiometricCapture = async () => {
    setIsCapturing(true);
    
    // Simular tempo de captura
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simular captura bem-sucedida
    const mockImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigD//2Q==';
    
    setBiometricCapture({
      imageData: mockImageData,
      timestamp: new Date(),
      verified: true
    });
    
    setIsCapturing(false);
  };

  const handleDelivery = () => {
    if (!selectedEmployee || deliveryItems.length === 0 || !biometricCapture) {
      alert('Preencha todos os campos obrigatórios e capture a biometria');
      return;
    }

    // Simular processo de entrega
    const deliveryData = {
      employeeId: selectedEmployee,
      episDelivered: deliveryItems,
      deliveryDate: new Date(),
      biometricData: {
        type: 'facial' as const,
        dataPath: '/biometric/facial_' + Date.now() + '.jpg',
        verified: biometricCapture.verified,
      },
      deliveredBy: user.email,
      notes: deliveryNotes,
    };

    console.log('Entrega realizada:', deliveryData);
    alert('Entrega realizada com sucesso! Ficha de EPI será gerada automaticamente.');
    
    // Reset form
    setSelectedEmployee('');
    setDeliveryItems([]);
    setBiometricCapture(null);
    setDeliveryNotes('');
  };

  const getEmployeeInfo = (employeeId: string) => {
    return mockEmployees.find(emp => emp.id === employeeId);
  };

  const getEPIInfo = (epiId: string) => {
    return mockEPIs.find(epi => epi.id === epiId);
  };

  const getCompanyName = (companyId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    return company?.name || '';
  };

  const getUnitName = (companyId: string, unitId: string) => {
    const company = mockCompanies.find(c => c.id === companyId);
    const unit = company?.units.find(u => u.id === unitId);
    return unit?.name || '';
  };

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

  const selectedEmployeeInfo = selectedEmployee ? getEmployeeInfo(selectedEmployee) : null;

  return (
    <MainLayout title="Entrega de EPI" breadcrumb={['Início', 'EPI', 'Entrega']}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-8 h-8 text-primary-green" />
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Entrega de EPI</h2>
          <p className="text-text-gray">Registre entregas individuais ou em lote com biometria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Delivery Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Type */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-text-dark mb-4">Tipo de Entrega</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryType('individual')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  deliveryType === 'individual'
                    ? 'border-primary-green bg-green-50 text-primary-green'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserCheck className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Individual</span>
              </button>
              <button
                onClick={() => setDeliveryType('batch')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  deliveryType === 'batch'
                    ? 'border-primary-green bg-green-50 text-primary-green'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Em Lote</span>
              </button>
            </div>
          </div>

          {/* Employee Selection */}
          {deliveryType === 'individual' && (
            <div className="bg-white rounded-lg p-6 card-shadow">
              <h3 className="text-lg font-semibold text-text-dark mb-4">Selecionar Colaborador</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="">Selecione um colaborador</option>
                {mockEmployees.filter(emp => emp.status === 'active').map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.cpf} ({employee.sector})
                  </option>
                ))}
              </select>

              {selectedEmployeeInfo && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-text-gray">Nome</span>
                      <p className="font-medium">{selectedEmployeeInfo.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-text-gray">CPF</span>
                      <p className="font-mono">{selectedEmployeeInfo.cpf}</p>
                    </div>
                    <div>
                      <span className="text-sm text-text-gray">Setor/Função</span>
                      <p className="font-medium">{selectedEmployeeInfo.sector} - {selectedEmployeeInfo.position}</p>
                    </div>
                    <div>
                      <span className="text-sm text-text-gray">Empresa/Unidade</span>
                      <p className="font-medium">
                        {getCompanyName(selectedEmployeeInfo.companyId)} - {getUnitName(selectedEmployeeInfo.companyId, selectedEmployeeInfo.unitId)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Batch Selection */}
          {deliveryType === 'batch' && (
            <div className="bg-white rounded-lg p-6 card-shadow">
              <h3 className="text-lg font-semibold text-text-dark mb-4">Entrega em Lote</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Por Setor</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      <option value="">Selecione um setor</option>
                      {mockSectors.map(sector => (
                        <option key={sector.id} value={sector.id}>{sector.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSectorBasedDelivery}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Por Função</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      <option value="">Selecione uma função</option>
                      {mockPositions.map(position => (
                        <option key={position.id} value={position.id}>{position.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handlePositionBasedDelivery}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Por Risco</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedRisk}
                      onChange={(e) => setSelectedRisk(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    >
                      <option value="">Selecione um risco</option>
                      {mockRisks.map(risk => (
                        <option key={risk.id} value={risk.id}>{risk.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleRiskBasedDelivery}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EPI Selection */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-text-dark mb-4">EPIs para Entrega</h3>
            
            {/* Add EPI */}
            <div className="flex gap-2 mb-4">
              <select
                onChange={(e) => e.target.value && addEPIItem(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="">Adicionar EPI</option>
                {mockEPIs.filter(epi => epi.currentStock > 0).map(epi => (
                  <option key={epi.id} value={epi.id}>
                    {epi.name} (CA {epi.ca}) - Estoque: {epi.currentStock}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected EPIs */}
            {deliveryItems.length > 0 && (
              <div className="space-y-3">
                {deliveryItems.map(item => {
                  const epi = getEPIInfo(item.epiId);
                  if (!epi) return null;
                  
                  return (
                    <div key={item.epiId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <HardHat className="w-5 h-5 text-primary-green" />
                        <div>
                          <p className="font-medium text-text-dark">{epi.name}</p>
                          <p className="text-sm text-text-gray">CA {epi.ca} - {epi.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateEPIQuantity(item.epiId, item.quantity - 1)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateEPIQuantity(item.epiId, item.quantity + 1)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Notes */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-text-dark mb-4">Observações</h3>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Observações sobre a entrega (opcional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-green focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        {/* Right Column - Biometric & Summary */}
        <div className="space-y-6">
          {/* Biometric Capture */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-text-dark mb-4">Captura Biométrica</h3>
            
            {!biometricCapture ? (
              <div className="text-center">
                {isCapturing ? (
                  <div className="space-y-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <div className="animate-pulse">
                        <Scan className="w-12 h-12 text-primary-green" />
                      </div>
                    </div>
                    <p className="text-sm text-text-gray">Capturando biometria facial...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-green h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <button
                      onClick={simulateBiometricCapture}
                      className="bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
                    >
                      <Camera className="w-4 h-4" />
                      Capturar Biometria
                    </button>
                    <p className="text-xs text-text-gray">
                      Clique para simular captura facial
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Biometria Capturada</span>
                  </div>
                  <p className="text-xs text-text-gray">
                    {biometricCapture.timestamp.toLocaleString('pt-BR')}
                  </p>
                  <button
                    onClick={() => setBiometricCapture(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                  >
                    Capturar novamente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Summary */}
          <div className="bg-white rounded-lg p-6 card-shadow">
            <h3 className="text-lg font-semibold text-text-dark mb-4">Resumo da Entrega</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-gray">Tipo:</span>
                <span className="font-medium">
                  {deliveryType === 'individual' ? 'Individual' : 'Em Lote'}
                </span>
              </div>
              
              {selectedEmployeeInfo && (
                <div className="flex justify-between">
                  <span className="text-text-gray">Colaborador:</span>
                  <span className="font-medium text-right">
                    {selectedEmployeeInfo.name}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-text-gray">EPIs:</span>
                <span className="font-medium">{deliveryItems.length} itens</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-text-gray">Biometria:</span>
                <span className={`font-medium ${biometricCapture ? 'text-green-600' : 'text-red-600'}`}>
                  {biometricCapture ? 'Capturada' : 'Pendente'}
                </span>
              </div>
            </div>

            <button
              onClick={handleDelivery}
              disabled={!selectedEmployee || deliveryItems.length === 0 || !biometricCapture}
              className="w-full mt-6 bg-primary-green text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Realizar Entrega
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}