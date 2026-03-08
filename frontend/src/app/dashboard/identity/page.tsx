"use client";
import { User, Fingerprint, Shield, Key, Loader2, CheckCircle2 } from "lucide-react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { useState } from "react";

export default function IdentityManager() {
  const { publicKey, requestTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  const generateAndRegisterIdentity = async () => {
    if (!publicKey) {
      alert("Please connect wallet first");
      return;
    }
    
    try {
      setLoading(true);
      const API_URL = "/api";
      
      // 1. Generate ZKP profile commitments
      const profileData = {
        profileId: "123456789field",
        ageBucket: "2", // bucket 2
        region: "840", // US
        behaviorFingerprint: "999",
        kycTier: "1",
        nonce: "42"
      };

      console.log("Requesting commitments...");
      const commitRes = await fetch(API_URL + '/v1/commitments/profile', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (!commitRes.ok) throw new Error("Failed to get commitments");
      const { output: commitments } = await commitRes.json();

      // 2. Format payload for Aleo Program
      console.log("Formatting Aleo payload...");
      const payloadRes = await fetch(API_URL + '/v1/payloads/profile/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profileData.profileId,
          ageBucketCommitment: commitments.ageBucketCommitment.replace('field', '') + 'field',
          regionCommitment: commitments.regionCommitment.replace('field', '') + 'field',
          behaviorCommitment: commitments.behaviorCommitment.replace('field', '') + 'field',
          kycCommitment: commitments.kycCommitment.replace('field', '') + 'field',
          nonce: commitments.nonce.replace('group', '') + 'group'
        })
      });
      
      if (!payloadRes.ok) throw new Error("Failed to generate payload");
      const template = await payloadRes.json();

      // 3. Request transaction from Aleo Leo Wallet
      console.log("Requesting Wallet Signature...", template);
      const fee = 2_000_000; // 2 credits

      const getInputsArgs = (inputsObj: any): any[] => {
          return Object.values(inputsObj);
      };
      
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        template.programId,
        template.functionName,
        getInputsArgs(template.inputs),
        Math.floor(fee)
      );

      const txResult = await requestTransaction?.(aleoTransaction) ?? "";
      console.log("txResult", txResult);
      setTxId(txResult);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to register identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h2 className="text-3xl font-light mb-2">My Identity</h2>
        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">aura_identity.aleo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border border-white/10 p-6 bg-white/[0.02]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-8 h-8 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-xl font-light">Aleo Citizen</h3>
              <p className="text-sm font-mono text-neutral-500">Tier 1 Attestation</p>
            </div>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex flex-col">
              <span className="text-neutral-500 mb-1">Public Key</span>
              <span className="select-all break-all text-neutral-300 bg-black p-2 border border-white/5 truncate">
                {publicKey || "Connect wallet to view key"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-white/10 p-6 bg-white/[0.02]">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-green-400" />
              ZKP Verification Status
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center bg-black p-3 border border-white/5">
                <span className="text-neutral-400">KYC Hash</span>
                <span className={txId ? "text-green-400" : "text-neutral-500"}>{txId ? "Valid" : "Pending Setup"}</span>
              </div>
              <div className="flex justify-between items-center bg-black p-3 border border-white/5">
                <span className="text-neutral-400">Compute Origin</span>
                <span className="text-neutral-500">Pending Setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-white/10 p-6 bg-black">
        <h3 className="text-xl font-light mb-4 flex items-center">
          <Key className="w-5 h-5 mr-3 text-neutral-400" />
          Zero-Knowledge Credentials
        </h3>
        <p className="text-neutral-500 text-sm mb-6">
          Generate private proofs to access Aura Protocol features without revealing your underlying data.
        </p>
        
        {txId ? (
          <div className="bg-green-500/10 border border-green-500/20 p-4 text-green-400 font-mono text-sm flex items-center">
             <CheckCircle2 className="w-5 h-5 mr-3" />
             Tx Committed: {txId}
          </div>
        ) : (
          <button 
            onClick={generateAndRegisterIdentity}
            disabled={loading}
            className="bg-white disabled:bg-neutral-600 disabled:text-neutral-400 text-black px-6 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors inline-flex items-center"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Fingerprint className="w-4 h-4 mr-2" />}
            {loading ? "Generating Proof..." : "Generate Access Proof"}
          </button>
        )}
      </div>
    </div>
  );
}
