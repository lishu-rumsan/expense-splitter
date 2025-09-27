// import { Synapse, RPC_URLS } from "@filoz/synapse-sdk";
// import { ethers } from "ethers";

// export interface UploadResult {
//   pieceCid: string;
//   size: number;
//   fileName: string;
//   uploadTime: number;
// }

// export interface StorageService {
//   synapse: Synapse | null;
//   initialized: boolean;
// }

// class SynapseStorageService {
//   private synapse: Synapse | null = null;
//   private initialized: boolean = false;

//   async initialize(privateKey: string): Promise<void> {
//     try {
//       if (this.initialized && this.synapse) {
//         return;
//       }

//       // Ensure private key has 0x prefix
//       const formattedPrivateKey = privateKey.startsWith("0x")
//         ? privateKey
//         : `0x${privateKey}`;

//       this.synapse = await Synapse.create({
//         privateKey: formattedPrivateKey,
//         rpcURL: RPC_URLS.calibration.websocket, // Use calibration testnet
//       });

//       this.initialized = true;
//       console.log("Synapse SDK initialized successfully!");
//     } catch (error) {
//       console.error("Failed to initialize Synapse SDK:", error);
//       throw error;
//     }
//   }

//   async uploadFile(file: File, privateKey: string): Promise<UploadResult> {
//     try {
//       // Initialize if not already done
//       if (!this.initialized) {
//         await this.initialize(privateKey);
//       }

//       if (!this.synapse) {
//         throw new Error("Synapse SDK not initialized");
//       }

//       // Convert file to Uint8Array
//       const arrayBuffer = await file.arrayBuffer();
//       const data = new Uint8Array(arrayBuffer);

//       console.log(`Uploading file: ${file.name} (${data.length} bytes)`);

//       // Upload to Filecoin via Synapse
//       const uploadResult = await this.synapse.storage.upload(data);

//       const result: UploadResult = {
//         pieceCid: uploadResult.pieceCid,
//         size: data.length,
//         fileName: file.name,
//         uploadTime: Date.now(),
//       };

//       console.log(`Upload complete! PieceCID: ${result.pieceCid}`);
//       return result;
//     } catch (error) {
//       console.error("Upload failed:", error);
//       throw error;
//     }
//   }

//   async downloadFile(
//     pieceCid: string,
//     privateKey?: string
//   ): Promise<Uint8Array> {
//     try {
//       // Initialize if not already done and private key provided
//       if (!this.initialized && privateKey) {
//         await this.initialize(privateKey);
//       }

//       if (!this.synapse) {
//         throw new Error("Synapse SDK not initialized");
//       }

//       console.log(`Downloading file with PieceCID: ${pieceCid}`);
//       const data = await this.synapse.storage.download(pieceCid);
//       console.log(`Download complete! Size: ${data.length} bytes`);

//       return data;
//     } catch (error) {
//       console.error("Download failed:", error);
//       throw error;
//     }
//   }

//   async getAccountInfo(privateKey: string): Promise<any> {
//     try {
//       if (!this.initialized) {
//         await this.initialize(privateKey);
//       }

//       if (!this.synapse) {
//         throw new Error("Synapse SDK not initialized");
//       }

//       const accountInfo = await this.synapse.payments.accountInfo();
//       const walletBalance = await this.synapse.payments.walletBalance();

//       return {
//         availableFunds: ethers.formatUnits(accountInfo.availableFunds, 18),
//         walletBalance: ethers.formatEther(walletBalance),
//         network: await this.synapse.getNetwork(),
//         chainId: await this.synapse.getChainId(),
//       };
//     } catch (error) {
//       console.error("Failed to get account info:", error);
//       throw error;
//     }
//   }

//   isInitialized(): boolean {
//     return this.initialized && this.synapse !== null;
//   }
// }

// // Export singleton instance
// export const synapseStorage = new SynapseStorageService();
// export default synapseStorage;

import { Synapse, RPC_URLS } from "@filoz/synapse-sdk";

// Initialize SDK
const synapse = await Synapse.create({
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  rpcURL: RPC_URLS.calibration.websocket, // Use calibration testnet for testing
});

// Upload data, this auto-selects provider and creates a data set if needed
// (your first upload will take longer than subsequent uploads due to set up)
const uploadResult = await synapse.storage.upload(
  new TextEncoder().encode(
    "🚀 Welcome to decentralized storage on Filecoin! Your data is safe here. 🌍"
  )
);
console.log(`Upload complete! PieceCID: ${uploadResult.pieceCid}`);

// Download data
const data = await synapse.storage.download(uploadResult.pieceCid);
console.log("Retrieved:", new TextDecoder().decode(data));
