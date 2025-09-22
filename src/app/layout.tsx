import './globals.css'
import { Inter } from 'next/font/google'
import ProjectGuard from '@/components/ProjectGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Plataforma Segurança Trabalho e Saúde Ocupacional | Diego Cruz',
  description: 'Sistema ERP proprietário para gestão de segurança do trabalho e saúde ocupacional - Diego Cruz',
  author: 'Diego Cruz',
  keywords: 'ERP, Segurança do Trabalho, EPI, Saúde Ocupacional, Diego Cruz',
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