"use client";

import React, { useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { PuzzleWalletAdapter } from "@provablehq/aleo-wallet-adaptor-puzzle";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export const AleoWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Aura AI",
      }),
      new PuzzleWalletAdapter({
        appName: "Aura AI",
      }) as any,
    ],
    []
  );

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
