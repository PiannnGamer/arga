'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 3) {
      setError('Judul minimal harus 3 karakter.');
      return;
    }

    if (!content.trim()) {
      setError('Isi catatan wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan catatan.');
        setLoading(false);
        return;
      }

      router.push('/notes');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan jaringan.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link
            href="/notes"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Catatan</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tambah Catatan Belajar Baru</h1>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-0.5">Catat ringkasan dan poin penting materi belajarmu</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Judul Catatan
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Konsep Dasar React Hooks"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 bg-slate-50/50"
              />
              <p className="text-xs text-slate-400 mt-1.5">Minimal 3 karakter, maksimal 150 karakter.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Isi Catatan
              </label>
              <textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis ringkasan materi, rumus, atau poin penting di sini..."
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900 bg-slate-50/50 leading-relaxed resize-y"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100">
              <Link
                href="/notes"
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-100 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Catatan'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
