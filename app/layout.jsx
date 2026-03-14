import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';

const ibmPlexSans = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata = {
  title: 'HackFlow - Dynamic Posting Platform',
  description: 'A responsive, full-stack posting platform with authentication and CRUD features.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${ibmPlexSans.variable} min-h-screen bg-slate-50`}>
        <AuthProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
