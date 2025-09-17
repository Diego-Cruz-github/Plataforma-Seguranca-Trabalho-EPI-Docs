# 🛡️ Plataforma Segurança Trabalho e Saúde Ocupacional

> Sistema ERP completo para gestão de segurança do trabalho e saúde ocupacional

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

</div>

## 📋 Sobre o Projeto

A **Plataforma Segurança Trabalho e Saúde Ocupacional** é um sistema ERP especializado e completo para gestão de segurança do trabalho em empresas de todos os portes. Desenvolvido com tecnologias modernas, oferece controle total sobre EPIs, documentos de segurança, colaboradores e conformidade regulatória.

### 🎯 Objetivo

Digitalizar e otimizar todos os processos relacionados à segurança do trabalho, garantindo conformidade com as normas regulamentadoras (NRs) e facilitando a gestão de EPIs, documentos e colaboradores.

## ✨ Funcionalidades Principais

### 🥽 Gestão de EPIs
- **Controle de Estoque**: Monitoramento em tempo real de EPIs
- **Entrega com Biometria**: Sistema de entrega com verificação facial
- **Rastreabilidade Completa**: Histórico completo de entregas e devoluções
- **Alertas Inteligentes**: Notificações para reposição e vencimentos

### 📄 Controle de Documentos
- **Gestão de Certificados**: Controle de validade de CAs
- **Documentos Regulamentares**: PCMSO, LTCAT, PPP, PPRA
- **Alertas de Vencimento**: Notificações automáticas
- **Armazenamento Seguro**: Upload e organização de documentos

### 👥 Gestão de Colaboradores
- **Cadastro Completo**: Informações pessoais e profissionais
- **Histórico de EPIs**: Registro de entregas por colaborador
- **Setores e Funções**: Organização por área de trabalho
- **Riscos Ocupacionais**: Mapeamento de exposições

### 📊 Dashboard e Relatórios
- **KPIs em Tempo Real**: Indicadores de segurança
- **Gráficos Interativos**: Visualização de dados
- **Relatórios Customizados**: Exportação em múltiplos formatos
- **Análise de Tendências**: Insights para tomada de decisão

### 🔔 Sistema de Notificações
- **Alertas Críticos**: Estoque zerado, documentos vencidos
- **Lembretes**: Entregas pendentes, renovações
- **Central de Notificações**: Gestão unificada de alertas
- **Filtros Avançados**: Organização por tipo e prioridade

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Biblioteca de ícones moderna

### Funcionalidades Técnicas
- **Responsive Design**: Interface adaptável a todos os dispositivos
- **Dark/Light Mode**: Suporte a temas
- **PWA Ready**: Preparado para Progressive Web App
- **SEO Optimized**: Otimização para motores de busca

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Diego-Cruz-github/Plataforma-Seguranca-Trabalho-EPI-Docs.git
cd Plataforma-Seguranca-Trabalho-EPI-Docs
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Gera build de produção
npm run start        # Executa build de produção
npm run lint         # Executa verificação de código
npm run type-check   # Verifica tipagem TypeScript
```

## 📱 Screenshots

### Dashboard Principal
![Dashboard](docs/images/dashboard.png)

### Gestão de EPIs
![EPIs](docs/images/epi-management.png)

### Sistema de Entregas
![Entregas](docs/images/delivery-system.png)

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── dashboard/         # Dashboard principal
│   ├── epi/              # Módulos de EPI
│   ├── documents/        # Gestão de documentos
│   └── users/           # Gestão de usuários
├── components/           # Componentes reutilizáveis
│   ├── Layout/          # Layout e navegação
│   ├── UI/              # Componentes de interface
│   └── Forms/           # Formulários
├── data/                # Dados mock e tipos
├── utils/               # Utilitários e helpers
└── styles/              # Estilos globais
```

## 🔐 Segurança e Proteção

- **Propriedade Intelectual**: Código protegido por direitos autorais
- **Proteção contra Cópia**: Medidas de segurança implementadas
- **Licença Proprietária**: Uso comercial requer autorização

## 📄 Licenciamento

Este projeto está sob **Licença Proprietária**. Todos os direitos reservados a Diego Cruz.

### 💼 Licenciamento Comercial

Para uso comercial, parcerias ou licenciamento:

- **Email**: [diego.cruz.dev@outlook.com](mailto:diego.cruz.dev@outlook.com)
- **GitHub**: [@Diego-Cruz-github](https://github.com/Diego-Cruz-github)
- **LinkedIn**: [Diego Cruz](https://linkedin.com/in/diego-cruz-dev)

### ⚖️ Termos de Uso

- ✅ Visualização e avaliação
- ✅ Execução local para demonstração
- ❌ Uso comercial sem licença
- ❌ Redistribuição ou modificação
- ❌ Cópia de código sem autorização

## 🤝 Contato e Suporte

### 👨‍💻 Desenvolvedor
**Diego Cruz**
- 📧 Email: diego.cruz.dev@outlook.com
- 🌐 GitHub: https://github.com/Diego-Cruz-github
- 💼 LinkedIn: https://linkedin.com/in/diego-cruz-dev

### 💡 Interessado no Projeto?

Se você tem interesse em:
- **Licenciamento comercial**
- **Parcerias de desenvolvimento**
- **Customizações específicas**
- **Suporte técnico**

Entre em contato através dos canais acima!

## 📚 Documentação Adicional

- [Guia de Instalação](docs/installation.md)
- [Manual do Usuário](docs/user-guide.md)
- [API Documentation](docs/api.md)
- [Changelog](CHANGELOG.md)

---

<div align="center">

**🛡️ Plataforma Segurança Trabalho e Saúde Ocupacional**

*Desenvolvido com ❤️ por [Diego Cruz](https://github.com/Diego-Cruz-github)*

Copyright © 2024 Diego Cruz. Todos os direitos reservados.

</div>