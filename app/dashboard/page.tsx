import { getCurrentUser } from '@/lib/auth';
import { getNotes } from '@/lib/db';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import NoteCard from '@/components/note-card';
import Link from 'next/link';
import { Plus, BookOpen, FileText, ArrowRight, Flame, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const allNotes = getNotes();
  const userNotes = allNotes
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const totalNotes = userNotes.length;
  const recentNotes = userNotes.slice(0, 3);
  const latestNote = userNotes[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bento Grid Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Continue Reading / Welcome Bento Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
            <div>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Dashboard Belajar
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-2 leading-tight text-slate-900">
                Halo, {user.name}! 👋
              </h1>
              <p className="text-slate-500 max-w-lg text-sm sm:text-base leading-relaxed">
                {latestNote
                  ? `Catatan terakhir Anda: "${latestNote.title}". Terus tingkatkan progres belajar Anda hari ini.`
                  : 'Selamat datang di ruang catatan belajarmu. Mari buat catatan pertamamu!'}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <Link
                href="/notes/new"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-100 flex items-center space-x-2 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Catatan Baru</span>
              </Link>
              <Link
                href="/notes"
                className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-sm"
              >
                Semua Catatan ({totalNotes})
              </Link>
            </div>
          </div>

          {/* Study Streak Bento Card */}
          <div className="lg:col-span-4 bg-indigo-950 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Status Aktivitas</p>
                <p className="text-3xl font-bold mt-1">Aktif Belajar</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md text-indigo-300">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-indigo-200">Total Koleksi Catatan</span>
                <span className="text-white font-bold">{totalNotes} Catatan</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 w-full"></div>
              </div>
              <p className="text-[11px] text-indigo-300">Akun terverifikasi dan siap digunakan.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats & Smart Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Catatan</p>
              <p className="text-2xl font-bold text-slate-900">{totalNotes}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Status Sistem</p>
              <p className="text-lg font-bold text-slate-900">Online & Sinkron</p>
            </div>
          </div>

          <div className="bg-emerald-500 rounded-3xl p-6 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6" />
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-emerald-100">Smart Hub</p>
                <p className="text-sm font-semibold">Akses Cepat Aktif</p>
              </div>
            </div>
            <span className="bg-white/25 px-3 py-1 rounded-full text-xs font-bold">{totalNotes} Item</span>
          </div>
        </div>

        {/* Recent Notes Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Catatan Terbaru</h2>
          {userNotes.length > 0 && (
            <Link
              href="/notes"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Lihat Semua ({totalNotes})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {userNotes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada catatan</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Yuk buat catatan belajar pertamamu untuk merangkum materi hari ini!
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
            {recentNotes.map((note) => (
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
