"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Adapter } from "@demox-labs/aleo-wallet-adapter-base";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

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

export const AleoWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [aleoWallets, setAleoWallets] = useState<Adapter[]>([]);
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
    const loadAleoAdapters = async () => {
      const { LeoWalletAdapter } = await import("@demox-labs/aleo-wallet-adapter-leo");
      const { PuzzleWalletAdapter } = await import("@provablehq/aleo-wallet-adaptor-puzzle");
      const { ShieldWalletAdapter } = await import("@provablehq/aleo-wallet-adaptor-shield");
      setAleoWallets([
        new LeoWalletAdapter({ appName: "Aura AI" }),
        new PuzzleWalletAdapter({ appName: "Aura AI" }) as unknown as Adapter,
        new ShieldWalletAdapter() as unknown as Adapter,
      ]);
    };
    void loadAleoAdapters().catch((error: unknown) => {
      console.warn("Aleo wallet adapters are unavailable in this browser.", error);
      setAleoWallets([]);
    });
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
    <WalletProvider wallets={aleoWallets} autoConnect>
      <WalletContext.Provider value={{ address, chainId, isConnected: Boolean(address), connect, disconnect: () => setAddress(null) }}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletContext.Provider>
    </WalletProvider>
  );
};

export const useEvmWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useEvmWallet must be used inside AleoWalletProvider");
  return context;
};
