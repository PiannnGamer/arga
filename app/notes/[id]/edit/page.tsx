import { getCurrentUser } from '@/lib/auth';
import { getNotes } from '@/lib/db';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';
import EditNoteForm from './edit-form';

interface EditPageParams {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: EditPageParams) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const notes = getNotes();
  const note = notes.find((n) => n.id === id);

  if (!note || note.userId !== user.id) {
    redirect('/notes');
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Navbar user={user} />
      <EditNoteForm note={note} />
    </div>
  );
}
