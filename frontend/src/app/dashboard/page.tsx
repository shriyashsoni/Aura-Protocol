"use client";

import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState("profile");

  // Placeholder: Add real data fetching and actions in each section

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Connect your wallet to view the dashboard</h1>
        <div className="mb-8">Please connect your Aleo wallet to access your dashboard and on-chain data.</div>
        <div className="[&>.wallet-adapter-dropdown]:w-full [&>.wallet-adapter-button]:bg-white [&>.wallet-adapter-button]:text-black [&>.wallet-adapter-button]:font-medium [&>.wallet-adapter-button]:text-xs [&>.wallet-adapter-button]:rounded [&>.wallet-adapter-button]:h-10 [&>.wallet-adapter-button]:px-4 [&>.wallet-adapter-button]:py-2 [&>.wallet-adapter-button:hover]:bg-neutral-200 [&>.wallet-adapter-button]:transition-colors">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-black text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-10 text-2xl font-bold tracking-widest uppercase text-center">Dashboard</div>
        <nav className="flex flex-col gap-2">
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "profile" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("profile")}>Profile</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "marketplace" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("marketplace")}>Marketplace</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "tickets" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("tickets")}>Tickets</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "payments" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("payments")}>Payments</button>
          <button className={`text-left px-4 py-2 rounded transition-colors ${activeTab === "inference" ? "bg-white/10 text-green-400" : "hover:bg-white/10"}`} onClick={() => setActiveTab("inference")}>Inference</button>
        </nav>
        <div className="mt-auto pt-10 border-t border-white/10">
          <div className="text-xs text-neutral-400 mb-2">Wallet</div>
          <div className="font-mono text-green-400 break-all text-xs">{publicKey}</div>
          <div className="mt-4">
            <WalletMultiButton />
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "profile" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Profile</h2>
            <div className="bg-white/5 rounded p-6 mb-8">Profile details and actions go here.</div>
          </section>
        )}
        {activeTab === "marketplace" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Marketplace</h2>
            <div className="bg-white/5 rounded p-6 mb-8">Marketplace listings and actions go here.</div>
          </section>
        )}
        {activeTab === "tickets" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Tickets</h2>
            <div className="bg-white/5 rounded p-6 mb-8">Ticketing features and actions go here.</div>
          </section>
        )}
        {activeTab === "payments" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Payments</h2>
            <div className="bg-white/5 rounded p-6 mb-8">Payment features and actions go here.</div>
          </section>
        )}
        {activeTab === "inference" && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Inference</h2>
            <div className="bg-white/5 rounded p-6 mb-8">Inference features and actions go here.</div>
          </section>
        )}
      </main>
    </div>
  );
}
