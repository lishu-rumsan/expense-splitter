"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, ArrowRight, Calendar, DollarSign } from "lucide-react";

interface GroupListProps {
  userAddress: string;
}

export function GroupList({ userAddress }: GroupListProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups: any[] = [];

  const handleViewGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      setSelectedGroup(groupId);
    }
  };

  const handleCloseDetails = () => {
    setSelectedGroup(null);
  };

  const getUserBalance = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    const userMember = group?.members.find(
      (m: any) => m.address === userAddress
    );
    return userMember?.balance || 0;
  };

  if (groups?.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            Create your first group to start splitting expenses with friends,
            family, or colleagues.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {groups.map((group) => {
          const userBalance = getUserBalance(group.id);
          const memberCount = group.members.length;

          return (
            <Card
              key={group.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{group.name}</span>
                      {group.createdBy === userAddress && (
                        <Badge variant="outline" className="text-xs">
                          Owner
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {memberCount} member{memberCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${group.totalExpenses.toFixed(2)} total</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardDescription>
                    {group.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      group.status === "active" ? "default" : "secondary"
                    }
                  >
                    {group.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Your balance:{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          userBalance > 0
                            ? "text-green-600"
                            : userBalance < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {userBalance > 0 ? "+" : ""}${userBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewGroup(group.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
