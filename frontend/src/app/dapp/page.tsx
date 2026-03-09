"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Database,
  Terminal,
  Coins,
  Wallet,
  Send,
  Activity,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function DAppPage() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-white flex items-center justify-center rotate-45">
              <Brain className="w-4 h-4 -rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-widest uppercase">Aura dApp</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-neutral-500 hidden md:inline break-all max-w-[200px] truncate">
            {publicKey}
          </span>
          <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:text-sm [&>.wallet-adapter-button]:rounded-none [&>.wallet-adapter-button]:h-10 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors">
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-8"
        >
          <motion.div variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Welcome to Aura</h1>
            <p className="text-neutral-400 font-light">Your confidential AI marketplace console.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={fadeIn} className="lg:col-span-2 border border-white/10 bg-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Inference Console</h3>
                <span className="text-xs font-mono text-neutral-500 uppercase">inference_settlement.aleo</span>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-4 h-56 flex flex-col">
                <div className="font-mono text-xs text-neutral-400 space-y-2 flex-1">
                  <p>AURA_TERMINAL_v1 initialized...</p>
                  <p>Awaiting prompt payload and wallet signature.</p>
                  <p className="text-green-400">~/&gt; Secure compute ready</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <input
                    className="flex-1 bg-black border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30 transition-colors"
                    placeholder="Analyze private dataset intent..."
                    readOnly
                  />
                  <button className="bg-white text-black px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                    <Send className="w-4 h-4" /> Run
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="border border-white/10 bg-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Identity State</h3>
                <Wallet className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="border border-white/10 bg-white/[0.02] p-3 flex justify-between">
                  <span className="text-neutral-400">KYC Commitment</span>
                  <span className="text-green-400">Valid</span>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-3 flex justify-between">
                  <span className="text-neutral-400">Proof Access</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-3 flex justify-between">
                  <span className="text-neutral-400">Network</span>
                  <span className="text-white">Aleo Testnet</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} className="border border-white/10 bg-black p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold">Data Market Feed</h3>
                <Database className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="space-y-3 text-sm">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-white/10 bg-white/[0.02] p-3 flex items-center justify-between">
                    <span className="font-mono">MEDICAL_IMAGING_SET_{item}</span>
                    <span className="text-neutral-300">{item * 15} ALEO</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="border border-white/10 bg-black p-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold">Escrow Vault</h3>
                <Shield className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-neutral-500 mb-2">Locked Value</p>
                  <p className="text-2xl font-light">12,500</p>
                  <p className="text-xs text-neutral-500">ALEO</p>
                </div>
                <div className="border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-neutral-500 mb-2">Active Routings</p>
                  <p className="text-2xl font-light">4</p>
                  <p className="text-xs text-neutral-500">LIVE</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Profile Registry", status: "Active" },
              { icon: Terminal, label: "Inference Engine", status: "Ready" },
              { icon: Coins, label: "Payment Router", status: "Online" },
              { icon: Activity, label: "Telemetry", status: "Streaming" },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 bg-black p-4 flex flex-col items-center text-center gap-2">
                <item.icon className="w-6 h-6 text-neutral-500" strokeWidth={1} />
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-green-400">{item.status}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
