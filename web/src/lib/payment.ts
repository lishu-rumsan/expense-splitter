import { ethers } from "ethers";

// 1. Deposit USDFC tokens (one-time setup)
const amount = ethers.parseUnits("100", 18); // 100 USDFC
await synapse.payments.deposit(amount);

// 2. Approve the Warm Storage service contract for automated payments
// Warm Storage acts as both the storage coordinator and payment validator
// The SDK automatically uses the correct service address for your network
const warmStorageAddress = await synapse.getWarmStorageAddress();
await synapse.payments.approveService(
  warmStorageAddress,
  ethers.parseUnits("10", 18), // Rate allowance: 10 USDFC per epoch
  ethers.parseUnits("1000", 18), // Lockup allowance: 1000 USDFC total
  86400n // Max lockup period: 30 days (in epochs)
);

// Now you're ready to use storage!
