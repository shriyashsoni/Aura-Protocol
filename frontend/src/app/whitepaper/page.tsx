"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Cpu, Database, Shield, Terminal, Ticket, Coins, ExternalLink } from "lucide-react";

const ContractTicker = () => (
  <div className="flex items-center space-x-12 px-6">
    <span className="text-xl font-mono text-neutral-500">profile_registry.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
    <span className="text-xl font-mono text-white">data_market.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
    <span className="text-xl font-mono text-neutral-500">access_ticketing.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
    <span className="text-xl font-mono text-white">inference_settlement.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
    <span className="text-xl font-mono text-neutral-500">payment_router.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
    <span className="text-xl font-mono text-white">compute_validation.aleo</span>
    <span className="w-2 h-2 rounded-full bg-white/20"></span>
  </div>
);

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-mono tracking-widest uppercase">Back to Home</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border border-white flex items-center justify-center rotate-45">
              <Brain className="w-3 h-3 -rotate-45" />
            </div>
          </div>
        </div>
      </header>

      {/* Testnet Deployments Marquee Carousel */}
      <div className="w-full overflow-hidden border-b border-white/5 bg-white/5 py-4 flex relative z-10 hidden md:flex">
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap"
        >
          <ContractTicker />
          <ContractTicker />
          <ContractTicker />
          <ContractTicker />
        </motion.div>
      </div>

      <main className="max-w-[1000px] mx-auto px-6 pt-16 md:pt-24 pb-32">
        <div className="mb-16">
          <div className="inline-flex items-center space-x-2 border border-white/10 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase mb-8 bg-white/5">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-neutral-300">Official Documentation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">Aura Protocol: <br/><span className="text-neutral-500">The Technical Whitepaper</span></h1>
          <div className="flex items-center space-x-4 font-mono text-sm text-neutral-500 pb-8 border-b border-white/10 overflow-x-auto whitespace-nowrap">
            <span>Version 1.0</span>
            <span>|</span>
            <span>March 2026</span>
            <span>|</span>
            <span>Live on Aleo Testnet V3</span>
          </div>
        </div>

        <article className="max-w-none font-light text-neutral-300">
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 tracking-tight">1. Abstract</h2>
            <p className="leading-relaxed mb-6 text-lg">
              The rapid expansion of artificial intelligence requires massive, frequently proprietary, datasets combined with immense computation arrays. Exposing raw data to cloud environments or decentralized platforms fundamentally breaks corporate privacy and limits adoption for highly sensitive fields.
            </p>
            <p className="leading-relaxed mb-6 text-lg">
              The Aura Protocol introduces a completely modular decentralized, <strong>zero-knowledge execution environment</strong> built directly on the Aleo core network. Through mathematical cryptography, data providers are able to monetize their offline intelligence and compute nodes can validate generative workloads, without ever leaking raw bytes or intellectual property.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-8 tracking-tight">2. Deployed Protocol Architecture</h2>
            <p className="leading-relaxed mb-10 text-lg">
              Aura functions via 6 independent yet highly interconnected \Leo\ smart contracts. Each module passes cryptographically isolated Zero-Knowledge proofs ensuring that data pipelines operate seamlessly on-chain. All contracts are currently deployed and verifiable on the Aleo Testnet.
            </p>
            
            <div className="space-y-6">
              {/* Contract 1 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.1 Profile Registry</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/profile_registry.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>profile_registry.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">Handles Zero-Knowledge identities. Entities commit to their organizational profiles through on-chain Pedersen hashes. Actors utilize this layer to statically prove their eligibility, preventing sybil attacks while guaranteeing no wallet addresses or personal metadata are publicly stored.</p>
              </div>
              
              {/* Contract 2 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Database className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.2 Data Market</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/data_market.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>data_market.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">The global repository of off-chain encrypted data identifiers, dynamically managing access quotas and base Aleo-credit pricing models. Every listing operates confidentially.</p>
              </div>

              {/* Contract 3 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Ticket className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.3 Access Ticketing</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/access_ticketing.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>access_ticketing.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">Orchestrates single-use or perpetual tokenized authorizations. Inference requests are impossible unless the requester is in mathematical possession of the encrypted ticket minted out of the network.</p>
              </div>

              {/* Contract 4 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Terminal className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.4 Inference Settlement</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/inference_settlement.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>inference_settlement.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">Cryptographically maps inference logic requests to validation pipelines. The node runner submits a zkSNARK of the AI execution, and if successfully validated, triggers the state-transition closing the settlement.</p>
              </div>

              {/* Contract 5 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Coins className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.5 Payment Escrow</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/payment_router.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>payment_router.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">Trustless routing and automated liquidity. Escrow holds AI-consumer funds pending a verified payload delivery, effectively omitting platform risk for both the data provider and node runner.</p>
              </div>

              {/* Contract 6 */}
              <div className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Cpu className="w-6 h-6 text-white" strokeWidth={1.5} />
                    <h3 className="text-xl font-semibold text-white m-0">2.6 Compute Validation</h3>
                  </div>
                  <a href="https://api.explorer.provable.com/v1/testnet/program/compute_validation.aleo" target="_blank" rel="noreferrer" className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors bg-black px-4 py-2 border border-white/10">
                    <span>compute_validation.aleo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="leading-relaxed">Decentralized network bridging off-chain LLM pipelines (Llama 3, Mistral) onto the Aleo network by validating inference bounds using cryptographically sound SNARK checkpoints.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 tracking-tight">3. Network Economics & Settlement</h2>
            <p className="leading-relaxed mb-6 text-lg">
              Because Aura employs absolute ZK proof methodologies, validators are unable to arbitrarily freeze transactions or selectively review payload models. Upon the <code>inference_settlement</code> contract accepting a verified state transition, <strong>Payment Escrow</strong> systematically unpacks Aleo Credits.
            </p>
            <ul className="list-disc pl-6 space-y-4 marker:text-neutral-500 font-mono text-sm leading-relaxed tracking-wide">
              <li><span className="text-white">NODE RUNNER:</span> Consumes 45% of total payload fee for computational delivery.</li>
              <li><span className="text-white">DATA PROVIDER:</span> Consumes 50% of total payload fee for private network injection.</li>
              <li><span className="text-white">AURA TREASURY:</span> 5% flat mapping cost for recursive execution funding.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-white mb-6 tracking-tight">4. Conclusion</h2>
            <p className="leading-relaxed text-lg">
              Aura unlocks the fundamental bottleneck in decentralized enterprise artificial intelligence. By intertwining the sheer mathematical power of Aleo with carefully tuned game theoretics across an elegant suite of ZK smart contracts, Aura bridges the gap to a fully confidential AI operating system. 
            </p>
          </section>
        </article>

        <div className="mt-32 pt-16 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm font-mono text-neutral-500">
          <p>END OF SPECIFICATION_DOC</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-white transition-colors mt-4 sm:mt-0"
          >
            [ RETURN TO TOP ]
          </button>
        </div>
      </main>
    </div>
  );
}
