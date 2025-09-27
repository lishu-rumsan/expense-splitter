"use client";

import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { Wallet, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, address } = useAccount();

  const handleAboutUs = () => {
    router.push("/aboutus");
  };

  React.useEffect(() => {
    if (isConnected) {
      router.push("/group");
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Expense Splitter
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Split expenses easily and fairly with your friends, family, or
            colleagues. Connect your wallet to get started with secure
            transactions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
                  <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Connect Your Wallet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  Connect your crypto wallet to enable secure and transparent
                  expense splitting with blockchain technology.
                </p>
                {/* <Button
                  onClick={handleWalletConnect}
                  size="lg"
                  className="w-full cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button> */}
                <ConnectKitButton />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                  <Info className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Learn More
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  Discover how our expense splitting platform works and learn
                  about our mission to make shared expenses simple.
                </p>
                <Button
                  onClick={handleAboutUs}
                  size="lg"
                  className="w-full cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
                >
                  <Info className="h-5 w-5 mr-2" />
                  About Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
