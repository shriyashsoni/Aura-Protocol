"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Aura Protocol client error", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-xl border border-white/10 p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">Aura Protocol</p>
        <h1 className="mb-4 text-2xl font-semibold">The interface hit a temporary error.</h1>
        <p className="mb-8 text-sm leading-6 text-neutral-400">Your wallet connection was not changed. Reload the interface to continue.</p>
        <button type="button" onClick={() => reset()} className="bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200">
          Reload interface
        </button>
      </div>
    </main>
  );
}