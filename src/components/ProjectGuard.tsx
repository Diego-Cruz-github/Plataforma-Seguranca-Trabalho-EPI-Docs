'use client';

import { useEffect } from 'react';
import { verifyProjectIntegrity, displayContactInfo } from '@/utils/projectProtection';

export default function ProjectGuard() {
  useEffect(() => {
    verifyProjectIntegrity();
    displayContactInfo();
    
    // Proteger contra hotkeys de dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        console.log(`
🛡️ AVISO DE PROPRIEDADE INTELECTUAL

Este projeto é propriedade de Diego Cruz.
Para licenciamento comercial:
📧 diego.cruz.dev@outlook.com
🌐 https://github.com/Diego-Cruz-github
        `);
      }
    };

    // Proteger contra clique direito
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
        console.log('Para informações de licenciamento: diego.cruz.dev@outlook.com');
      }
    };

    // Detectar tentativas de cópia de código
    const handleCopy = () => {
      console.log(`
📋 COPIANDO CÓDIGO?

Este projeto é propriedade intelectual protegida.
Para licenciamento comercial ou parcerias:
📧 diego.cruz.dev@outlook.com
🌐 https://github.com/Diego-Cruz-github

Respeite os direitos autorais! 🛡️
      `);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return null;
}