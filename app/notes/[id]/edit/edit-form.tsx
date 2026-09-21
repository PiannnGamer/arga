'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface NoteData {
  id: string;
  title: string;
  content: string;
}

export default function EditNoteForm({ note }: { note: NoteData }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
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
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal memperbarui catatan.');
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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/notes"
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-[#64748B] hover:text-[#1E3A5F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Catatan</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#E2E8F0]">
          <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#4F9CF9] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1E3A5F]">Edit Catatan Belajar</h1>
            <p className="text-xs text-[#64748B]">Perbarui materi atau ringkasan catatan belajarmu</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Judul Catatan
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] text-sm text-[#1F2937]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-2">
              Isi Catatan
            </label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4F9CF9] text-sm text-[#1F2937] leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#E2E8F0]">
            <Link
              href="/notes"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#4F9CF9] hover:bg-[#3b86e8] text-white font-medium text-sm shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
