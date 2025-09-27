"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExpenseContract } from "@/hooks/useExpenseContract";
import { useState } from "react";

export function ExpenseForm() {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(""); // comma-separated wallet addresses
  const { createGroup, getGroupCount, getGroup } = useExpenseContract();

  const handleCreateGroup = async () => {
    try {
      console.log("Creating group with:", groupName, members);
      const memberArray = members
        .split(",")
        .map((addr) => addr.trim())
        .filter(Boolean);
      const receipt = await createGroup(groupName, memberArray);

      console.log("Transaction receipt:", receipt);

      // Check transaction status
      if (receipt.status === 1) {
        // Clear form on success
        setGroupName("");
        setMembers("");

        alert(`✅ Group Created Successfully!
        
Transaction Hash: ${receipt.hash}
Block Number: ${receipt.blockNumber}
Gas Used: ${receipt.gasUsed.toString()}

You can view this transaction on the block explorer.`);
      } else {
        alert("❌ Transaction failed - status: " + receipt.status);
      }
    } catch (err: any) {
      console.error("Error creating group:", err);

      // More specific error handling
      if (err.code === 4001) {
        alert("❌ Transaction rejected by user");
      } else if (err.message.includes("insufficient funds")) {
        alert("❌ Insufficient funds for gas fees");
      } else {
        alert("❌ Failed: " + err.message);
      }
    }
  };

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-3">
        {/* group name input */}
        <Input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* members input */}
        <div>
          <Input
            placeholder="Comma-separated member addresses"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-1">
            💡 Use Ethereum addresses (0x...), not ENS names (.eth)
            <br />
            Example: 0x742d35Cc...
          </div>
        </div>

        <Button onClick={handleCreateGroup}>Create a group</Button>
      </div>
    </>
  );
}
