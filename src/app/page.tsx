'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-green">ERP Segurança do Trabalho</h1>
        <p className="text-text-gray mt-2">Redirecionando...</p>
      </div>
    </div>
  );
}