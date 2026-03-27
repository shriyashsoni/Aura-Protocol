"use client";

import React, { useMemo, useState, useEffect } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export const AleoWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    // Dynamic import to prevent WASM modules from being loaded during server-side build/compilation
    const loadAdapters = async () => {
      const { LeoWalletAdapter } = await import("@demox-labs/aleo-wallet-adapter-leo");
      const { PuzzleWalletAdapter } = await import("@provablehq/aleo-wallet-adaptor-puzzle");
      const { ShieldWalletAdapter } = await import("@provablehq/aleo-wallet-adaptor-shield");

      setWallets([
        new LeoWalletAdapter({ appName: "Aura AI" }),
        new PuzzleWalletAdapter({ appName: "Aura AI" }) as any,
        new ShieldWalletAdapter({ appName: "Aura AI" }) as any,
      ]);
    };

    loadAdapters();
  }, []);

  return (
    <WalletProvider
      wallets={wallets}
      autoConnect={true}
    >
      <WalletModalProvider>
        {children}
      </WalletModalProvider>
    </WalletProvider>
  );
};
