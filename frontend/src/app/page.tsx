"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Database, Ticket, Coins, Github, Twitter, MessageCircle, ChevronRight, Terminal } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-hidden">
      {/* Subtle Grid Background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border border-white flex items-center justify-center rotate-45">
            <Brain className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-widest uppercase">Aura Protocol</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm text-neutral-400 tracking-wide">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
        </nav>
        <button className="border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white px-6 py-2 text-sm font-medium transition-all duration-300">
          Connect Wallet
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Hero Section */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10 mb-32 relative">
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-4xl flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 border border-white/10 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase mb-8 bg-white/5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-neutral-300">v1.0 Live on Aleo Testnet</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-6">
              Build the Future of <br />
              <span className="text-neutral-500">Web3 Infrastructure.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
              A high-end, zero-knowledge execution environment. Seamlessly orchestrate private datasets and compute verification entirely on-chain.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              <button className="bg-white text-black px-8 py-4 font-semibold hover:bg-neutral-200 transition-all w-full sm:w-auto flex items-center justify-center space-x-2 rounded-none">
                <span>Launch App</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="bg-black border border-white/20 text-white hover:bg-white/10 px-8 py-4 font-semibold transition-all w-full sm:w-auto flex items-center justify-center space-x-2 rounded-none">
                <Github className="w-4 h-4" />
                <span>View GitHub</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Animated Abstract Element */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full -z-10 flex items-center justify-center"
          >
            <div className="w-[600px] h-[600px] border border-white/[0.03] rounded-full flex items-center justify-center border-dashed">
              <div className="w-[400px] h-[400px] border border-white/[0.04] rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          id="features" className="mb-40 pt-16"
        >
          <motion.div variants={fadeIn} className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Core Architecture</h2>
            <div className="h-[1px] w-24 bg-white/20"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Profile Registry", desc: "Zero-knowledge identities storing cryptographic demographic commitments." },
              { icon: Database, title: "Data Market", desc: "List dataset identifiers with absolute privacy and strict access quotas." },
              { icon: Ticket, title: "Access Ticketing", desc: "Tokenized authorization granting provable read rights to off-chain data." },
              { icon: Terminal, title: "Inference Settlement", desc: "Cryptographic validation of generative AI tasks and off-chain execution." },
              { icon: Coins, title: "Payment Escrow", desc: "Trustless routing of Aleo credits across all marketplace participants." }
            ].map((feature, i) => (
              <motion.div 
                key={i} variants={fadeIn}
                className="p-8 border border-white/10 bg-black hover:bg-neutral-900/50 hover:border-white/40 transition-all duration-300 group cursor-default"
              >
                <feature.icon className="w-8 h-8 text-neutral-400 group-hover:text-white mb-6 transition-colors" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="border-y border-white/10 py-20 mb-40 bg-white/[0.01]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/5">
            {[
              { value: "20K+", label: "Developers" },
              { value: "100+", label: "Projects" },
              { value: "1M+", label: "Transactions" },
              { value: "100%", label: "Confidentiality" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeIn} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-3">{stat.value}</div>
                <div className="text-neutral-500 text-sm uppercase tracking-widest font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Community Section */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="mb-32 text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeIn} className="text-3xl font-bold tracking-tight mb-6">Join the Ecosystem</motion.h2>
          <motion.p variants={fadeIn} className="text-neutral-400 mb-10 font-light">
            Collaborate with developers creating the next generation of private, decentralized AI infrastructure.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center space-x-2 px-6 py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Discord</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all">
              <Twitter className="w-4 h-4" />
              <span className="text-sm font-medium">X (Twitter)</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all">
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </motion.div>
        </motion.section>

      </main>

      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-6 h-6 border border-neutral-500 flex items-center justify-center rotate-45">
                  <Brain className="w-3 h-3 text-neutral-500 -rotate-45" />
                </div>
                <span className="font-bold tracking-widest text-sm uppercase text-neutral-300">Aura</span>
              </div>
              <p className="text-neutral-500 text-xs leading-relaxed max-w-xs">
                Pioneering confidential compute for the new machine intelligence era.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Developers</h4>
              <ul className="space-y-4 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Ecosystem</h4>
              <ul className="space-y-4 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Aleo Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Node Runners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grants</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-4 text-xs text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Brand Kit</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600">
            <span>© 2026 Aura Protocol. Open Source Software.</span>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
