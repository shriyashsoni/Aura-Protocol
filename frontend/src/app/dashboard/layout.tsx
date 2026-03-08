"use client";
import "../globals.css";
import { Terminal, Lock, Database, User, Activity, Globe, Wallet } from "lucide-react";
import Link from 'next/link';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

function DashboardContent({ children }: any) {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#070707] text-white">
        <div className="max-w-md w-full p-8 border border-[#1a1a1a] bg-black text-center">
          <Wallet className="w-16 h-16 text-neutral-500 mx-auto mb-6" />
          <h2 className="text-2xl font-light mb-2">Connect Wallet</h2>
          <p className="text-neutral-500 text-sm mb-8">You must authenticate via an Aleo wallet to access the confidential compute dashboard.</p>
          <div className="flex justify-center [&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-mono [&>.wallet-adapter-button]:text-sm [&>.wallet-adapter-button]:uppercase [&>.wallet-adapter-button]:tracking-widest [&>.wallet-adapter-button]:rounded-none [&>.wallet-adapter-button]:h-12 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors [&>.wallet-adapter-button]:flex [&>.wallet-adapter-button]:justify-center">
             <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="border-b border-[#1a1a1a] h-20 px-8 flex items-center justify-between sticky top-0 bg-[#070707]/90 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center font-mono text-xs tracking-widest uppercase text-neutral-400">
          <Activity className="w-4 h-4 mr-3 animate-pulse text-green-500" /> System Metrics Online
        </div>
        <div className="font-mono text-xs bg-black px-4 py-2 border border-[#1a1a1a] flex items-center shadow-inner">
          Aleo Sync: <span className="text-white ml-2">Synced</span>
        </div>
      </header>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { name: "Identity", href: "/dashboard/identity", icon: User },
    { name: "Data Market", href: "/dashboard/market", icon: Database },
    { name: "Inference", href: "/dashboard/inference", icon: Terminal },
    { name: "Escrow Vault", href: "/dashboard/vault", icon: Lock },
  ];

  return (
      <div className="h-screen flex bg-[#070707] text-white select-none overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#1a1a1a] flex flex-col bg-black h-screen sticky top-0 shrink-0">
          <div className="p-6 border-b border-[#1a1a1a]">
            {/* Custom Wallet Button Override */}
            <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-dropdown-list]:bg-black [&>.wallet-adapter-dropdown-list]:border [&>.wallet-adapter-dropdown-list]:border-[#1a1a1a] [&>.wallet-adapter-dropdown-list-item]:font-mono [&>.wallet-adapter-dropdown-list-item]:text-xs [&>.wallet-adapter-dropdown-list-item:hover]:bg-white/10 [&>.wallet-adapter-button]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-mono [&>.wallet-adapter-button]:text-xs [&>.wallet-adapter-button]:uppercase [&>.wallet-adapter-button]:tracking-widest [&>.wallet-adapter-button]:rounded-none [&>.wallet-adapter-button]:h-12 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors [&>.wallet-adapter-button]:flex [&>.wallet-adapter-button]:justify-center">
              <div suppressHydrationWarning>
                <WalletMultiButton />
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 py-8 space-y-2 overflow-y-auto relative">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-none transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 group-hover:text-green-400 transition-colors" strokeWidth={1.5} />
                  <span className="font-mono text-xs tracking-wider uppercase">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-[#1a1a1a] text-xs font-mono text-neutral-500 flex flex-col space-y-4 shrink-0">
             <div className="flex items-center justify-between">
                <span>Network</span>
                <span className="text-green-400 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    Testnet
                </span>
             </div>
             <div className="flex items-center justify-between">
                <span>Nodes</span>
                <span>Active</span>
             </div>
             <div className="flex items-center justify-between">
                 <Link href="/" className="hover:text-white flex items-center transition-colors">
                     <Globe className="w-3 h-3 mr-2" /> Main Site
                 </Link>
             </div>
          </div>
        </aside>

        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
  );
}
