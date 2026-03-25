"use client";

import { Wallet, CheckCircle2, Loader2, AlertCircle, ExternalLink, XCircle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

const API_URL = "/api";

type IntentForm = {
  providerAddress: string;
  listingId: string;
  intentId: string;
  amountMicrocredits: string;
};

type Status = "idle" | "building" | "signing" | "done" | "error";

export default function EscrowVaultPage() {
  const { publicKey, requestTransaction } = useWallet();
  const [form, setForm] = useState<IntentForm>({
    providerAddress: "",
    listingId: "",
    intentId: String(Date.now()),
    amountMicrocredits: "5000000",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = (key: keyof IntentForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const createPaymentIntent = async () => {
    if (!publicKey) return alert("Connect your Leo Wallet first.");
    if (!form.providerAddress || !form.listingId)
      return alert("Provider address and Listing ID are required.");

    setStatus("building");
    setErrorMsg(null);
    setTxId(null);

    try {
      const payloadRes = await fetch(API_URL + "/v1/payloads/payment/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!payloadRes.ok) {
        const err = await payloadRes.json();
        throw new Error(err.error || "Failed to build payment payload");
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
          <Wallet className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          Escrow Vault
        </h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          payment_router.aleo · create_payment_intent / confirm_payment / cancel_payment
        </p>
      </div>

      {/* Vault stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Locked Value", value: "12,500", unit: "ALEO" },
          { label: "Active Intents", value: "4", unit: "LIVE" },
          { label: "Confirmed", value: "37", unit: "TOTAL" },
          { label: "Cancelled", value: "2", unit: "TOTAL" },
        ].map((s) => (
          <div key={s.label} className="border border-white/10 bg-white/[0.02] p-5">
            <p className="text-neutral-500 text-xs font-mono mb-2 uppercase tracking-wider">{s.label}</p>
            <p className="text-3xl font-light text-white">{s.value}</p>
            <p className="text-xs text-neutral-600 font-mono mt-1">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* Create Payment Intent Form */}
      <div className="border border-white/10 bg-black p-8 mb-8">
        <h3 className="text-lg font-medium mb-6 text-white/90">Create Payment Intent</h3>
        <p className="text-xs text-neutral-500 mb-6 font-mono leading-relaxed">
          Lock Aleo credits into escrow linked to a specific dataset listing. The provider confirms release after inference settles.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Provider Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.providerAddress}
              onChange={(e) => updateField("providerAddress", e.target.value)}
              placeholder="aleo1..."
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white placeholder-neutral-700 outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>
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
              Intent ID
            </label>
            <input
              type="text"
              value={form.intentId}
              onChange={(e) => updateField("intentId", e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-2">
              Amount (microcredits)
            </label>
            <input
              type="number"
              value={form.amountMicrocredits}
              onChange={(e) => updateField("amountMicrocredits", e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border border-white/10 px-4 py-3 text-sm font-mono text-white outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-neutral-600 mt-1 font-mono">
              = {(Number(form.amountMicrocredits) / 1_000_000).toFixed(2)} ALEO
            </p>
          </div>
        </div>

        {status === "done" && txId && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-green-400 text-sm font-medium mb-1">Payment intent submitted — funds locked in escrow</p>
              <p className="text-green-500/70 text-xs font-mono break-all">TX: {txId}</p>
              <a
                href={`https://testnet.provable.tools/transaction/${txId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-400/60 hover:text-green-400 mt-1 transition-colors"
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
          onClick={createPaymentIntent}
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
              <Wallet className="w-4 h-4" />
              Lock Funds in Escrow
            </>
          )}
        </button>
        {!publicKey && (
          <p className="text-xs text-neutral-600 mt-3 font-mono">Connect your Leo Wallet to create payment intents.</p>
        )}
      </div>

      {/* Active payment intents */}
      <div className="border border-white/10 bg-black p-8">
        <h3 className="text-lg font-medium mb-5 text-white/90">Recent Payment Intents</h3>
        <div className="space-y-3">
          {[
            { id: "1701234567890", listing: "medical_imaging_001", amount: "15.00", status: "CONFIRMED", color: "green" },
            { id: "1701098765432", listing: "financial_timeseries_q1", amount: "8.00", status: "PENDING", color: "yellow" },
            { id: "1700987654321", listing: "satellite_imagery_batch_7", amount: "45.00", status: "CANCELLED", color: "red" },
          ].map((intent) => (
            <div key={intent.id} className="border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm text-white">{intent.listing}</span>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-neutral-500 font-mono">Intent #{intent.id.slice(-8)}</span>
                  <span className="text-xs text-neutral-400 font-mono">{intent.amount} ALEO</span>
                </div>
              </div>
              <span className={`text-xs font-mono px-2 py-1 ${
                intent.color === "green" ? "text-green-400 bg-green-400/10" :
                intent.color === "yellow" ? "text-yellow-400 bg-yellow-400/10" :
                "text-red-400 bg-red-400/10"
              }`}>
                {intent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
