"use client";

import { useState, useCallback } from "react";
import { Synapse, RPC_URLS } from "@filoz/synapse-sdk";

export interface UploadResult {
  pieceCid: string;
  size: number;
  fileName: string;
  uploadTime: number;
}

interface UseSimpleUploadProps {
  privateKey: string;
  onUploadStart?: (file: File) => void;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
}

export function useSimpleUpload({
  privateKey,
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}: UseSimpleUploadProps) {
  const [synapse, setSynapse] = useState<Synapse | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const initializeSynapse = useCallback(async () => {
    if (synapse) return synapse;

    // Validate private key before attempting to initialize
    if (
      !privateKey ||
      privateKey === "your-private-key-here" ||
      privateKey === "" ||
      !privateKey.match(/^(0x)?[0-9a-fA-F]{64}$/)
    ) {
      throw new Error(
        "Invalid or missing private key. Please set a valid private key."
      );
    }

    setIsInitializing(true);
    try {
      const formattedPrivateKey = privateKey.startsWith("0x")
        ? privateKey
        : `0x${privateKey}`;

      const newSynapse = await Synapse.create({
        privateKey: formattedPrivateKey,
        rpcURL: RPC_URLS.calibration.websocket,
      });

      setSynapse(newSynapse);
      console.log("Synapse SDK initialized successfully!");
      return newSynapse;
    } catch (error) {
      console.error("Failed to initialize Synapse:", error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [privateKey, synapse]);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setError(null);
      setUploadProgress(0);

      try {
        onUploadStart?.(file);
        setIsUploading(true);

        // Step 1: Initialize Synapse SDK
        setUploadProgress(20);
        const synapseInstance = await initializeSynapse();

        // Step 2: Prepare file data
        setUploadProgress(40);
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        console.log(`Uploading file: ${file.name} (${data.length} bytes)`);

        // Step 3: Try direct upload
        setUploadProgress(60);
        const uploadResult = await synapseInstance.storage.upload(data);

        setUploadProgress(90);

        const result: UploadResult = {
          pieceCid: uploadResult.pieceCid.toString(),
          size: data.length,
          fileName: file.name,
          uploadTime: Date.now(),
        };

        setUploadProgress(100);
        console.log(`Upload complete! PieceCID: ${result.pieceCid}`);

        onUploadSuccess?.(result);
        return result;
      } catch (error) {
        let errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        // Provide more helpful error messages
        if (
          errorMessage.includes("missing revert data") ||
          errorMessage.includes("CALL_EXCEPTION")
        ) {
          errorMessage =
            "Network or contract error. This might be due to:\n" +
            "• Filecoin Calibration testnet issues\n" +
            "• Insufficient test tokens (need ETH for gas and USDFC for storage)\n" +
            "• Network connectivity problems\n\n" +
            "Try getting test tokens from the Filecoin Calibration faucet first.";
        }

        setError(errorMessage);
        onUploadError?.(error as Error);
        console.error("Upload failed:", error);
        return null;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [initializeSynapse, onUploadStart, onUploadSuccess, onUploadError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    isInitializing,
    isUploading,
    uploadProgress,
    error,
    clearError,
    synapse,
  };
}
