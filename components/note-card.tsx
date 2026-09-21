'use client';

import Link from 'next/link';
import { Calendar, Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function NoteCard({ id, title, content, updatedAt }: NoteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formattedDate = new Date(updatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Gagal menghapus catatan.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Terjadi kesalahan.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 inline-block">Catatan Belajar</span>
            <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-slate-500 text-sm line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        <div>
          <div className="flex items-center text-xs text-slate-400 mb-4 pt-3 border-t border-slate-100">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
            <span>Diperbarui: {formattedDate}</span>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Link
              href={`/notes/${id}/edit`}
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-2xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className="inline-flex items-center space-x-1 px-4 py-2 rounded-2xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Catatan Ini?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Catatan &quot;{title}&quot; yang dihapus tidak dapat dikembalikan lagi.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
