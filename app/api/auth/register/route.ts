import { NextResponse } from 'next/server';
import { getUsers, saveUsers, User } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;
    const users = getUsers();

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: 'user_' + Date.now() + Math.random().toString(36).substring(2, 7),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('catatan_belajar_session', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, message: 'Registrasi berhasil' });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}
