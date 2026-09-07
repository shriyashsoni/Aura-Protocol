"use client";

import React, { useEffect, useState } from "react";
import type { Adapter } from "@demox-labs/aleo-wallet-adapter-base";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export const AleoWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [aleoWallets, setAleoWallets] = useState<Adapter[]>([]);
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

  return (
    <WalletProvider wallets={aleoWallets} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
};
