import type { Metadata } from 'next';
import { Nunito, Quicksand, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'MomSpace — Dashboard Pemerintah',
  description: 'Dashboard analitik ruang laktasi untuk Dinas Kesehatan DKI Jakarta.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${nunito.variable} ${quicksand.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
