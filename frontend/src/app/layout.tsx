import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

const AleoWalletProvider = dynamic(
  () => import('./components/AleoWalletProvider').then(mod => mod.AleoWalletProvider),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Aura Protocol | Web3 AI Infrastructure',
  description: 'Minimalist black and white Web3 template for Confidential Compute.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AleoWalletProvider>
          {children}
        </AleoWalletProvider>
      </body>
    </html>
  );
}
