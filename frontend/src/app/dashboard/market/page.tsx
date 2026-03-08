"use client";
import { Database, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

export default function MarketHub() {
  const { publicKey, requestTransaction } = useWallet();
  const [listingLoading, setListingLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const listDataset = async () => {
    if (!publicKey) return alert("Connect wallet first");
    try {
      setListingLoading(true);
      const API_URL = "/api";
      
      const payloadRes = await fetch(API_URL + '/v1/payloads/market/create-listing', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: Math.floor(Math.random() * 100000) + "field",
          profileId: "123456789field",
          profileRootCommitment: "123456789field",
          featureSchemaCommitment: "123456789field",
          accessPriceMicrocredits: "15000000u64", // 15 ALEO
          inferenceQuota: "50u32"
        })
      });

      if (!payloadRes.ok) throw new Error("Failed to generate listing payload.");
      const template = await payloadRes.json();
      
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        2_000_000
      );

      const txId = await requestTransaction?.(aleoTransaction) ?? "";
      alert("Listing transaction submitted: " + txId);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to list dataset");
    } finally {
      setListingLoading(false);
    }
  };

  const buyDataset = async (id: number, price: number) => {
    if (!publicKey) return alert("Connect wallet first");
    try {
      setBuyingId(id);
      const API_URL = "/api";
      
      const payloadRes = await fetch(API_URL + '/v1/payloads/payment/create-intent', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerAddress: publicKey, // mock provider
          listingId: "999field",
          intentId: Math.floor(Math.random() * 100000) + "field",
          amountMicrocredits: (price * 1_000_000).toString() + "u64",
          paymentCommitment: "12345field"
        })
      });

      if (!payloadRes.ok) throw new Error("Failed to generate payment intent.");
      const template = await payloadRes.json();
      
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        3_000_000
      );

      const txId = await requestTransaction?.(aleoTransaction) ?? "";
      alert("Payment intent transaction submitted: " + txId);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to buy dataset");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-light mb-2">Confidential Data Market</h2>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">data_market.aleo</p>
        </div>
        <button 
          onClick={listDataset} disabled={listingLoading}
          className="hidden md:flex items-center space-x-2 border border-white px-4 py-2 hover:bg-white hover:text-black disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-transparent transition-colors"
        >
          {listingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span className="font-mono text-xs uppercase">{listingLoading ? "Listing..." : "List Dataset"}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => {
          const price = 15 * i;
          return (
            <div key={i} className="flex items-center justify-between p-6 border border-white/10 bg-black hover:border-white/30 transition-colors">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/[0.02]">
                  <Database className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="font-mono font-semibold">MEDICAL_IMAGING_SET_{i}</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-1">Hash: 0x8f2...{i}9a | Quota: {40 - i * 10}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                  <div className="font-mono">{price} ALEO</div>
                  <div className="text-[10px] text-neutral-500 uppercase">Base Price</div>
                </div>
                <button 
                  onClick={() => buyDataset(i, price)} disabled={buyingId === i}
                  className="bg-white/5 border border-white/20 hover:bg-white hover:text-black disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-transparent px-6 py-3 font-mono text-xs uppercase transition-colors"
                >
                  {buyingId === i ? "Processing..." : "Purchase"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
