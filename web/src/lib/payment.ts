import { ethers } from "ethers";
import { Synapse } from "@filoz/synapse-sdk";

export interface PaymentSetupResult {
  success: boolean;
  message: string;
  accountInfo?: any;
}

export async function setupPayments(
  synapse: Synapse
): Promise<PaymentSetupResult> {
  try {
    // Check current account info first
    const accountInfo = await synapse.payments.accountInfo();
    console.log("Current account info:", accountInfo);

    // Check if we already have sufficient funds
    const availableFunds = ethers.formatUnits(accountInfo.availableFunds, 18);
    console.log("Available funds:", availableFunds, "USDFC");

    // Only deposit if we have insufficient funds (less than 50 USDFC)
    if (parseFloat(availableFunds) < 50) {
      console.log("Depositing USDFC tokens...");
      const amount = ethers.parseUnits("100", 18); // 100 USDFC
      await synapse.payments.deposit(amount);
      console.log("Deposit successful!");
    } else {
      console.log("Sufficient funds available, skipping deposit");
    }

    // Get Warm Storage address and approve the service
    console.log("Setting up service approval...");
    const warmStorageAddress = await synapse.getWarmStorageAddress();

    await synapse.payments.approveService(
      warmStorageAddress,
      ethers.parseUnits("10", 18), // Rate allowance: 10 USDFC per epoch
      ethers.parseUnits("1000", 18), // Lockup allowance: 1000 USDFC total
      86400n // Max lockup period: 1 day (in epochs)
    );

    console.log("Payment setup completed successfully!");

    // Get updated account info
    const updatedAccountInfo = await synapse.payments.accountInfo();

    return {
      success: true,
      message: "Payment setup completed successfully!",
      accountInfo: updatedAccountInfo,
    };
  } catch (error) {
    console.error("Payment setup failed:", error);
    return {
      success: false,
      message: `Payment setup failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export async function checkPaymentStatus(synapse: Synapse): Promise<{
  hasMinimumFunds: boolean;
  availableFunds: string;
  walletBalance: string;
}> {
  try {
    const accountInfo = await synapse.payments.accountInfo();
    const walletBalance = await synapse.payments.walletBalance();

    const availableFunds = ethers.formatUnits(accountInfo.availableFunds, 18);
    const hasMinimumFunds = parseFloat(availableFunds) >= 1; // At least 1 USDFC required

    return {
      hasMinimumFunds,
      availableFunds,
      walletBalance: ethers.formatEther(walletBalance),
    };
  } catch (error) {
    console.error("Failed to check payment status:", error);
    return {
      hasMinimumFunds: false,
      availableFunds: "0",
      walletBalance: "0",
    };
  }
}
