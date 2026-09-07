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
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      const account = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : null;
      const parsedChainId = typeof currentChain === "string" ? Number.parseInt(currentChain, 16) : NaN;
      setAddress(account);
      setChainId(Number.isFinite(parsedChainId) ? parsedChainId : null);
    } catch (error) {
      console.warn("Wallet connection was cancelled or unavailable.", error);
      setAddress(null);
      setChainId(null);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0];
      setAddress(Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : null);
    };
    const handleChain = (...args: unknown[]) => {
      const value = args[0];
      const parsedChainId = typeof value === "string" ? Number.parseInt(value, 16) : NaN;
      setChainId(Number.isFinite(parsedChainId) ? parsedChainId : null);
    };
    try {
      window.ethereum.on?.("accountsChanged", handleAccounts);
      window.ethereum.on?.("chainChanged", handleChain);
    } catch (error) {
      console.warn("Wallet event listeners are unavailable.", error);
    }
    return () => {
      try {
        window.ethereum?.removeListener?.("accountsChanged", handleAccounts);
        window.ethereum?.removeListener?.("chainChanged", handleChain);
      } catch (error) {
        console.warn("Wallet event listeners could not be removed.", error);
      }
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
