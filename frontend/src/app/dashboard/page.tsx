"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

export default function DashboardPage() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  if (!connected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Dashboard (Live Data)</h1>
      <p className="text-lg text-neutral-400 mb-8">Welcome, <span className="font-mono">{publicKey}</span></p>
      {/* TODO: Add real on-chain data, contract actions, and live updates here */}
      <div className="mt-8 text-neutral-500">All features will be live and on-chain here.</div>
    </div>
  );
}
