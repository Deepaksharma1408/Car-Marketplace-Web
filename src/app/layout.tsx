import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/features/theme/ThemeContext';
import { DemoModeBar } from '@/components/layout/DemoModeBar';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { SITE_CONFIG } from '@/config/site';
import { AuthHydration } from '@/features/auth/AuthHydration';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Dubai supercars',
    'Dubai luxury cars for sale',
    'video car marketplace',
    'Rolls-Royce Dubai',
    'Ferrari Dubai',
    'Porsche Dubai',
    'Vehicle Spot',
    'verified Dubai car dealers',
  ],
  authors: [{ name: 'Vehicle Spot UAE' }],
  metadataBase: new URL('https://vehiclespot.ae'),
  openGraph: {
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: 'https://vehiclespot.ae',
    siteName: SITE_CONFIG.name,
    locale: 'en_AE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="monaco" className={`${sora.variable} ${inter.variable} antialiased light`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-bg text-text selection:bg-accent/30 selection:text-accent flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <AuthHydration />
            <DemoModeBar />
            <div className="flex-1 flex flex-col w-full">
              {children}
            </div>
            <CookieBanner />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
