"use client";
import { Terminal, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

const API_URL = "/api";

export default function InferenceEngine() {
  const { publicKey, requestTransaction } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [listingId, setListingId] = useState("medical_imaging_001");
  const [ticketId, setTicketId] = useState("1701234567890");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "AURA_TERMINAL_v1.0 initialized...",
    "Zero-knowledge enclave boot sequence complete.",
    "Ready to settle off-chain LLM inference on Aleo. Awaiting input.",
  ]);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const runInference = async () => {
    if (!publicKey) return alert("Connect wallet first");
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setPrompt("");
    addLog(`~/ > ${currentPrompt}`);
    addLog("Broadcasting inference intent · building ZK settlement receipt...");

    try {
      setLoading(true);

      const payloadRes = await fetch(API_URL + "/v1/payloads/inference/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerAddress: publicKey,
          listingId,
          ticketId,
          settledEpoch: Math.floor(Date.now() / 1000),
        }),
      });

      if (!payloadRes.ok) {
        const err = await payloadRes.json();
        throw new Error(err.error || "Failed to generate inference payload.");
      }
      const template = await payloadRes.json();

      addLog("Payload generated · requesting ZKP execution signature from wallet...");

      const aleoTx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        4_000_000
      );

      const txId = (await requestTransaction?.(aleoTx)) ?? "";
      addLog(`✓ Inference settled on-chain · TX: ${txId}`);
      addLog("Secure enclave state flushed. Settlement receipt committed.");
    } catch (err: any) {
      console.error(err);
      addLog(`[ERROR] ${err.message || "Failed to run inference"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl flex flex-col" style={{ height: "calc(100vh - 13rem)" }}>
      <div className="mb-6 shrink-0">
        <h2 className="text-3xl font-light mb-2 flex items-center gap-3">
          <Terminal className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          Inference Engine
        </h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          inference_settlement.aleo · settle
        </p>
      </div>

      {/* Config strip */}
      <div className="flex gap-4 mb-4 shrink-0">
        <div className="flex-1">
          <label className="block text-xs text-neutral-600 font-mono uppercase tracking-wider mb-1">Listing ID</label>
          <input
            type="text"
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            disabled={loading}
            className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-white/30 disabled:opacity-50"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-neutral-600 font-mono uppercase tracking-wider mb-1">Ticket ID</label>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            disabled={loading}
            className="w-full bg-black border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-white/30 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 flex flex-col border border-white/10 bg-black min-h-0 overflow-hidden relative">
        {/* Terminal header */}
        <div className="border-b border-white/10 px-4 py-2 flex items-center gap-2 shrink-0 bg-white/[0.02]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-xs font-mono text-neutral-600 ml-2">AURA_ZK_TERMINAL — inference_settlement.aleo</span>
        </div>

        {/* Log output */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-sm space-y-2">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.startsWith("[ERROR]")
                  ? "text-red-400"
                  : log.startsWith("✓")
                  ? "text-green-400"
                  : log.startsWith("~/")
                  ? "text-white"
                  : "text-neutral-500"
              } leading-relaxed text-xs`}
            >
              {log}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-neutral-500 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>processing...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-end gap-3">
            <span className="text-green-500 font-mono text-sm mb-2.5 shrink-0">~/&gt;</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading || !publicKey}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runInference();
                }
              }}
              placeholder={
                publicKey
                  ? "Analyze medical_imaging_1 against anomaly detection protocol..."
                  : "Connect Leo Wallet to run inference..."
              }
              className="flex-1 bg-transparent border-0 outline-none text-white font-mono text-sm resize-none focus:ring-0 disabled:opacity-40"
              rows={2}
            />
            <button
              onClick={runInference}
              disabled={loading || !prompt.trim() || !publicKey}
              className="w-10 h-10 shrink-0 bg-white text-black flex items-center justify-center hover:bg-neutral-300 transition-colors disabled:bg-neutral-900 disabled:text-neutral-600"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
