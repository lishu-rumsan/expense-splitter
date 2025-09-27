"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users, Check } from "lucide-react";
import { useExpenseContract } from "@/hooks/useExpenseContract";

const createGroupSchema = z.object({
  groupName: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be less than 50 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  memberAddress: z.string().optional(),
});

type CreateGroupFormData = z.infer<typeof createGroupSchema>;

interface CreateGroupProps {
  onClose: () => void;
  userAddress: string;
  onGroupCreated?: () => void; // Add callback to refresh list
}

export function CreateGroup({
  onClose,
  userAddress,
  onGroupCreated,
}: CreateGroupProps) {
  const [members, setMembers] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { createGroup } = useExpenseContract();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    mode: "onChange",
    defaultValues: {
      groupName: "",
      description: "",
      memberAddress: "",
    },
  });

  const memberAddress = watch("memberAddress");
  const groupName = watch("groupName");

  const addMemberToList = () => {
    if (
      memberAddress &&
      !members.includes(memberAddress) &&
      memberAddress !== userAddress &&
      /^0x[a-fA-F0-9]{40}$/.test(memberAddress) // Validate Ethereum address
    ) {
      setMembers([...members, memberAddress]);
      setValue("memberAddress", "");
    }
  };

  const removeMember = (address: string) => {
    setMembers(members.filter((m) => m !== address));
  };

  const onSubmit = async (data: CreateGroupFormData) => {
    if (!data.groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    setIsCreating(true);
    try {
      console.log("Creating group with:", data.groupName, members);
      const receipt = await createGroup(data.groupName, members);

      console.log("Transaction receipt:", receipt);

      // Check transaction status
      if (receipt.status === 1) {
        alert(`✅ Group Created Successfully!
        
Transaction Hash: ${receipt.hash}
Block Number: ${receipt.blockNumber}
Gas Used: ${receipt.gasUsed.toString()}

Your group "${data.groupName}" has been created on the blockchain.`);

        // Reset form and close modal
        reset();
        setMembers([]);

        // Call callback to refresh group list
        if (onGroupCreated) {
          onGroupCreated();
        }

        onClose();
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
      } else if (
        err.message.includes("ENS") ||
        err.code === "UNSUPPORTED_OPERATION"
      ) {
        alert(
          "❌ ENS names are not supported on Base Sepolia. Please use raw Ethereum addresses (0x...)"
        );
      } else {
        alert("❌ Failed: " + err.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create New Group</CardTitle>
              <CardDescription>
                Set up a new expense group and invite members
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Group Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name *</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Goa Trip 2024, Office Lunch"
                  {...register("groupName")}
                  className="mt-1"
                />
                {errors.groupName && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.groupName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the group..."
                  {...register("description")}
                  rows={3}
                  className="mt-1"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current User */}
            <div className="space-y-2">
              <Label>Group Creator</Label>
              <div className="flex items-center space-x-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">You</p>
                  <p className="text-sm text-muted-foreground">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </p>
                </div>
                <Badge variant="secondary">Creator</Badge>
              </div>
            </div>

            {/* Add Members */}
            <div className="space-y-4">
              <Label>Add Members (Optional)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter wallet address (0x...)"
                  {...register("memberAddress")}
                  onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addMemberToList}
                  disabled={
                    !memberAddress ||
                    memberAddress === userAddress ||
                    !/^0x[a-fA-F0-9]{40}$/.test(memberAddress)
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {memberAddress && !/^0x[a-fA-F0-9]{40}$/.test(memberAddress) && (
                <p className="text-sm text-red-600">
                  Please enter a valid Ethereum address (0x...)
                </p>
              )}

              {/* Members List */}
              {members.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {members.length} additional member
                    {members.length !== 1 ? "s" : ""} will be added
                  </p>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-medium">
                            {member.slice(0, 6)}...{member.slice(-4)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isCreating}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || !groupName.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Group
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
