"use client";

import type { ReactNode } from "react";
import { AleoWalletProvider } from "./AleoWalletProvider";

export function WalletProviders({ children }: { children: ReactNode }) {
  return <AleoWalletProvider>{children}</AleoWalletProvider>;
}