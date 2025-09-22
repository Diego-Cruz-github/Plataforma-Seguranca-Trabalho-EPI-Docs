import jsPDF from 'jspdf';

export const createTestPDF = (filename: string) => {
  const doc = new jsPDF();
  
  // Configuração de fonte
  doc.setFont('helvetica');
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(40, 120, 40); // Verde
  doc.text('EHSPro - Sistema QSSMA', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Programa de Gerenciamento de Riscos (PGR)', 20, 50);
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);
  
  // Informações do documento
  doc.setFontSize(12);
  doc.text('Empresa: TechCorp Indústria Ltda.', 20, 70);
  doc.text('CNPJ: 12.345.678/0001-90', 20, 80);
  doc.text('Data de Elaboração: ' + new Date().toLocaleDateString('pt-BR'), 20, 90);
  doc.text('Responsável Técnico: Eng. João Silva Santos', 20, 100);
  doc.text('CREA: 123456-SP', 20, 110);
  
  // Conteúdo do documento
  doc.setFontSize(14);
  doc.text('1. OBJETIVO', 20, 130);
  
  doc.setFontSize(11);
  const texto1 = 'Este Programa de Gerenciamento de Riscos tem por objetivo identificar, avaliar e controlar os riscos ocupacionais existentes no ambiente de trabalho, visando a preservação da saúde e integridade física dos trabalhadores.';
  const linhas1 = doc.splitTextToSize(texto1, 170);
  doc.text(linhas1, 20, 140);
  
  doc.setFontSize(14);
  doc.text('2. METODOLOGIA', 20, 160);
  
  doc.setFontSize(11);
  const texto2 = 'A metodologia utilizada baseia-se nas diretrizes da NR-01 e demais normas regulamentadoras aplicáveis, seguindo as etapas de identificação de perigos, avaliação de riscos e determinação de medidas de controle.';
  const linhas2 = doc.splitTextToSize(texto2, 170);
  doc.text(linhas2, 20, 170);
  
  doc.setFontSize(14);
  doc.text('3. RISCOS IDENTIFICADOS', 20, 190);
  
  doc.setFontSize(11);
  doc.text('• Riscos Físicos: Ruído, vibração, temperaturas extremas', 20, 200);
  doc.text('• Riscos Químicos: Vapores orgânicos, poeiras minerais', 20, 210);
  doc.text('• Riscos Ergonômicos: Postura inadequada, esforço repetitivo', 20, 220);
  doc.text('• Riscos Mecânicos: Máquinas e equipamentos', 20, 230);
  
  // Nova página
  doc.addPage();
  
  doc.setFontSize(14);
  doc.text('4. MEDIDAS DE CONTROLE', 20, 30);
  
  doc.setFontSize(11);
  doc.text('4.1 Medidas Administrativas:', 20, 45);
  doc.text('• Treinamentos periódicos sobre segurança do trabalho', 25, 55);
  doc.text('• Procedimentos operacionais padronizados', 25, 65);
  doc.text('• Programa de conscientização em SST', 25, 75);
  
  doc.text('4.2 Equipamentos de Proteção:', 20, 90);
  doc.text('• EPIs adequados para cada função', 25, 100);
  doc.text('• Equipamentos de proteção coletiva', 25, 110);
  doc.text('• Manutenção preventiva regular', 25, 120);
  
  doc.setFontSize(14);
  doc.text('5. RESPONSABILIDADES', 20, 140);
  
  doc.setFontSize(11);
  doc.text('Empregador: Fornecer condições seguras de trabalho', 20, 155);
  doc.text('SESMT: Acompanhar e avaliar o programa', 20, 165);
  doc.text('Trabalhadores: Cumprir as medidas de segurança', 20, 175);
  
  // Assinatura
  doc.setFontSize(12);
  doc.text('_______________________________', 20, 220);
  doc.text('Eng. João Silva Santos', 20, 230);
  doc.text('CREA: 123456-SP', 20, 240);
  doc.text('Responsável Técnico', 20, 250);
  
  
  // Rodapé
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('Documento gerado pelo EHSPro - Sistema QSSMA', 20, 285);
  doc.text('Data de geração: ' + new Date().toLocaleString('pt-BR'), 20, 290);
  
  return doc;
};

export const downloadTestPDF = (filename: string) => {
  const doc = createTestPDF(filename);
  doc.save(filename);
};

export const getPDFBlob = (filename: string): Blob => {
  const doc = createTestPDF(filename);
  return doc.output('blob');
};