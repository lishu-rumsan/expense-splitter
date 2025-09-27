// "use client";

// import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Users,
//   Plus,
//   ArrowRight,
//   Calendar,
//   DollarSign,
//   Loader2,
// } from "lucide-react";
// import { useExpenseContract } from "@/hooks/useExpenseContract";

// interface Group {
//   id: number;
//   name: string;
//   creator: string;
//   members: string[];
//   createdAt?: string;
//   totalExpenses?: number;
//   status?: string;
// }

// interface GroupListProps {
//   userAddress: string;
//   onCreateGroup?: () => void;
// }

// export const GroupList = forwardRef<
//   { refetchGroups: () => void },
//   GroupListProps
// >(({ userAddress, onCreateGroup }, ref) => {
//   const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { getGroupCount, getGroup, debugContractData } = useExpenseContract();

//   // Fetch groups from the contract
//   const fetchGroups = async () => {
//     try {
//       setLoading(true);
//       const groupCount = await getGroupCount();
//       console.log("Total group count:", groupCount);

//       if (groupCount === 0) {
//         setGroups([]);
//         return;
//       }

//       const fetchedGroups: Group[] = [];

//       // Fetch all groups
//       for (let i = 0; i < groupCount; i++) {
//         try {
//           const group = await getGroup(i);
//           if (group) {
//             fetchedGroups.push({
//               id: group.id,
//               name: group.name,
//               creator: group.creator,
//               members: group.members || [],
//               status: "active",
//               totalExpenses: 0, // You can calculate this later from expenses
//               createdAt: new Date().toISOString(), // Default for now
//             });
//           }
//         } catch (error) {
//           console.error(`Error fetching group ${i}:`, error);
//           // Continue fetching other groups even if one fails
//         }
//       }

//       setGroups(fetchedGroups);
//       console.log("Fetched groups:", fetchedGroups);
//     } catch (error) {
//       console.error("Error fetching groups:", error);
//       // Show error message to user
//       setGroups([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Expose refetch function to parent components
//   useImperativeHandle(ref, () => ({
//     refetchGroups: fetchGroups,
//   }));

//   // Fetch groups on component mount
//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const handleViewGroup = (groupId: number) => {
//     const group = groups.find((g) => g.id === groupId);
//     if (group) {
//       setSelectedGroup(groupId.toString());
//     }
//   };

//   const handleCloseDetails = () => {
//     setSelectedGroup(null);
//   };

//   const getUserBalance = (groupId: number) => {
//     // For now, return 0 as balance calculation will be implemented later
//     // when we add expense tracking functionality
//     return 0;
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-12">
//           <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
//           <h3 className="text-lg font-semibold mb-2">Loading groups...</h3>
//           <p className="text-muted-foreground text-center">
//             Fetching your groups from the blockchain
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (groups?.length === 0) {
//     return (
//       <Card>
//         <CardContent className="flex flex-col items-center justify-center py-12">
//           <Users className="w-12 h-12 text-muted-foreground mb-4" />
//           <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
//           <p className="text-muted-foreground text-center mb-6 max-w-sm">
//             Create your first group to start splitting expenses with friends,
//             family, or colleagues.
//           </p>
//           <Button onClick={onCreateGroup}>
//             <Plus className="w-4 h-4 mr-2" />
//             Create Your First Group
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       {/* Header with refresh button */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h2 className="text-xl font-semibold">
//             Your Groups ({groups.length})
//           </h2>
//           <p className="text-sm text-muted-foreground">
//             Groups you've created or are a member of
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={fetchGroups}
//           disabled={loading}
//         >
//           {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {groups.map((group) => {
//           const userBalance = getUserBalance(group.id);
//           const memberCount = group.members.length;
//           const isOwner =
//             group.creator.toLowerCase() === userAddress.toLowerCase();

//           return (
//             <Card
//               key={group.id}
//               className="hover:shadow-md transition-shadow cursor-pointer group"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1">
//                     <CardTitle className="text-lg flex items-center space-x-2">
//                       <span>{group.name}</span>
//                       {isOwner && (
//                         <Badge variant="outline" className="text-xs">
//                           Owner
//                         </Badge>
//                       )}
//                     </CardTitle>
//                     <CardDescription className="flex items-center space-x-4 mt-2">
//                       <div className="flex items-center space-x-1">
//                         <Users className="w-4 h-4" />
//                         <span>
//                           {memberCount} member{memberCount !== 1 ? "s" : ""}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <DollarSign className="w-4 h-4" />
//                         <span>
//                           ${(group.totalExpenses || 0).toFixed(2)} total
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Calendar className="w-4 h-4" />
//                         <span>
//                           {group.createdAt
//                             ? new Date(group.createdAt).toLocaleDateString()
//                             : "Recently"}
//                         </span>
//                       </div>
//                     </CardDescription>

//                     {/* Show creator info */}
//                     <div className="text-xs text-muted-foreground mt-2">
//                       <strong>Creator:</strong>{" "}
//                       {isOwner ? (
//                         <span className="text-blue-600 font-medium">You</span>
//                       ) : (
//                         <span>
//                           {group.creator.slice(0, 6)}...
//                           {group.creator.slice(-4)}
//                         </span>
//                       )}
//                     </div>

//                     {/* Show member addresses */}
//                     {group.members.length > 0 && (
//                       <div className="text-xs text-muted-foreground mt-1">
//                         <strong>Members:</strong>{" "}
//                         {group.members.map((member, index) => (
//                           <span key={member}>
//                             {member.toLowerCase() ===
//                             userAddress.toLowerCase() ? (
//                               <span className="text-blue-600 font-medium">
//                                 You
//                               </span>
//                             ) : (
//                               <span>
//                                 {member.slice(0, 6)}...{member.slice(-4)}
//                               </span>
//                             )}
//                             {index < group.members.length - 1 ? ", " : ""}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                   <Badge
//                     variant={
//                       group.status === "active" ? "default" : "secondary"
//                     }
//                   >
//                     {group.status}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="text-sm">
//                       <span className="text-muted-foreground">
//                         Your balance:{" "}
//                       </span>
//                       <span
//                         className={`font-semibold ${
//                           userBalance > 0
//                             ? "text-green-600"
//                             : userBalance < 0
//                               ? "text-red-600"
//                               : "text-muted-foreground"
//                         }`}
//                       >
//                         {userBalance > 0 ? "+" : ""}${userBalance.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleViewGroup(group.id)}
//                     className="opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     View Details
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </>
//   );
// });

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenseContract } from "@/hooks/useExpenseContract";
import { Loader2, Database, Search } from "lucide-react";

export function GroupList() {
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const { debugContractData, getGroupCount, getGroup } = useExpenseContract();

  const runDebug = async () => {
    setLoading(true);
    try {
      // Get basic contract info
      const count = await getGroupCount();
      console.log("Starting debug...");

      // Run the debug function
      await debugContractData();

      // Collect all data for display
      const groups = [];
      for (let i = 0; i < count; i++) {
        const group = await getGroup(i);
        if (group) {
          groups.push(group);
        }
      }

      setDebugData({
        contractAddress: "0x93270AF34c713899599b5902C31f91edB8C02436",
        network: "Base Sepolia Testnet (Chain ID: 84532)",
        groupCount: count,
        groups: groups,
      });
    } catch (error) {
      console.error("Debug error:", error);
      alert("Error debugging contract: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Contract Data Debugger</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View all data stored in your smart contract on the blockchain
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDebug} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fetching Contract Data...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Debug Contract Storage
            </>
          )}
        </Button>

        {debugData && (
          <div className="space-y-4">
            {/* Contract Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Contract Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Address:</strong> {debugData.contractAddress}
                </p>
                <p>
                  <strong>Network:</strong> {debugData.network}
                </p>
                <p>
                  <strong>Total Groups Stored:</strong> {debugData.groupCount}
                </p>
              </div>
            </div>

            {/* Groups Data */}
            {debugData.groups.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Database className="w-4 h-4 mr-2" />
                  Stored Groups Data ({debugData.groups.length})
                </h3>
                {debugData.groups.map((group: any, index: number) => (
                  <div
                    key={group.id}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-green-800">
                        Group #{group.id}: "{group.name}"
                      </h4>
                      <Badge variant="outline" className="text-green-700">
                        Stored on Blockchain
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Creator:</strong>
                        <span className="font-mono ml-2 text-blue-600">
                          {group.creator}
                        </span>
                      </div>
                      <div>
                        <strong>Members ({group.members.length}):</strong>
                        {group.members.length > 0 ? (
                          <ul className="ml-4 mt-1 space-y-1">
                            {group.members.map(
                              (member: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="font-mono text-blue-600"
                                >
                                  {idx + 1}. {member}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <span className="ml-2 text-gray-500">
                            No additional members
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  No groups found in contract storage. Create a group first!
                </p>
              </div>
            )}

            {/* Storage Location Info */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">
                📍 Where This Data is Stored:
              </h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>
                  • <strong>Location:</strong> Base Sepolia Blockchain
                </li>
                <li>
                  • <strong>Storage Type:</strong> Smart Contract State
                  Variables
                </li>
                <li>
                  • <strong>Persistence:</strong> Permanent (until blockchain
                  exists)
                </li>
                <li>
                  • <strong>Access:</strong> Public (anyone can read)
                </li>
                <li>
                  • <strong>Backup:</strong> Distributed across blockchain nodes
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
