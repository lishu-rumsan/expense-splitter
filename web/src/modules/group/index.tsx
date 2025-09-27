import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt, Settings } from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";
import { CreateGroup } from "./createGroup";
import { GroupList } from "./listGroup";

export default function GroupMain() {
  const [showCreateGroup, setShowCreateGroup] = React.useState(false);
  const groups: any[] = [];
  const totalExpenses = 0;
  const totalOwes = 0;
  const totalOwed = 0;
  const expenses: any[] = [];

  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  ES
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Expense Splitter</h1>
                <p className="text-sm text-muted-foreground truncate">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Groups</h2>
                <p className="text-muted-foreground">
                  Manage your expense groups and settlements
                </p>
              </div>
              <Button onClick={() => setShowCreateGroup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <Tabs defaultValue="groups" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="groups"
                  className="flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Groups</span>
                </TabsTrigger>
                <TabsTrigger
                  value="expenses"
                  className="flex items-center space-x-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Expenses</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settlements"
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settlements</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="groups">
                <GroupList userAddress={address as string} />
              </TabsContent>

              <TabsContent value="expenses">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>
                      All expenses across your groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expenses.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No expenses yet. Create a group and start adding
                        expenses!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {expenses?.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {expense.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  expense.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="font-semibold">
                              ${expense.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settlements">
                <Card>
                  <CardHeader>
                    <CardTitle>Settlement History</CardTitle>
                    <CardDescription>
                      Your payment settlements and receipts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      No settlements yet. Add expenses to see balances and
                      settle payments!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* <RecentActivity /> */}
            Recent Activity
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Groups
                  </span>
                  <span className="font-semibold">{groups.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Active Expenses
                  </span>
                  <span className="font-semibold">
                    ${totalExpenses.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">You Owe</span>
                  <span className="font-semibold text-red-500">
                    ${totalOwes.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Owed to You
                  </span>
                  <span className="font-semibold text-green-500">
                    ${totalOwed.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          userAddress={address as string}
        />
      )}
    </div>
  );
}
