import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Failed to read JSON from ${filePath}:`, error);
    return fallback;
  }
}

function safeWriteJson(filePath: string, data: unknown) {
  ensureDataDir();

  const tempPath = `${filePath}.tmp`;
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(tempPath, json, 'utf-8');
  fs.renameSync(tempPath, filePath);
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUser: User = {
      id: 'user_demo_123',
      name: 'Arga Mahasiswa',
      email: 'demo@belajar.com',
      passwordHash: bcrypt.hashSync('password123', 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    safeWriteJson(USERS_FILE, [defaultUser]);
    return [defaultUser];
  }

  return safeReadJson<User[]>(USERS_FILE, []);
}

export function saveUsers(users: User[]) {
  safeWriteJson(USERS_FILE, users);
}

export function getNotes(): Note[] {
  ensureDataDir();
  if (!fs.existsSync(NOTES_FILE)) {
    const defaultNotes: Note[] = [
      {
        id: 'note_1',
        title: 'Pengantar Algoritma dan Struktur Data',
        content: 'Algoritma adalah langkah-langkah logis penyelesaian masalah. Struktur data mengatur penyimpanan data agar efisien dalam memori. Topik penting: Array, Linked List, Stack, Queue, dan Tree.',
        userId: 'user_demo_123',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'note_2',
        title: 'Dasar-Dasar Pemrograman Web Modern',
        content: 'HTML untuk struktur, CSS untuk styling dan estetika visual, JavaScript untuk interaktivitas dinamis. Framework seperti Next.js menggabungkan Server Components dan Client Components untuk performa optimal.',
        userId: 'user_demo_123',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'note_3',
        title: 'Konsep Dasar Database Relasional',
        content: 'Database relasional menyimpan data dalam tabel berelasi menggunakan SQL. Primary key dan foreign key memastikan integritas referensial antar tabel.',
        userId: 'user_demo_123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    safeWriteJson(NOTES_FILE, defaultNotes);
    return defaultNotes;
  }

  return safeReadJson<Note[]>(NOTES_FILE, []);
}

export function saveNotes(notes: Note[]) {
  safeWriteJson(NOTES_FILE, notes);
}
