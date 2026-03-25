"use client";

import { Database, CheckCircle2, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";



type FormState = {
  listingId: string;
  profileId: string;
  accessPriceMicrocredits: string;
  inferenceQuota: string;
};

type Status = "idle" | "building" | "signing" | "done" | "error";

export default function DataMarketPage() {
  const { publicKey, requestTransaction } = useWallet();
  const [form, setForm] = useState<FormState>({
    listingId: "",
    profileId: "",
    accessPriceMicrocredits: "1000000",
    inferenceQuota: "100",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const createListing = async () => {
    if (!publicKey) return alert("Connect your Leo Wallet first.");
    if (!form.listingId || !form.profileId) return alert("Listing ID and Profile ID are required.");

    setStatus("building");
    setErrorMsg(null);
    setTxId(null);

    try {
      const payloadRes = await fetch("/api/v1/market/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: form.listingId,
          profileId: form.profileId,
          accessPriceMicrocredits: form.accessPriceMicrocredits,
          inferenceQuota: form.inferenceQuota,
        }),
      });
      if (!payloadRes.ok) {
        const err = await payloadRes.json();
        throw new Error(err.error || "Failed to build payload");
      }
      const template = await payloadRes.json();

      setStatus("signing");

      const aleoTx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        3_000_000
      );

      const result = await requestTransaction?.(aleoTx);
      setTxId(result ?? "submitted");
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Unknown error");
      setStatus("error");
    }
  };

  const isLoading = status === "building" || status === "signing";

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h2 className="text-3xl font-light mb-2 flex items-center gap-3">
          <Database className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          Data Market
        </h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          data_market.aleo · create_listing
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mb-10 text-xs font-mono">
        {[
          { n: "01", label: "List Dataset", desc: "Register a private dataset identifier + price on-chain" },
          { n: "02", label: "Consumer Pays", desc: "Buyer creates a payment intent via payment_router.aleo" },
          { n: "03", label: "Ticket Minted", desc: "Access ticket issued; inference can begin" },
        ].map((s) => (
          <div key={s.n} className="border border-white/10 bg-white/[0.02] p-4">
            <div className="text-neutral-600 text-lg font-bold mb-2">{s.n}</div>
            <div className="text-white mb-1">{s.label}</div>
            <div className="text-neutral-500 text-[11px] leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Create Listing Form */}
      <div className="border border-white/10 bg-black p-8">
        <h3 className="text-lg font-medium mb-6 text-white/90">Create New Listing</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Listing ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.listingId}
              onChange={(e) => updateField("listingId", e.target.value)}
              placeholder="e.g. medical_imaging_001"
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder-neutral-700 outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Profile ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.profileId}
              onChange={(e) => updateField("profileId", e.target.value)}
              placeholder="e.g. 123456789"
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder-neutral-700 outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Price (microcredits)
            </label>
            <input
              type="number"
              value={form.accessPriceMicrocredits}
              onChange={(e) => updateField("accessPriceMicrocredits", e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-neutral-600 mt-1 font-mono">
              = {(Number(form.accessPriceMicrocredits) / 1_000_000).toFixed(4)} ALEO
            </p>
          </div>
          <div>
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Inference Quota
            </label>
            <input
              type="number"
              value={form.inferenceQuota}
              onChange={(e) => updateField("inferenceQuota", e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-neutral-600 mt-1 font-mono">max API calls allowed</p>
          </div>
        </div>

        {/* Status messages */}
        {status === "done" && txId && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-green-400 text-sm font-medium mb-1">Listing submitted to Aleo Testnet</p>
              <p className="text-green-500/70 text-xs font-mono break-all">TX: {txId}</p>
              <a
                href={`https://testnet.provable.tools/transaction/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-400/60 hover:text-green-400 mt-1"
              >
                View on Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {status === "error" && errorMsg && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        <button
          onClick={createListing}
          disabled={isLoading || !publicKey}
          className="bg-white text-black px-8 py-3 text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:bg-neutral-800 disabled:text-neutral-500 inline-flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {status === "building" ? "Building Payload..." : "Awaiting Wallet Signature..."}
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              Create Listing on Aleo
            </>
          )}
        </button>

        {!publicKey && (
          <p className="text-xs text-neutral-600 mt-3 font-mono">Connect your Leo Wallet to create listings.</p>
        )}
      </div>

      {/* Sample listings */}
      <div className="mt-8 border border-white/10 bg-black p-8">
        <h3 className="text-lg font-medium mb-5 text-white/90">Live Market Feed</h3>
        <div className="space-y-3">
          {[
            { id: "medical_imaging_001", price: "15,000,000", quota: 500, status: "ACTIVE" },
            { id: "financial_timeseries_q1", price: "8,000,000", quota: 200, status: "ACTIVE" },
            { id: "satellite_imagery_batch_7", price: "45,000,000", quota: 50, status: "ACTIVE" },
          ].map((l) => (
            <div key={l.id} className="border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm text-white">{l.id}</span>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-neutral-500">{(Number(l.price.replace(/,/g, "")) / 1_000_000).toFixed(2)} ALEO per access</span>
                  <span className="text-xs text-neutral-600">{l.quota} calls remaining</span>
                </div>
              </div>
              <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1">{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
