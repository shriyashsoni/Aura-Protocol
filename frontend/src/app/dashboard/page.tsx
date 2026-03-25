"use client";

import Link from "next/link";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Database, Terminal, Wallet, Fingerprint, ExternalLink, ChevronRight, Activity } from "lucide-react";

const CONTRACTS = [
  { name: "profile_registry.aleo", fn: "register_profile / rotate_profile" },
  { name: "data_market.aleo", fn: "create_listing / update_listing / close_listing" },
  { name: "access_ticketing.aleo", fn: "issue_ticket / mark_consumed / mark_expired" },
  { name: "inference_settlement.aleo", fn: "settle / attest_receipt" },
  { name: "payment_router.aleo", fn: "create_payment_intent / confirm_payment / cancel_payment" },
];

const QUICK_LINKS = [
  { href: "/dashboard/identity", icon: Fingerprint, label: "Identity", desc: "Register & manage your ZK profile" },
  { href: "/dashboard/market", icon: Database, label: "Data Market", desc: "Create & browse dataset listings" },
  { href: "/dashboard/inference", icon: Terminal, label: "Inference Engine", desc: "Submit & settle AI compute tasks" },
  { href: "/dashboard/vault", icon: Wallet, label: "Escrow Vault", desc: "Lock & route Aleo credits" },
];

export default function DashboardOverviewPage() {
  const { publicKey } = useWallet();

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h2 className="text-3xl font-light mb-2 flex items-center gap-3">
          <Activity className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          Overview
        </h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          Aura Protocol · Aleo Testnet
        </p>
      </div>

      {/* Wallet status banner */}
      <div className={`border p-5 mb-10 ${publicKey ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}`}>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${publicKey ? "bg-green-400 animate-pulse" : "bg-yellow-400 animate-pulse"}`} />
          {publicKey ? (
            <div>
              <p className="text-green-400 text-sm font-medium">Wallet Connected</p>
              <p className="text-green-500/60 text-xs font-mono mt-1 break-all">{publicKey}</p>
            </div>
          ) : (
            <div>
              <p className="text-yellow-400 text-sm font-medium">Wallet Not Connected</p>
              <p className="text-yellow-500/60 text-xs mt-1">Connect your Leo Wallet to interact with Aura Protocol contracts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="border border-white/10 bg-black hover:bg-white/[0.04] hover:border-white/30 transition-all group p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors shrink-0">
              <Icon className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{label}</h3>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-neutral-500 text-sm mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Contract registry */}
      <div className="border border-white/10 bg-black p-8">
        <h3 className="text-lg font-medium mb-5 text-white/90">Deployed Contract Registry</h3>
        <div className="space-y-3">
          {CONTRACTS.map((c) => (
            <div key={c.name} className="border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-sm text-white truncate">{c.name}</p>
                <p className="text-xs text-neutral-600 font-mono mt-1 truncate">{c.fn}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <a
                  href={`https://api.explorer.provable.com/v1/testnet/program/${c.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider">Network:</span>
          <span className="text-xs font-mono text-neutral-400">Aleo Testnet (V12)</span>
          <span className="mx-2 text-neutral-700">·</span>
          <a
            href="https://testnet.provable.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            Open Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
