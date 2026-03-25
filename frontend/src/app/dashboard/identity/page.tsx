"use client";
import { User, Fingerprint, Shield, Key, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { useState } from "react";

const API_URL = "/api";

type ProfileForm = {
  profileId: string;
  ageBucket: string;
  region: string;
  behaviorFingerprint: string;
  kycTier: string;
  nonce: string;
};

type Status = "idle" | "committing" | "building" | "signing" | "done" | "error";

export default function IdentityManager() {
  const { publicKey, requestTransaction } = useWallet();
  const [status, setStatus] = useState<Status>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    profileId: "123456789",
    ageBucket: "2",
    region: "840",
    behaviorFingerprint: "999",
    kycTier: "1",
    nonce: String(Math.floor(Math.random() * 999999) + 1),
  });

  const updateField = (key: keyof ProfileForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateAndRegisterIdentity = async () => {
    if (!publicKey) return alert("Please connect wallet first");

    try {
      setStatus("committing");
      setErrorMsg(null);
      setTxId(null);

      // 1. Generate ZKP commitments
      const commitRes = await fetch(API_URL + "/v1/commitments/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!commitRes.ok) throw new Error("Failed to generate commitments");
      const { output: commitments } = await commitRes.json();

      setStatus("building");

      // 2. Build Aleo payload
      const payloadRes = await fetch(API_URL + "/v1/payloads/profile/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: commitments.profileId,
          ageBucketCommitment: commitments.ageBucketCommitment,
          regionCommitment: commitments.regionCommitment,
          behaviorCommitment: commitments.behaviorCommitment,
          kycCommitment: commitments.kycCommitment,
          nonce: commitments.nonce,
        }),
      });
      if (!payloadRes.ok) throw new Error("Failed to build payload");
      const template = await payloadRes.json();

      setStatus("signing");

      // 3. Request wallet signature
      const aleoTx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        Object.values(template.inputs),
        2_000_000
      );

      const txResult = await requestTransaction?.(aleoTx) ?? "";
      setTxId(txResult);
      setStatus("done");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to register identity");
      setStatus("error");
    }
  };

  const isLoading = ["committing", "building", "signing"].includes(status);

  const statusLabel: Record<Status, string> = {
    idle: "Generate Access Proof",
    committing: "Hashing Commitments...",
    building: "Building ZK Payload...",
    signing: "Awaiting Wallet Signature...",
    done: "Identity Registered",
    error: "Retry",
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h2 className="text-3xl font-light mb-2 flex items-center gap-3">
          <User className="w-7 h-7 text-neutral-500" strokeWidth={1.5} />
          My Identity
        </h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          profile_registry.aleo · register_profile
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Profile card */}
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-none bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-xl font-light">Aleo Citizen</h3>
              <p className="text-sm font-mono text-neutral-500">KYC Tier {form.kycTier} Attestation</p>
            </div>
          </div>
          <div className="font-mono text-sm">
            <span className="text-neutral-500 mb-1 block">Public Key</span>
            <span className="select-all break-all text-neutral-300 bg-black p-2 border border-white/5 text-xs block">
              {publicKey || "Connect wallet to view key"}
            </span>
          </div>
        </div>

        {/* ZKP status */}
        <div className="space-y-4">
          <div className="border border-white/10 p-5 bg-white/[0.02]">
            <h3 className="text-base font-medium mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-400" />
              ZKP Verification Status
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {[
                { label: "KYC Hash", value: txId ? "Valid ✓" : "Pending Setup", ok: !!txId },
                { label: "Identity Committed", value: txId ? "On-chain ✓" : "Pending Setup", ok: !!txId },
                { label: "Network", value: "Aleo Testnet", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-black p-2.5 border border-white/5">
                  <span className="text-neutral-400">{item.label}</span>
                  <span className={item.ok && txId ? "text-green-400" : item.ok ? "text-white" : "text-neutral-500"}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile fields form */}
      <div className="border border-white/10 p-6 bg-black mb-6">
        <h3 className="text-base font-medium mb-5 flex items-center">
          <Key className="w-4 h-4 mr-2 text-neutral-400" />
          ZK Profile Fields
        </h3>
        <p className="text-neutral-500 text-xs mb-5 font-mono leading-relaxed">
          These values are hashed into private field commitments before being written on-chain. Your raw data is never revealed.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          {([
            { key: "profileId", label: "Profile ID" },
            { key: "ageBucket", label: "Age Bucket (1–5)" },
            { key: "region", label: "Region Code (ISO)" },
            { key: "behaviorFingerprint", label: "Behavior Fingerprint" },
            { key: "kycTier", label: "KYC Tier (1–3)" },
            { key: "nonce", label: "Nonce" },
          ] as { key: keyof ProfileForm; label: string }[]).map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-neutral-500 font-mono uppercase tracking-wider mb-1.5">{label}</label>
              <input
                type="text"
                value={form[key]}
                onChange={(e) => updateField(key, e.target.value)}
                disabled={isLoading || status === "done"}
                className="w-full bg-black border border-white/10 px-3 py-2.5 text-sm font-mono text-white outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        {/* Status feedback */}
        {status === "done" && txId && (
          <div className="mb-5 bg-green-500/10 border border-green-500/20 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <div>
              <p className="text-green-400 text-sm font-medium">Identity committed on Aleo Testnet</p>
              <p className="text-green-500/70 text-xs font-mono mt-1 break-all">TX: {txId}</p>
            </div>
          </div>
        )}

        {status === "error" && errorMsg && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
        )}

        <button
          onClick={generateAndRegisterIdentity}
          disabled={isLoading || !publicKey || status === "done"}
          className="bg-white disabled:bg-neutral-800 disabled:text-neutral-500 text-black px-6 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors inline-flex items-center"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Fingerprint className="w-4 h-4 mr-2" />}
          {statusLabel[status]}
        </button>
        {!publicKey && (
          <p className="text-xs text-neutral-600 mt-3 font-mono">Connect your Leo Wallet to register an identity.</p>
        )}
      </div>
    </div>
  );
}
