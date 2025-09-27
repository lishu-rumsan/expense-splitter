// hooks/useExpenseContract.ts
import { ethers } from "ethers";
import expenseSplitterData from "../../../scripts/abis/ExpenseContract.json";

const CONTRACT_ADDRESS = "0x93270AF34c713899599b5902C31f91edB8C02436"; // replace with deployed contract

export function useExpenseContract() {
  // Get contract with signer (so we can write to blockchain)
  const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      expenseSplitterData.abi,
      signer
    );
  };

  const createGroup = async (name: string, members: string[]) => {
    const contract = await getContract();

    // Validate all addresses are proper Ethereum addresses, not ENS names
    const isValidAddress = (address: string) => {
      // Check if it's a valid Ethereum address (42 characters starting with 0x)
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    };

    const isENSName = (address: string) => {
      // Check if it looks like an ENS name
      return address.endsWith(".eth") || address.includes(".");
    };

    // Validate each member address
    for (const member of members) {
      if (isENSName(member)) {
        throw new Error(
          `ENS names like "${member}" are not supported on Base Sepolia. Please use raw Ethereum addresses (0x...)`
        );
      }
      if (!isValidAddress(member)) {
        throw new Error(
          `Invalid Ethereum address: "${member}". Please use format: 0x...`
        );
      }
    }

    const tx = await contract.createGroup(name, members);
    const receipt = await tx.wait();
    console.log("Group created tx:", receipt);
    return receipt;
  };

  const getGroupCount = async () => {
    const contract = await getContract();
    const count = await contract.groupCount();
    return Number(count);
  };

  const getGroup = async (groupId: number) => {
    const contract = await getContract();
    try {
      const group = await contract.getGroup(groupId);
      console.log(`Raw group data for ID ${groupId}:`, group);
      return {
        id: Number(group.id),
        name: group.name,
        creator: group.creator,
        members: group.members || [],
      };
    } catch (error) {
      console.error("Error getting group:", error);
      return null;
    }
  };

  // Add debugging function to check all stored data
  const debugContractData = async () => {
    try {
      const contract = await getContract();
      const count = await contract.groupCount();
      console.log("=== CONTRACT DEBUG INFO ===");
      console.log("Contract Address:", CONTRACT_ADDRESS);
      console.log("Total Groups:", Number(count));

      for (let i = 0; i < Number(count); i++) {
        try {
          const group = await contract.getGroup(i);
          console.log(`Group ${i}:`, {
            id: Number(group.id),
            name: group.name,
            creator: group.creator,
            members: group.members,
            membersCount: group.members?.length || 0,
          });
        } catch (error) {
          console.error(`Error fetching group ${i}:`, error);
        }
      }
      console.log("=== END DEBUG INFO ===");
    } catch (error) {
      console.error("Error debugging contract:", error);
    }
  };

  return { createGroup, getGroupCount, getGroup, debugContractData };
}
