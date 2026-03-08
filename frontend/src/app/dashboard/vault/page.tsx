"use client";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function VaultEngine() {
  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h2 className="text-3xl font-light mb-2">Escrow Vault</h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">payment_router.aleo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <h3 className="text-lg font-medium mb-1">Locked Value</h3>
          <div className="text-4xl font-light font-mono text-green-400 mb-4">12,500 <span className="text-sm text-neutral-500">ALEO</span></div>
          <div className="flex items-center text-xs text-neutral-400 font-mono">
            <Lock className="w-3 h-3 mr-2" /> Fully collateralized smart contracts
          </div>
        </div>
        <div className="border border-white/10 p-6 bg-white/[0.02] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Active Routings</h3>
            <div className="text-2xl font-light font-mono">4</div>
          </div>
          <ShieldCheck className="w-12 h-12 text-neutral-700" strokeWidth={1} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-light mb-6 border-b border-white/10 pb-2">Recent Transactions</h3>
        <div className="space-y-4">
          {[
            { id: "tx_9p2l...4v1a", type: "PAYMENT_IN", amount: "+ 500", status: "VERIFIED" },
            { id: "tx_8m1x...2k0b", type: "ESCROW_LOCK", amount: "- 1,200", status: "PENDING" },
            { id: "tx_3z4c...9j5d", type: "DATA_SETTLEMENT", amount: "+ 50", status: "VERIFIED" },
          ].map((tx) => (
            <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-white/5 hover:border-white/20 transition-colors group">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <div className="font-mono text-sm">{tx.id}</div>
                  <div className="text-xs text-neutral-500 font-mono">{tx.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-right">
                <div className={"font-mono " + (tx.amount.startsWith("+") ? "text-green-400" : "text-neutral-300")}>
                  {tx.amount}
                </div>
                <div className="w-24">
                  <span className={"text-xs font-mono px-2 py-1 rounded " + (tx.status === "VERIFIED" ? "bg-white/10 text-white" : "bg-neutral-900 text-neutral-500")}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
