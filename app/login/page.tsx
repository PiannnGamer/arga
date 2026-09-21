'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, Mail, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('demo@belajar.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Gagal terhubung ke server.');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@belajar.com');
    setPassword('password123');
    setIsRegister(false);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#F7FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#4F9CF9] text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#4F9CF9]/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Catatan Belajar</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isRegister ? 'Buat akun baru untuk mulai mencatat' : 'Selamat Datang Kembali! Silakan login'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arga Mahasiswa"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] text-sm text-[#1F2937]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] text-sm text-[#1F2937]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] text-sm text-[#1F2937]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4F9CF9] hover:bg-[#3b86e8] text-white font-medium text-sm shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Memproses...' : isRegister ? 'Daftar Akun' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
          {!isRegister ? (
            <div>
              <button
                onClick={fillDemo}
                type="button"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#4F9CF9] bg-[#EAF4FF] hover:bg-[#dbeaff] px-3 py-1.5 rounded-lg mb-4 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gunakan Akun Demo (demo@belajar.com)</span>
              </button>
              <p className="text-sm text-[#64748B]">
                Belum punya akun?{' '}
                <button
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className="font-medium text-[#4F9CF9] hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">
              Sudah punya akun?{' '}
              <button
                onClick={() => { setIsRegister(false); setError(''); }}
                className="font-medium text-[#4F9CF9] hover:underline"
              >
                Login di sini
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
