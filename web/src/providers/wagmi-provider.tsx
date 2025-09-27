"use client";
import { config } from "@/app/wagmi.config";
import { WagmiProvider } from "wagmi";

export const Wagmi = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};
