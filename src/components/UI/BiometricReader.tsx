'use client';

import { useState, useEffect } from 'react';
import { X, Fingerprint, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BiometricReaderProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (biometricData: string) => void;
  title?: string;
}

export default function BiometricReader({ isOpen, onClose, onCapture, title = "Leitor Biométrico" }: BiometricReaderProps) {
  const [status, setStatus] = useState<'waiting' | 'scanning' | 'success' | 'error'>('waiting');
  const [message, setMessage] = useState('Posicione o dedo no leitor biométrico');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      resetReader();
    }
  }, [isOpen]);

  const resetReader = () => {
    setStatus('waiting');
    setMessage('Posicione o dedo no leitor biométrico');
    setProgress(0);
  };

  const simulateBiometricScan = async () => {
    setStatus('scanning');
    setMessage('Lendo impressão digital...');
    setProgress(0);

    // Simular progresso da leitura
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
      
      if (i === 30) {
        setMessage('Analisando padrões biométricos...');
      } else if (i === 60) {
        setMessage('Verificando qualidade da impressão...');
      } else if (i === 90) {
        setMessage('Finalizando verificação...');
      }
    }

    // Simular resultado (90% de sucesso)
    const success = Math.random() > 0.1;
    
    if (success) {
      setStatus('success');
      setMessage('Biometria capturada com sucesso!');
      
      // Gerar dados biométricos simulados
      const mockBiometricData = btoa(JSON.stringify({
        fingerprint: 'mock_fingerprint_' + Date.now(),
        quality: 'high',
        timestamp: new Date().toISOString(),
        deviceId: 'bio_reader_001'
      }));
      
      setTimeout(() => {
        onCapture(mockBiometricData);
        onClose();
      }, 1500);
    } else {
      setStatus('error');
      setMessage('Falha na leitura. Limpe o dedo e tente novamente.');
    }
  };

  const handleClose = () => {
    resetReader();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] max-w-md h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">Autenticação por impressão digital</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reader Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="relative">
            {/* Biometric Reader Visual */}
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center relative transition-all duration-300 ${
              status === 'waiting' ? 'border-gray-300 bg-gray-50' :
              status === 'scanning' ? 'border-blue-500 bg-blue-50' :
              status === 'success' ? 'border-green-500 bg-green-50' :
              'border-red-500 bg-red-50'
            }`}>
              {status === 'waiting' && (
                <Fingerprint className="w-16 h-16 text-gray-400" />
              )}
              {status === 'scanning' && (
                <div className="relative">
                  <Fingerprint className="w-16 h-16 text-blue-600" />
                  <Loader2 className="w-6 h-6 text-blue-600 absolute -top-1 -right-1 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <CheckCircle className="w-16 h-16 text-green-600" />
              )}
              {status === 'error' && (
                <AlertCircle className="w-16 h-16 text-red-600" />
              )}

              {/* Progress ring for scanning */}
              {status === 'scanning' && (
                <div className="absolute inset-0 rounded-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-blue-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                      className="text-blue-600 transition-all duration-200"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Scanner line effect */}
            {status === 'scanning' && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute w-full h-1 bg-blue-400 animate-ping" 
                     style={{ top: `${45 + Math.sin(Date.now() / 200) * 20}%` }} />
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="text-center mt-6">
            <p className={`font-medium mb-2 ${
              status === 'success' ? 'text-green-600' :
              status === 'error' ? 'text-red-600' :
              status === 'scanning' ? 'text-blue-600' :
              'text-gray-700'
            }`}>
              {message}
            </p>

            {status === 'scanning' && (
              <p className="text-sm text-gray-500">
                Progresso: {progress}%
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200">
          {status === 'waiting' && (
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={simulateBiometricScan}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                Iniciar Leitura
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={simulateBiometricScan}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {(status === 'scanning' || status === 'success') && (
            <div className="text-center">
              {status === 'scanning' && (
                <p className="text-sm text-gray-500">Aguarde o término da leitura...</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-green-600">Redirecionando...</p>
              )}
            </div>
          )}
        </div>

        {/* Device Info */}
        <div className="bg-blue-50 p-3 mx-4 mb-2 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>⚠️ Equipamento Externo:</strong> Este recurso requer um leitor biométrico conectado ao computador. 
            Certifique-se de que o dispositivo está conectado e funcionando antes de prosseguir.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 p-3 mx-4 mb-4 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Instruções:</strong> {
              status === 'waiting' ? 'Certifique-se de que o dedo está limpo e seco antes de posicioná-lo no leitor.' :
              status === 'scanning' ? 'Mantenha o dedo imóvel durante a leitura.' :
              status === 'error' ? 'Limpe o dedo e o sensor, depois tente novamente.' :
              'Biometria capturada com sucesso!'
            }
          </p>
        </div>
      </div>
    </div>
  );
}