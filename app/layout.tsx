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
  metadataBase: new URL('https://vediq.net'),
  title: 'Vediq — Close value-based opportunities during the encounter',
  description: 'AI-assisted encounter guidance for documentation, risk and quality opportunities, with clinicians in control.',
  openGraph: { title: 'Vediq — Close more opportunities during the encounter', description: 'Encounter intelligence for primary care and value-based care teams.', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Vediq — Close more opportunities during the encounter', description: 'Encounter intelligence for primary care and value-based care teams.', images: ['/og.png'] },
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
