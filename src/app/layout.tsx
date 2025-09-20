import './globals.css'
import { Inter } from 'next/font/google'
import ProjectGuard from '@/components/ProjectGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EHSPro - Digitalizando a segurança, simplificando a gestão | Diego Cruz',
  description: 'EHSPro - Sistema ERP proprietário para gestão de segurança do trabalho e saúde ocupacional - Diego Cruz',
  author: 'Diego Cruz',
  keywords: 'EHSPro, ERP, Segurança do Trabalho, EPI, Saúde Ocupacional, Diego Cruz',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ProjectGuard />
        {children}
      </body>
    </html>
  )
}