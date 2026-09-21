import { getCurrentUser } from '@/lib/auth';
import { getNotes } from '@/lib/db';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import NoteCard from '@/components/note-card';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';

export default async function NotesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const allNotes = getNotes();
  const userNotes = allNotes
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Daftar Catatan Belajar</h1>
            <p className="text-slate-500 text-sm mt-1">
              Kelola dan telusuri seluruh catatan belajar yang telah kamu buat ({userNotes.length} catatan)
            </p>
          </div>
          <Link
            href="/notes/new"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-100 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </Link>
        </div>

        {userNotes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada catatan belajar</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Mulai buat catatan belajarmu sekarang agar materi mudah dipelajari kembali.
            </p>
            <Link
              href="/notes/new"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Catatan Pertama</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                updatedAt={note.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
