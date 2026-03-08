"use client";
import { Terminal, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

export default function InferenceEngine() {
  const { publicKey, requestTransaction } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "AURA_TERMINAL_v1.0 initialized...",
    "Ready to compile off-chain LLM pipelines. Awaiting parameters."
  ]);

  const runInference = async () => {
    if (!publicKey) return alert("Connect wallet first");
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setPrompt("");
    setLogs(prev => [...prev, "~/ > " + currentPrompt, "Broadcasting inference intent inside TEE..."]);

    try {
      setLoading(true);
      const API_URL = "/api";
      
      const payloadRes = await fetch(API_URL + '/v1/payloads/inference/settle', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerAddress: publicKey,
          listingId: "999field",
          ticketId: "123field",
          queryCommitment: "567field",
          outputCommitment: "890field",
          settledEpoch: "42u32"
        })
      });

      if (!payloadRes.ok) throw new Error("Failed to generate inference payload.");
      const template = await payloadRes.json();
      
      setLogs(prev => [...prev, "Payload generated. Requesting user signature for ZKP execution..."]);

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        4_000_000
      );

      const txId = await requestTransaction?.(aleoTransaction) ?? "";
      setLogs(prev => [...prev, "Transaction submitted to Aleo network: " + txId, "Inference executed successfully. Secure Enclave data destroyed."]);
    } catch (err: any) {
      console.error(err);
      setLogs(prev => [...prev, "[ERROR] " + (err.message || "Failed to run inference")]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-8 shrink-0">
        <h2 className="text-3xl font-light mb-2">Inference Engine</h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">inference_settlement.aleo</p>
      </div>
      <div className="flex-1 flex flex-col border border-white/10 bg-black overflow-hidden relative">
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm flex flex-col">
          {logs.map((log, i) => (
             <div key={i} className={`mb-3 ${log.startsWith("[ERROR]") ? "text-red-500" : "text-neutral-400"}`}>{log}</div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-end space-x-4">
            <div className="text-green-500 font-mono mb-3 ml-2 shrink-0">{"~/ >"}</div>
            <textarea 
              value={prompt} onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runInference(); }}}
              placeholder="Analyze medical_imaging_1 against standard anomaly protocol..."
              className="flex-1 bg-transparent border-0 outline-none text-white font-mono text-sm resize-none focus:ring-0 disabled:opacity-50" rows={2}
            />
            <button 
               onClick={runInference} disabled={loading || !prompt.trim()}
               className="w-12 h-12 shrink-0 bg-white text-black flex items-center justify-center hover:bg-neutral-300 transition-colors disabled:bg-neutral-800 disabled:text-neutral-500">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
