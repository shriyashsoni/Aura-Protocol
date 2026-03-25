"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Database, Terminal, Wallet, Fingerprint, LayoutDashboard } from "lucide-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/identity", label: "Identity", icon: Fingerprint },
  { href: "/dashboard/market", label: "Market", icon: Database },
  { href: "/dashboard/inference", label: "Inference", icon: Terminal },
  { href: "/dashboard/vault", label: "Vault", icon: Wallet },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-7 h-7 border border-white/40 flex items-center justify-center rotate-45 group-hover:border-white transition-colors">
              <Brain className="w-3.5 h-3.5 -rotate-45 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <span className="font-bold text-base tracking-widest uppercase text-white/70 group-hover:text-white transition-colors">
              Aura
            </span>
          </Link>
          <span className="text-white/20 mx-2">/</span>
          <span className="text-sm text-neutral-400 font-mono">Dashboard</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/dashboard";
            const active = exact ? pathname === href : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-all rounded-none
                  ${active
                    ? "text-white bg-white/10 border border-white/20"
                    : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet */}
        <div className="[&>div]:w-full [&_button]:!bg-white [&_button]:!text-black [&_button]:!font-medium [&_button]:!text-xs [&_button]:!rounded-none [&_button]:!h-9 [&_button:hover]:!bg-neutral-200 [&_button]:!transition-colors [&_button]:!px-4">
          <WalletMultiButton />
        </div>
      </header>

      {/* Wallet address bar */}
      {publicKey && (
        <div className="border-b border-white/5 bg-white/[0.02] px-6 py-2 flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono text-neutral-500 tracking-wider">
            {publicKey}
          </span>
          <span className="text-xs font-mono text-green-400/70">● ALEO TESTNET</span>
        </div>
      )}

      {/* Mobile nav */}
      <nav className="md:hidden flex border-b border-white/10 overflow-x-auto bg-black/90 backdrop-blur-md sticky top-[61px] z-40">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                ${active
                  ? "text-white border-white"
                  : "text-neutral-500 border-transparent hover:text-white"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>

      <footer className="border-t border-white/5 px-6 py-4 text-xs font-mono text-neutral-600 flex items-center justify-between">
        <span>AURA PROTOCOL — ALEO TESTNET</span>
        <div className="flex space-x-6">
          <a href="https://api.explorer.provable.com/v1/testnet/program/profile_registry.aleo" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">profile_registry.aleo</a>
          <a href="https://api.explorer.provable.com/v1/testnet/program/data_market.aleo" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">data_market.aleo</a>
          <a href="https://api.explorer.provable.com/v1/testnet/program/inference_settlement.aleo" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-400 transition-colors">inference_settlement.aleo</a>
        </div>
      </footer>
    </div>
  );
}
