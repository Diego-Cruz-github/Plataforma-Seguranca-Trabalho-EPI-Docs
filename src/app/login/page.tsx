'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const demoUsers = [
    { email: 'admin@demo.com', password: 'admin123', role: 'admin' },
    { email: 'user@demo.com', password: 'user123', role: 'user' },
    { email: 'viewer@demo.com', password: 'viewer123', role: 'viewer' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store user session (in real app would use proper auth)
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        alert('Credenciais inválidas');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green to-primary-green-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-green rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark">ERP Segurança</h1>
          <p className="text-text-gray">do Trabalho</p>
        </div>

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 mb-2">Credenciais Demo:</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Admin:</strong> admin@demo.com / admin123</p>
            <p><strong>Usuário:</strong> user@demo.com / user123</p>
            <p><strong>Visualizador:</strong> viewer@demo.com / viewer123</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-gray hover:text-primary-green"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-green text-white py-3 rounded-lg font-medium hover:bg-primary-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-gray">
          <p>Demo - Sistema de Segurança do Trabalho</p>
        </div>
      </div>
    </div>
  );
}