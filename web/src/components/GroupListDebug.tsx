"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenseContract } from "@/hooks/useExpenseContract";

export function GroupListDebug() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getGroupCount, getGroup, debugContractData } = useExpenseContract();

  const fetchAndDebug = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🔄 Starting debug...");

      // First, run the debug function
      await debugContractData();

      // Get group count
      const count = await getGroupCount();
      console.log("📊 Group count:", count);

      if (count === 0) {
        setGroups([]);
        setError("No groups found in contract. Create a group first!");
        return;
      }

      // Fetch all groups
      const fetchedGroups = [];
      for (let i = 0; i < count; i++) {
        try {
          const group = await getGroup(i);
          console.log(`Group ${i}:`, group);
          if (group) {
            fetchedGroups.push(group);
          }
        } catch (err) {
          console.error(`Error fetching group ${i}:`, err);
        }
      }

      setGroups(fetchedGroups);
      console.log("✅ All groups fetched:", fetchedGroups);
    } catch (err: any) {
      console.error("💥 Debug error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndDebug();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Group List Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={fetchAndDebug} disabled={loading}>
          {loading ? "Loading..." : "Refresh Groups"}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        {groups.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold">Found {groups.length} groups:</h3>
            {groups.map((group, index) => (
              <div
                key={index}
                className="p-3 bg-green-50 border border-green-200 rounded"
              >
                <div>
                  <strong>ID:</strong> {group.id}
                </div>
                <div>
                  <strong>Name:</strong> {group.name}
                </div>
                <div>
                  <strong>Creator:</strong> {group.creator}
                </div>
                <div>
                  <strong>Members:</strong> {group.members?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {group.members?.map((member: string, idx: number) => (
                    <div key={idx}>
                      {idx + 1}. {member}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
              No groups found. Make sure you've created some groups first!
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
