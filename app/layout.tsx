import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Catatan Belajar — Aplikasi Catatan Belajar Pribadi',
  description: 'Aplikasi catatan belajar pribadi yang bersih, cepat, dan nyaman.',
  openGraph: {
    title: 'Catatan Belajar',
    description: 'Aplikasi catatan belajar pribadi yang bersih, cepat, dan nyaman.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catatan Belajar',
    description: 'Aplikasi catatan belajar pribadi yang bersih, cepat, dan nyaman.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning className="bg-[#F7FAFC] text-[#1F2937] antialiased min-h-screen font-sans">{children}</body>
    </html>
  );
}
