"use client";

import { Input } from "@/components/ui/input";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";

export function ExpenseForm() {
  const [privateKey] = useState("your-private-key-here"); 
  const { uploadFile, isUploading, uploadProgress, error, clearError } =
    useFileUpload({
      privateKey,
      onUploadStart: (file) => {
        console.log("Upload started for:", file.name);
      },
      onUploadSuccess: (result) => {
        console.log("Upload successful:", result);
      },
      onUploadError: (error) => {
        console.error("Upload failed:", error.message);
      },
    });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Input
        id="picture"
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {isUploading && (
        <div className="text-sm text-gray-600">
          Uploading... {uploadProgress}%
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          Error: {error}
          <button onClick={clearError} className="ml-2 underline">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
