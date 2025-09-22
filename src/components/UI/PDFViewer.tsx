'use client';

import { useState, useEffect } from 'react';
import { X, Download, FileSignature, ExternalLink } from 'lucide-react';
import { createTestPDF, downloadTestPDF } from '@/utils/createTestPDF';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentType: string;
}

export default function PDFViewer({ isOpen, onClose, documentName, documentType }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Gerar PDF e criar URL para visualização
      const doc = createTestPDF(documentName);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }
  }, [isOpen, documentName]);

  const handleDownload = () => {
    downloadTestPDF(documentName);
  };

  const handleSignature = () => {
    setShowSignatureModal(true);
  };

  const handleGovBrSignature = () => {
    // Redirecionamento para assinatura eletrônica gov.br
    window.open('https://www.gov.br/pt-br/servicos/assinatura-eletronica', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <FileSignature className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{documentName}</h2>
              <p className="text-sm text-gray-500">{documentType}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-orange-600 font-medium">
                  Documento aguardando assinatura digital
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Baixar documento"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Baixar</span>
            </button>
            
            <button
              onClick={handleSignature}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Assinar documento"
            >
              <FileSignature className="w-4 h-4" />
              <span className="text-sm">Assinar</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Aviso de Assinatura */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 p-3 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center gap-3">
            <FileSignature className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Este documento requer assinatura digital para ter validade jurídica
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Use o botão "Assinar" para ser redirecionado ao portal gov.br
              </p>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 p-4">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border border-gray-200 rounded-lg"
              title={documentName}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando documento...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Assinatura */}
      {showSignatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSignature className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Assinatura Digital</h3>
              <p className="text-gray-600">
                Para assinar este documento, você será redirecionado para o portal gov.br
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Documento:</h4>
                <p className="text-blue-800 text-sm">{documentName}</p>
                <p className="text-blue-700 text-xs mt-1">{documentType}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Certificado Digital:</h4>
                <p className="text-green-800 text-sm">gov.br - Assinatura Eletrônica</p>
                <p className="text-green-700 text-xs mt-1">Validade jurídica garantida</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGovBrSignature}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ir para gov.br
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}