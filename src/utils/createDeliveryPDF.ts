import jsPDF from 'jspdf';

interface EPIHistoryEntry {
  deliveryId: string;
  epiId: string;
  epiName: string;
  epiCA: string;
  quantity: number;
  deliveryDate: Date;
  deliveredBy: string;
  status: 'active' | 'returned' | 'replaced';
  notes?: string;
  expiryDate?: Date;
  signatureData?: string;
  biometricVerified?: boolean;
}

interface EmployeeEPIHistory {
  employeeId: string;
  employeeName: string;
  currentFunction: string;
  functionHistory: Array<{
    function: string;
    startDate: Date;
    endDate?: Date;
  }>;
  epiHistory: EPIHistoryEntry[];
  lastUpdated: Date;
}

interface EPIDeliveryData {
  employeeId: string;
  employeeName: string;
  employeeCPF: string;
  employeeSector: string;
  employeePosition: string;
  companyName: string;
  unitName: string;
  episDelivered: Array<{
    epiId: string;
    epiName: string;
    epiCA: string;
    quantity: number;
  }>;
  fullHistory?: EmployeeEPIHistory;
  deliveryDate: Date;
  deliveredBy: string;
  notes?: string;
  signatureData?: string;
  biometricVerified?: boolean;
}

export const createDeliveryPDF = (data: EPIDeliveryData) => {
  const doc = new jsPDF();
  
  // Configuração de fonte
  doc.setFont('helvetica');
  
  // Cabeçalho simples
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('FICHA DE CONTROLE DE EPI', 105, 20, { align: 'center' });
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 25, 190, 25);
  
  // Quadrado pequeno com dados do trabalhador
  let yPos = 35;
  
  // Caixa principal de dados do trabalhador
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, 170, 30, 'D');
  
  // Divisões internas do quadrado
  doc.line(70, yPos, 70, yPos + 30); // Divisão após nome
  doc.line(110, yPos, 110, yPos + 30); // Divisão após função
  doc.line(150, yPos, 150, yPos + 30); // Divisão após matrícula
  
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  // Nome do Trabalhador
  doc.text('Nome do Trabalhador:', 22, yPos + 5);
  doc.setFontSize(10);
  doc.text(data.employeeName, 22, yPos + 15);
  
  // Função
  doc.setFontSize(8);
  doc.text('Função:', 72, yPos + 5);
  doc.setFontSize(10);
  doc.text(data.employeePosition, 72, yPos + 15);
  
  // Matrícula (usando CPF)
  doc.setFontSize(8);
  doc.text('Matrícula:', 112, yPos + 5);
  doc.setFontSize(9);
  doc.text(data.employeeCPF, 112, yPos + 15);
  
  // Data de Admissão
  doc.setFontSize(8);
  doc.text('Data de Admissão:', 152, yPos + 5);
  doc.setFontSize(9);
  doc.text('___/___/____', 152, yPos + 15);
  
  yPos += 45;
  
  // Declaração legal
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  
  const declarationText = 'DECLARO ter recebido pela Lei Federal o(s) Equipamento(s) de Proteção Individual - EPIs, abaixo especificado(s) nos termos do artigo 166 e 167 da CLT, com redação dada pela Lei no 6.514/77, objetivando a proteção da incolumidade física, bem como a neutralização de possíveis agentes insalubres conforme o art. 191, inciso II, da norma jurídica mencionada, e ainda, o treinamento para o uso correto do(s) mesmo(s). COMPROMETO-ME a utilizá-los sempre para os fins a que se destinam, estando ciente que o não uso incorrerá contra a minha pessoa em ato faltoso, sujeitando-me às penalidades legais. RESPONSABILIZO-ME por sua guarda, conservação, uso correto, e a devolução ao SESMT ou superior hierárquico ou Técnico em Segurança do Trabalho caso ocorra qualquer alteração que o torne impróprio para o uso, sendo possível a retirada ou troca de EPI sempre que necessário, indenizando a empresa no caso de perda, extravio ou danos por uso incorreto (art. 462, parágrafo 1º, da CLT), e, a comunicação de qualquer equipamento.';
  
  // Caixa da declaração
  doc.setDrawColor(0, 0, 0);
  doc.rect(20, yPos, 130, 40, 'D');
  
  // Texto da declaração com quebra de linha
  const declarationLines = doc.splitTextToSize(declarationText, 125);
  doc.text(declarationLines, 22, yPos + 5);
  
  // Caixa de assinatura do funcionário
  doc.rect(155, yPos, 35, 40, 'D');
  doc.setFontSize(8);
  doc.text('Assinatura do', 158, yPos + 5);
  doc.text('Funcionário:', 158, yPos + 10);
  
  // Inserir assinatura se disponível
  if (data.signatureData) {
    try {
      doc.addImage(data.signatureData, 'PNG', 157, yPos + 15, 31, 20);
    } catch (error) {
      console.error('Erro ao adicionar assinatura ao PDF:', error);
    }
  }
  
  yPos += 50;
  
  // Tabela de controle de EPIs
  if (data.fullHistory && data.fullHistory.epiHistory.length > 0) {
    const allEPIs = data.fullHistory.epiHistory;
    
    // Cabeçalho da tabela
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 15, 'D');
    
    // Divisões do cabeçalho
    doc.line(45, yPos, 45, yPos + 15); // Entrega/Devolução
    doc.line(70, yPos, 70, yPos + 15); // Qtde
    doc.line(110, yPos, 110, yPos + 15); // EPI
    doc.line(135, yPos, 135, yPos + 15); // CA
    doc.line(155, yPos, 155, yPos + 15); // Motivo
    
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    // Títulos das colunas
    doc.text('Entrega', 22, yPos + 5);
    doc.text('Devolução', 22, yPos + 10);
    doc.text('Qtde.', 50, yPos + 8);
    doc.text('EPI', 85, yPos + 8);
    doc.text('CA', 120, yPos + 8);
    doc.text('Motivo', 140, yPos + 8);
    doc.text('Assinatura', 158, yPos + 5);
    doc.text('& Biometria', 158, yPos + 10);
    
    yPos += 15;
    
    // Linhas de EPIs
    allEPIs.forEach((epi, index) => {
      const rowHeight = 15;
      
      // Linha da tabela
      doc.rect(20, yPos, 170, rowHeight, 'D');
      
      // Divisões verticais
      doc.line(45, yPos, 45, yPos + rowHeight);
      doc.line(70, yPos, 70, yPos + rowHeight);
      doc.line(110, yPos, 110, yPos + rowHeight);
      doc.line(135, yPos, 135, yPos + rowHeight);
      doc.line(155, yPos, 155, yPos + rowHeight);
      
      doc.setFontSize(7);
      
      // Data de entrega
      const deliveryDate = new Date(epi.deliveryDate).toLocaleDateString('pt-BR');
      doc.text(deliveryDate, 22, yPos + 8);
      
      // Data de devolução (se aplicável)
      if (epi.status === 'returned') {
        doc.text('___/___/____', 22, yPos + 12);
      }
      
      // Quantidade
      doc.text(epi.quantity.toString(), 50, yPos + 8);
      
      // Descrição do EPI (truncada)
      const epiName = epi.epiName.length > 15 ? epi.epiName.substring(0, 15) + '...' : epi.epiName;
      doc.text(epiName, 72, yPos + 6);
      doc.text('Descrição:', 72, yPos + 10);
      
      // CA
      doc.text(epi.epiCA, 112, yPos + 8);
      
      // Motivo
      const motivo = epi.status === 'active' ? 'Entrega' : 
                   epi.status === 'returned' ? 'Devolução' : 'Substituição';
      doc.text(motivo, 137, yPos + 8);
      
      // Área de assinatura (pequena)
      if (epi.signatureData) {
        try {
          // Inserir assinatura pequena se disponível
          doc.addImage(epi.signatureData, 'PNG', 157, yPos + 2, 25, 10);
        } catch (error) {
          doc.text('_________', 157, yPos + 8);
        }
      } else if (data.signatureData) {
        try {
          // Usar assinatura geral se não houver específica
          doc.addImage(data.signatureData, 'PNG', 157, yPos + 2, 25, 10);
        } catch (error) {
          doc.text('_________', 157, yPos + 8);
        }
      } else {
        doc.text('_________', 157, yPos + 8);
      }
      
      // Indicação de biometria (se verificada)
      if (epi.biometricVerified || data.biometricVerified) {
        doc.setFontSize(6);
        doc.setTextColor(0, 120, 0);
        doc.text('✓ Bio', 157, yPos + 14);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(7);
      }
      
      yPos += rowHeight;
    });
  } else {
    // Tabela vazia para primeira entrega
    const rowHeight = 15;
    
    // Cabeçalho
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 15, 'D');
    
    // Divisões do cabeçalho
    doc.line(45, yPos, 45, yPos + 15);
    doc.line(70, yPos, 70, yPos + 15);
    doc.line(110, yPos, 110, yPos + 15);
    doc.line(135, yPos, 135, yPos + 15);
    doc.line(155, yPos, 155, yPos + 15);
    
    doc.setFontSize(8);
    doc.text('Entrega', 22, yPos + 5);
    doc.text('Devolução', 22, yPos + 10);
    doc.text('Qtde.', 50, yPos + 8);
    doc.text('EPI', 85, yPos + 8);
    doc.text('CA', 120, yPos + 8);
    doc.text('Motivo', 140, yPos + 8);
    doc.text('Assinatura', 158, yPos + 5);
    doc.text('& Biometria', 158, yPos + 10);
    
    yPos += 15;
    
    // Algumas linhas vazias
    for (let i = 0; i < 5; i++) {
      doc.rect(20, yPos, 170, rowHeight, 'D');
      doc.line(45, yPos, 45, yPos + rowHeight);
      doc.line(70, yPos, 70, yPos + rowHeight);
      doc.line(110, yPos, 110, yPos + rowHeight);
      doc.line(135, yPos, 135, yPos + rowHeight);
      doc.line(155, yPos, 155, yPos + rowHeight);
      
      // Placeholder para assinatura e biometria
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('_________', 157, yPos + 8);
      doc.setFontSize(6);
      doc.text('[ ] Bio', 157, yPos + 12);
      doc.setTextColor(0, 0, 0);
      
      yPos += rowHeight;
    }
  }
  
  // Rodapé simples
  yPos += 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('EHSPro - Sistema de Gestão de Segurança do Trabalho', 20, yPos);
  doc.text('Documento gerado em: ' + new Date().toLocaleString('pt-BR'), 20, yPos + 5);
  
  if (data.fullHistory) {
    doc.text(`Total de registros: ${data.fullHistory.epiHistory.length}`, 20, yPos + 10);
  }
  
  return doc;
};

export const downloadDeliveryPDF = (data: EPIDeliveryData, filename?: string) => {
  const doc = createDeliveryPDF(data);
  const finalFilename = filename || `Entrega_EPI_${data.employeeName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(finalFilename);
};

export const getDeliveryPDFBlob = (data: EPIDeliveryData): Blob => {
  const doc = createDeliveryPDF(data);
  return doc.output('blob');
};