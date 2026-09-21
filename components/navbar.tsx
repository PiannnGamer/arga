'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LayoutDashboard, FileText, PlusCircle, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Catatan Belajar</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/notes"
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                isActive('/notes')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Daftar Catatan</span>
            </Link>
            <Link
              href="/notes/new"
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                isActive('/notes/new')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Catatan</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-900">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 disabled:opacity-50"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Mobile Subheader Nav */}
      <div className="md:hidden flex items-center justify-around bg-white border-t border-slate-200 px-2 py-2">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center py-1 px-3 rounded-2xl text-xs font-medium ${
            isActive('/dashboard') ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          Dashboard
        </Link>
        <Link
          href="/notes"
          className={`flex flex-col items-center py-1 px-3 rounded-2xl text-xs font-medium ${
            isActive('/notes') ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          Catatan
        </Link>
        <Link
          href="/notes/new"
          className={`flex flex-col items-center py-1 px-3 rounded-2xl text-xs font-medium ${
            isActive('/notes/new') ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          Tambah
        </Link>
      </div>
    </header>
  );
}
