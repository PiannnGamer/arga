import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getNotes, saveNotes } from '@/lib/db';
import { noteSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const notes = getNotes();
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
  }

  if (note.userId !== user.id) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 403 });
  }

  return NextResponse.json(note);
}

export async function PUT(req: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const notes = getNotes();
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
  }

  if (notes[noteIndex].userId !== user.id) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 403 });
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
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    saveNotes(notes);
    return NextResponse.json(notes[noteIndex]);
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui catatan.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const notes = getNotes();
  const noteIndex = notes.findIndex((n) => n.id === id);

  if (noteIndex === -1) {
    return NextResponse.json({ error: 'Catatan tidak ditemukan' }, { status: 404 });
  }

  if (notes[noteIndex].userId !== user.id) {
    return NextResponse.json({ error: 'Tidak memiliki akses' }, { status: 403 });
  }

  const filteredNotes = notes.filter((n) => n.id !== id);
  saveNotes(filteredNotes);

  return NextResponse.json({ success: true, message: 'Catatan berhasil dihapus' });
}
