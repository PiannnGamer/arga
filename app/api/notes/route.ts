import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getNotes, saveNotes, Note } from '@/lib/db';
import { noteSchema } from '@/lib/validations';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notes = getNotes();
  const userNotes = notes
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json(userNotes);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = noteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, content } = result.data;
    const notes = getNotes();

    const newNote: Note = {
      id: 'note_' + Date.now() + Math.random().toString(36).substring(2, 7),
      title,
      content,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    saveNotes(notes);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat catatan.' },
      { status: 500 }
    );
  }
}
