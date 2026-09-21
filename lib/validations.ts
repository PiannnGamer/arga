import { z } from 'zod';

export const noteSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(150, 'Judul maksimal 150 karakter'),
  content: z
    .string()
    .min(1, 'Isi catatan wajib diisi'),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type NoteInput = z.infer<typeof noteSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
