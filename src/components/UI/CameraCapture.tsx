'use client';

import { useRef, useEffect, useState } from 'react';
import { X, Camera, RotateCcw, Save, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
  title?: string;
}

export default function CameraCapture({ isOpen, onClose, onCapture, title = "Captura Biométrica por Câmera" }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoReady, setVideoReady] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Aguardar um frame antes de iniciar a câmera
      setTimeout(() => {
        startCamera();
      }, 100);
    } else {
      stopCamera();
      setCapturedImage('');
      setError('');
      setHasPermission(false);
      setIsLoading(false);
      setVideoReady(false);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError('');
      setIsLoading(true);
      setVideoReady(false);
      
      // Verificar se getUserMedia está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Câmera não suportada neste navegador.');
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      // Verificar permissões primeiro
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Status da permissão de câmera:', permission.state);

      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Aguardar o vídeo carregar
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setVideoReady(true);
              })
              .catch((playError) => {
                console.error('Erro ao reproduzir vídeo:', playError);
                setError('Erro ao iniciar visualização da câmera.');
                setIsLoading(false);
              });
          }
        };

        // Timeout de segurança
        setTimeout(() => {
          if (!videoReady) {
            setIsLoading(false);
            setError('Timeout ao carregar câmera. Tente novamente.');
          }
        }, 10000);
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setHasPermission(false);
      setIsLoading(false);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Acesso à câmera negado. Clique no ícone de câmera na barra de endereços e permita o acesso, depois recarregue a página.');
        } else if (err.name === 'NotFoundError') {
          setError('Nenhuma câmera encontrada no dispositivo.');
        } else if (err.name === 'NotReadableError') {
          setError('Câmera está sendo usada por outro aplicativo.');
        } else if (err.name === 'OverconstrainedError') {
          setError('Configurações de câmera não suportadas pelo dispositivo.');
        } else {
          setError('Erro ao acessar a câmera: ' + err.message);
        }
      } else {
        setError('Erro desconhecido ao acessar a câmera.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage('');
  };

  const savePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage('');
      onClose();
    }
  };

  const handleClose = () => {
    setCapturedImage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] max-w-2xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">
              {capturedImage ? 'Revise a foto capturada' : 'Posicione o rosto na câmera e tire uma foto'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera/Preview Area */}
        <div className="flex-1 p-4">
          <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro de Câmera</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Foto capturada"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : hasPermission && videoReady ? (
              <div className="w-full h-full relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Face guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-64 border-2 border-white border-dashed rounded-full opacity-50"></div>
                </div>
              </div>
            ) : isLoading || hasPermission ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">
                    {isLoading ? 'Carregando câmera...' : 'Iniciando visualização...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aguardando permissão...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          {capturedImage ? (
            <div className="flex gap-2 w-full">
              <button
                onClick={retakePhoto}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" />
                Tirar Novamente
              </button>
              <button
                onClick={savePhoto}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Usar Esta Foto
              </button>
            </div>
          ) : (
            <div className="flex justify-between w-full">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={capturePhoto}
                disabled={!hasPermission || !!error}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4" />
                Capturar Foto
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-3 mx-4 mb-4 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Instruções:</strong> {capturedImage ? 
              'Verifique se a foto está clara e bem iluminada antes de confirmar.' :
              'Posicione o rosto dentro do círculo pontilhado e clique em "Capturar Foto". Certifique-se de que há boa iluminação.'
            }
          </p>
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}