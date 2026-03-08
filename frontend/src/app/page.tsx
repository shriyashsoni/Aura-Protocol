"use client";

import { Brain, Shield, Coins, Ticket, FileCode2, Database } from 'lucide-react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { publicKey } = useWallet();
  const router = useRouter();

  // Redirect to dashboard immediately if wallet is connected
  useEffect(() => {
    if (publicKey) {
      router.push("/dashboard/identity");
    }
  }, [publicKey, router]);

  return (
    <div className='min-h-screen bg-black text-white selection:bg-purple-900 selection:text-white'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,90,213,0.15),transparent_50%)] pointer-events-none' />

      <header className='flex justify-between items-center px-8 py-6 border-b border-gray-900 sticky top-0 bg-black/80 backdrop-blur z-50'>
        <div className='flex items-center space-x-2'>
          <Brain className='w-8 h-8 text-purple-500' />
          <span className='font-bold text-xl tracking-tighter'>AURA AI</span>
        </div>
        <nav className='hidden md:flex space-x-6 text-sm text-gray-400'>
          <a href='#features' className='hover:text-white transition'>Features</a>
          <a href='#ecosystem' className='hover:text-white transition'>Ecosystem</a>
          <a href='#' className='hover:text-white transition'>Docs</a>
        </nav>
        
        {/* Replace basic button with WalletMultiButton for direct connection */}
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:px-5 [&>.wallet-adapter-button]:py-2 [&>.wallet-adapter-button]:rounded-full [&>.wallet-adapter-button]:h-auto [&>.wallet-adapter-button:hover]:bg-gray-200 [&>.wallet-adapter-button]:transition">
            <WalletMultiButton />
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-4 pt-32 pb-24 relative z-10'>
        {/* Hero Section */}
        <section className='text-center space-y-8 mb-40'>
          <div className='inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-800 rounded-full px-4 py-1.5 text-sm mb-6'>
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
            <span className='text-gray-300'>Live on Aleo Testnet</span>
          </div>
          <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight'>
            Confidential Compute for <br/>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600'>Next-Gen AI Models</span>
          </h1>
          <p className='text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed'>
            A zero-knowledge marketplace for private data sets, inference requests, and decentralized compute validation. Build the uncompromised AI future.
          </p>
          <div className='flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-8'>
            <Link href="/dashboard/identity" className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-semibold transition w-full sm:w-auto text-lg flex items-center justify-center space-x-2'>
              <span>Launch App</span>
              <Brain className='w-5 h-5' />
            </Link>
            <button className='bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition w-full sm:w-auto text-lg flex items-center justify-center space-x-2'>
              <FileCode2 className='w-5 h-5' />
              <span>Read Documentation</span>
            </button>
          </div>
        </section>

        {/* Modular Protocol Architecture */}
        <section id='features' className='mb-40 pt-16'>
          <h2 className='text-3xl font-bold mb-12 text-center'>Powered by 5 ZK Smart Contracts</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition group'>
              <Shield className='w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold mb-2'>Profile Registry</h3>
              <p className='text-gray-400 leading-relaxed text-sm'>ZK identities storing demographic and role commitments on-chain without revealing actual values.</p>
            </div>
            <div className='p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition group'>
              <Database className='w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold mb-2'>Data Market</h3>
              <p className='text-gray-400 leading-relaxed text-sm'>List dataset identifiers with base prices and sell quotas while retaining complete privacy.</p>
            </div>
            <div className='p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition group'>
              <Ticket className='w-10 h-10 text-orange-400 mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold mb-2'>Access Ticketing</h3>
              <p className='text-gray-400 leading-relaxed text-sm'>Purchase single-use or perpetual dataset access tokens minted via the payment router.</p>
            </div>
            <div className='p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition group'>
              <Brain className='w-10 h-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold mb-2'>Inference Settlement</h3>
              <p className='text-gray-400 leading-relaxed text-sm'>Submit inference requests natively to off-chain models and verify computation hashes cryptographically.</p>
            </div>
            <div className='p-6 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition group lg:col-span-2 xl:col-span-1 border-t-4 border-t-yellow-500'>
              <Coins className='w-10 h-10 text-yellow-400 mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold mb-2'>Payment Router</h3>
              <p className='text-gray-400 leading-relaxed text-sm'>Secure escrow bridging data consumers, dataset providers, and node runners natively in Aleo credits.</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='border-t border-b border-gray-900 py-16 mb-40'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-4xl font-black text-white mb-2'>5</div>
              <div className='text-gray-500 text-sm uppercase tracking-wider'>ZK Contracts</div>
            </div>
            <div>
              <div className='text-4xl font-black text-white mb-2'>&lt;1s</div>
              <div className='text-gray-500 text-sm uppercase tracking-wider'>Proof Generation</div>
            </div>
            <div>
              <div className='text-4xl font-black text-white mb-2'>100%</div>
              <div className='text-gray-500 text-sm uppercase tracking-wider'>Confidentiality</div>
            </div>
            <div>
              <div className='text-4xl font-black text-white mb-2'>Aleo</div>
              <div className='text-gray-500 text-sm uppercase tracking-wider'>Network</div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-gray-900 bg-black py-12'>
        <div className='max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm'>
          <div className='flex items-center space-x-2 mb-4 md:mb-0'>
            <Brain className='w-5 h-5 text-gray-700' />
            <span>c 2026 Aura Confidential AI. Built on Aleo.</span>
          </div>
          <div className='flex space-x-6'>
            <a href='#' className='hover:text-white transition'>Twitter</a>
            <a href='#' className='hover:text-white transition'>Discord</a>
            <a href='#' className='hover:text-white transition'>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
