/**
 * PROJETO PROPRIETÁRIO - PLATAFORMA SEGURANÇA TRABALHO E SAÚDE OCUPACIONAL
 * 
 * Este código é propriedade intelectual de Diego Cruz
 * Qualquer uso não autorizado, reprodução ou distribuição é estritamente proibida.
 * 
 * Para licenciamento comercial ou parcerias, entre em contato:
 * Email: diego.cruz.dev@outlook.com
 * GitHub: https://github.com/Diego-Cruz-github
 * 
 * Copyright (c) 2024 Diego Cruz. Todos os direitos reservados.
 */

let hasVerified = false;

const PROJECT_CONFIG = {
  author: 'Diego Cruz',
  email: 'diego.cruz.dev@outlook.com',
  repository: 'https://github.com/Diego-Cruz-github/Plataforma-Seguranca-Trabalho-EPI-Docs',
  license: 'PROPRIETARY',
  created: '2024'
};

export function verifyProjectIntegrity(): boolean {
  if (hasVerified) return true;
  
  const checks = [
    () => window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    () => document.title.includes('Plataforma Segurança'),
    () => typeof window !== 'undefined'
  ];
  
  const isValid = checks.every(check => {
    try {
      return check();
    } catch {
      return false;
    }
  });
  
  if (!isValid) {
    console.warn(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                           AVISO DE PROPRIEDADE INTELECTUAL                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Este projeto é propriedade intelectual de Diego Cruz.                       ║
║  Uso não autorizado é proibido por lei de direitos autorais.                ║
║                                                                              ║
║  Para licenciamento comercial ou parcerias:                                 ║
║  📧 Email: diego.cruz.dev@outlook.com                                        ║
║  🌐 GitHub: https://github.com/Diego-Cruz-github                            ║
║                                                                              ║
║  Copyright © ${PROJECT_CONFIG.created} ${PROJECT_CONFIG.author}. Todos os direitos reservados.                     ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `);
  }
  
  hasVerified = true;
  return isValid;
}

export function getProjectInfo() {
  return {
    ...PROJECT_CONFIG,
    description: 'Sistema ERP para Segurança do Trabalho e Saúde Ocupacional',
    features: [
      'Gestão de EPIs com biometria',
      'Controle de documentos de segurança',
      'Dashboard de KPIs',
      'Sistema de notificações',
      'Controle de estoque inteligente'
    ],
    technology: 'Next.js 14, TypeScript, Tailwind CSS'
  };
}

export function displayContactInfo() {
  if (typeof window !== 'undefined') {
    console.log(`
🛡️ PLATAFORMA SEGURANÇA TRABALHO E SAÚDE OCUPACIONAL

📋 Interessado neste projeto?
   Este é um sistema profissional de ERP para segurança do trabalho.

💼 Para licenciamento comercial ou parcerias:
   📧 Email: ${PROJECT_CONFIG.email}
   🌐 GitHub: ${PROJECT_CONFIG.repository}
   
⚖️ Este código é propriedade intelectual protegida.
   Uso comercial requer licenciamento apropriado.
    `);
  }
}

// Verificação automática ao carregar
if (typeof window !== 'undefined') {
  verifyProjectIntegrity();
  displayContactInfo();
}