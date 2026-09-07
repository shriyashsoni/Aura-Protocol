"use client";

import type { ReactNode } from "react";
import { EvmWalletProvider } from "./EvmWalletProvider";

export function WalletProviders({ children }: { children: ReactNode }) {
  return <EvmWalletProvider>{children}</EvmWalletProvider>;
}