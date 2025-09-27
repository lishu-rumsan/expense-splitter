"use client";

import { getDefaultConfig } from "connectkit";
import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { baseSepolia, mainnet, polygonAmoy, sepolia } from "wagmi/chains";

import { safe } from "wagmi/connectors";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
const ganache = {
  id: 8545,
  name: "Ganache",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"], // Ganache RPC URL
    },
    public: {
      http: ["http://localhost:8545"], // Ganache RPC URL
    },
  },
};
const localChain = defineChain(ganache);

export const config = createConfig(
  getDefaultConfig({
    chains: [
      // mainnet,
      // sepolia,
      // arbitrumGoerli,
      // polygon,
      //localChain,
      baseSepolia,
      // arbitrumSepolia,
      // rahatChain,
    ],
    batch: {
      multicall: true,
    },
    connectors: [
      // walletConnect({
      //   projectId: '1234',
      // }),

      safe(),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      // [arbitrumSepolia.id]: http(),
      [polygonAmoy.id]: http(),
      [localChain.id]: http(),
      [baseSepolia.id]: http(),
    },
    walletConnectProjectId: "",
    // Required App Info
    appName: "Perks",

    // Optional App Info
    appDescription:
      "An open-source blockchain-based financial access platform to support vulnerable communities.",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

// export default defineConfig({
//   out: 'src/generated.ts',
//   contracts: [],
//   plugins: [],
// });
