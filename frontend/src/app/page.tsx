"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Shield,
  Database,
  Ticket,
  Coins,
  Github,
  ChevronRight,
  Terminal,
  FileText,
  Globe,
  Activity,
  Lock,
  Fingerprint,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

const Hero3D = dynamic(() => import("./components/Hero3D"), { ssr: false });

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const TickerItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span
      className="text-2xl md:text-4xl font-black uppercase tracking-widest text-transparent transition-colors hover:text-white"
      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}
    >
      Aleo Network
    </span>
    <span className="w-3 h-3 rounded-full bg-white"></span>
    <span className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">
      Zero Knowledge
    </span>
    <span className="w-3 h-3 rounded-full bg-white"></span>
    <span
      className="text-2xl md:text-4xl font-black uppercase tracking-widest text-transparent transition-colors hover:text-white"
      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}
    >
      Provable API
    </span>
    <span className="w-3 h-3 rounded-full bg-white"></span>
    <span className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">
      Confidential Compute
    </span>
    <span className="w-3 h-3 rounded-full bg-white"></span>
    <span
      className="text-2xl md:text-4xl font-black uppercase tracking-widest text-transparent transition-colors hover:text-white"
      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)" }}
    >
      Leo Wallet
    </span>
    <span className="w-3 h-3 rounded-full bg-white"></span>
  </div>
);

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.replace('/dashboard');
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex flex-1 items-center space-x-3">
          <div className="w-8 h-8 border border-white flex items-center justify-center rotate-45">
            <Brain className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-widest uppercase">Aura Protocol</span>
        </div>
        <nav className="hidden md:flex flex-1 justify-center space-x-8 text-sm text-neutral-400 tracking-wide">
          <a href="#features" className="hover:text-white transition-colors">Architecture</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#docs" className="hover:text-white transition-colors">Whitepaper</a>
        </nav>
        <div className="flex flex-1 justify-end">
          <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:text-xs [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-8 [&>.wallet-adapter-button]:px-2 [&>.wallet-adapter-button]:py-1 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors">
            <WalletMultiButton />
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full">
        <section className="max-w-[1400px] mx-auto px-6 pt-8 md:pt-12 min-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start text-left max-w-2xl relative z-20"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 border border-white/10 rounded-full px-3 py-1 text-[10px] md:text-xs tracking-[0.16em] uppercase mb-6 bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span className="text-neutral-300">V1.0 LIVE ON ALEO TESTNET</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[1.08] mb-6 md:mb-8">
              Build the Future of <br />
              <span className="text-neutral-500">Web3 Infrastructure.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-lg lg:text-xl text-[#B3B3B3] leading-relaxed mb-12 font-light max-w-xl">
              A high-end, zero-knowledge execution environment. Seamlessly orchestrate private datasets and compute verification entirely on-chain.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {connected && (
                <a
                  href="/dashboard"
                  className="bg-white text-black px-8 py-4 font-semibold hover:bg-neutral-200 transition-all w-full sm:w-auto flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                  <span>View Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              )}
              <button className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-4 font-semibold transition-all w-full sm:w-auto flex items-center justify-center space-x-2">
                <Github className="w-4 h-4" />
                <span>View GitHub</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hidden lg:block relative w-full h-[600px]"
          >
            <Hero3D />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/[0.03] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-white/[0.02] rounded-full border-dashed pointer-events-none" />
          </motion.div>
        </section>

        <div className="w-full overflow-hidden border-y border-white/5 bg-white/5 py-8 mb-40 flex relative z-10">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex whitespace-nowrap"
          >
            <TickerItem />
            <TickerItem />
            <TickerItem />
            <TickerItem />
          </motion.div>
        </div>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="features"
          className="max-w-[1400px] mx-auto px-6 mb-40"
        >
          <motion.div variants={fadeIn} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Core Architecture</h2>
              <div className="h-[1px] w-24 bg-white/30"></div>
            </div>
            <p className="mt-4 md:mt-0 max-w-sm text-left md:text-right text-neutral-400 text-sm md:text-base font-light">
              Modular smart contracts handling the uncompromised privacy lifecycle natively on Aleo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Profile Registry", desc: "Zero-knowledge identities storing cryptographic demographic commitments." },
              { icon: Database, title: "Data Market", desc: "List dataset identifiers with absolute privacy and strict access quotas." },
              { icon: Ticket, title: "Access Ticketing", desc: "Tokenized authorization granting provable read rights to off-chain data." },
              { icon: Terminal, title: "Inference Settlement", desc: "Cryptographic validation of generative AI tasks and off-chain execution." },
              { icon: Coins, title: "Payment Escrow", desc: "Trustless routing of Aleo credits across all marketplace participants." },
              { icon: Fingerprint, title: "Identity Proof Engine", desc: "Generate private commitment proofs for role and access without exposing personal values." },
              { icon: Lock, title: "Confidential Vault", desc: "Escrow state management for locked payments and verified settlement across counterparties." },
              { icon: Activity, title: "Telemetry Layer", desc: "On-chain transaction observability and state sync signals for operator dashboards." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="p-10 border border-white/10 bg-black hover:bg-neutral-900/50 hover:border-white/40 transition-all duration-300 group cursor-default"
              >
                <feature.icon className="w-8 h-8 text-neutral-500 group-hover:text-white mb-8 transition-colors" strokeWidth={1} />
                <h3 className="text-xl font-semibold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="ecosystem"
          className="max-w-[1400px] mx-auto px-6 mb-40"
        >
          <motion.div variants={fadeIn} className="flex flex-col items-center text-center mb-16">
            <Globe className="w-12 h-12 text-white/50 mb-6" strokeWidth={1} />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The Aura Ecosystem</h2>
            <div className="h-[1px] w-24 bg-white/30 mb-6"></div>
            <p className="max-w-2xl text-neutral-400 text-base font-light">
              Integrated deeply with the absolute best infrastructure in the zero-knowledge and decentralized computation space.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={fadeIn} className="p-12 border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-white/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Aleo Network</h3>
              <p className="text-neutral-400 leading-relaxed font-light mb-8">
                The ultimate layer-1 blockchain for zero-knowledge applications. Aura utilizes Aleo&apos;s zkVM to execute marketplace logic without ever exposing the underlying data to the public.
              </p>
              <a href="#" className="inline-flex items-center space-x-2 text-sm font-semibold hover:text-neutral-300 transition-colors">
                <span className="opacity-70">Explore Aleo</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </a>
            </motion.div>
            <motion.div variants={fadeIn} className="p-12 border border-white/10 bg-gradient-to-br from-white/5 to-transparent hover:border-white/30 transition-colors">
              <h3 className="text-2xl font-bold mb-4">Leo Wallet</h3>
              <p className="text-neutral-400 leading-relaxed font-light mb-8">
                The leading privacy-preserving wallet for zero-knowledge proofs. Users connect seamlessly via standard adapter layers to securely route their Aleo credits.
              </p>
              <a href="#" className="inline-flex items-center space-x-2 text-sm font-semibold hover:text-neutral-300 transition-colors">
                <span className="opacity-70">Download Leo</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </a>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="docs"
          className="max-w-[1400px] mx-auto px-6 mb-40"
        >
          <div className="border border-white/10 bg-black p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeIn}>
                <FileText className="w-12 h-12 text-white/50 mb-8" strokeWidth={1} />
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Read the Whitepaper</h2>
                <p className="text-xl text-neutral-400 font-light mb-8 leading-relaxed">
                  Dive into the mathematical proofs, Leo program architectures, and economic models powering the Aura Protocol.
                </p>
                <button className="border border-white bg-white text-black hover:bg-transparent hover:text-white px-8 py-4 font-semibold transition-all flex items-center justify-center space-x-3">
                  <FileText className="w-5 h-5" />
                  <span>View Full Documentation</span>
                </button>
              </motion.div>
              <motion.div variants={fadeIn} className="hidden lg:block">
                <div className="p-8 border border-white/10 bg-white/5 font-mono text-xs text-neutral-500 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-white">AURA_PROTOCOL_ABSTRACT.md</span>
                    <span>12kb</span>
                  </div>
                  <p className="leading-relaxed">
                    1. Introduction<br />
                    The rapid expansion of artificial intelligence demands vast datasets...
                    <br />
                    <br />
                    2. Cryptographic Primitives<br />
                    By utilizing Aleo&apos;s Leo language to orchestrate...
                    <br />
                    <br />
                    3. Network Contracts<br />
                    Deployed at profile_registry.aleo...
                  </p>
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <span className="text-white bg-white/10 px-2 py-1">End of abstract snippet...</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 uppercase tracking-widest font-mono">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="w-6 h-6 border border-neutral-500 flex items-center justify-center rotate-45">
              <Brain className="w-3 h-3 -rotate-45" />
            </div>
            <span>© 2026 Aura Protocol. All rights reserved.</span>
          </div>

          <div className="flex space-x-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
