"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutUs() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                🔐 Secure
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Blockchain-based security for all transactions
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-green-600 dark:text-green-400 font-semibold mb-2">
                ⚡ Fast
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Quick and easy expense splitting in seconds
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="text-purple-600 dark:text-purple-400 font-semibold mb-2">
                📱 Simple
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Intuitive interface for seamless user experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
