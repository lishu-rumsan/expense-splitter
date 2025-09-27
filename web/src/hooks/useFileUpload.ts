"use client";

import { useState, useCallback } from "react";
import { synapseStorage, type UploadResult } from "@/lib/synapse-service";

export interface UseFileUploadOptions {
  privateKey?: string;
  onUploadStart?: (file: File) => void;
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: Error) => void;
}

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<UploadResult | null>;
  downloadFile: (pieceCid: string) => Promise<Uint8Array | null>;
  isUploading: boolean;
  isDownloading: boolean;
  uploadProgress: number;
  error: string | null;
  clearError: () => void;
  lastUploadResult: UploadResult | null;
}

export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastUploadResult, setLastUploadResult] = useState<UploadResult | null>(
    null
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      try {
        if (!options.privateKey) {
          throw new Error("Private key is required for file upload");
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        options.onUploadStart?.(file);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const result = await synapseStorage.uploadFile(
          file,
          options.privateKey
        );

        clearInterval(progressInterval);
        setUploadProgress(100);
        setLastUploadResult(result);

        options.onUploadSuccess?.(result);

        // Reset progress after a short delay
        setTimeout(() => setUploadProgress(0), 1000);

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        options.onUploadError?.(error);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const downloadFile = useCallback(
    async (pieceCid: string): Promise<Uint8Array | null> => {
      try {
        setIsDownloading(true);
        setError(null);

        const data = await synapseStorage.downloadFile(
          pieceCid,
          options.privateKey
        );
        return data;
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        return null;
      } finally {
        setIsDownloading(false);
      }
    },
    [options.privateKey]
  );

  return {
    uploadFile,
    downloadFile,
    isUploading,
    isDownloading,
    uploadProgress,
    error,
    clearError,
    lastUploadResult,
  };
}
