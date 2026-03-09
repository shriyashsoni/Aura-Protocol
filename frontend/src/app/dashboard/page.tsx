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
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-lg text-neutral-400 mb-8">Welcome to your dashboard. Wallet is connected.</p>
      {/* Add dashboard widgets/components here */}
    </div>
  );
}
