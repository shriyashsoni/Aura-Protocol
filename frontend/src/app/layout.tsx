import type { Metadata } from 'next';
import './globals.css';
import { WalletProviders } from './components/WalletProviders';

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
      <body>
        <WalletProviders>
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
