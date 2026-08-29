import type { Metadata } from 'next';
import { Geist, Geist_Mono, Fraunces } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Vediq — The intelligent sidecar for value-based care',
  description: 'Ambient intelligence, RAF recapture, gap closure, ICD and CPT coding support, and real-time EHR write-back at the point of care.',
  openGraph: { title: 'Vediq — Every encounter, fully activated', description: 'The intelligent clinical sidecar for value-based care.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Vediq — Every encounter, fully activated', description: 'The intelligent clinical sidecar for value-based care.', images: ['/og.png'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
