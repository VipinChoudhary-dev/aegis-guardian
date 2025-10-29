import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GlobalShakeDetector } from '@/components/GlobalShakeDetector';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aegis Guardian - Perceptive Safety Ecosystem',
  description: 'Protecting tourists with proactive AI and blockchain technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-white min-h-screen`}>
        <LanguageProvider>
          <Providers>
            <GlobalShakeDetector />
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
