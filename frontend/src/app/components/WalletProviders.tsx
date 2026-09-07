"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const AleoWalletProvider = dynamic(
  () => import("./AleoWalletProvider").then((module) => module.AleoWalletProvider),
  { ssr: false },
);

export function WalletProviders({ children }: { children: ReactNode }) {
  return <AleoWalletProvider>{children}</AleoWalletProvider>;
}