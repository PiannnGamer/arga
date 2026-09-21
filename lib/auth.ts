import { cookies } from 'next/headers';
import { getUsers, User } from './db';

const SESSION_COOKIE_NAME = 'catatan_belajar_session';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!userId) return null;

    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
