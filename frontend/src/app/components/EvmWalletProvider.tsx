"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type EvmWalletContext = {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<EvmWalletContext | null>(null);

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function EvmWalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
      return;
    }
    const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    const currentChain = (await window.ethereum.request({ method: "eth_chainId" })) as string;
    setAddress(accounts[0] ?? null);
    setChainId(Number.parseInt(currentChain, 16));
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (...args: unknown[]) => setAddress((args[0] as string[])[0] ?? null);
    const handleChain = (...args: unknown[]) => setChainId(Number.parseInt(args[0] as string, 16));
    window.ethereum.on?.("accountsChanged", handleAccounts);
    window.ethereum.on?.("chainChanged", handleChain);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccounts);
      window.ethereum?.removeListener?.("chainChanged", handleChain);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, chainId, isConnected: Boolean(address), connect, disconnect: () => setAddress(null) }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useEvmWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useEvmWallet must be used inside EvmWalletProvider");
  return context;
}
