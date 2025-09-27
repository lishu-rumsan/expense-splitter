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
