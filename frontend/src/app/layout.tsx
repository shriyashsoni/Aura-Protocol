import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AleoWalletProvider } from './components/AleoWalletProvider';

const inter = Inter({ subsets: ['latin'] });

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
