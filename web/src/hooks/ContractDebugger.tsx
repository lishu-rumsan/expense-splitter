"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExpenseContract } from "@/hooks/useExpenseContract";
import { Loader2, Database, Search } from "lucide-react";

export function ContractDebugger() {
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
