"use client";

import { Input } from "@/components/ui/input";
import { useSimpleUpload } from "@/hooks/useSimpleUpload";

export function ExpenseForm() {
  // const [privateKey] = useState(process.env.NEXT_PUBLIC_PRIVATE_KEY || "");
  const privateKey =
    "0x404b135088bc4046f8ae06c939e3aa2c3ea0fdc0d8c9109926fa5cb7184ec08f";

  // Validate private key format
  const isValidPrivateKey = privateKey.match(/^0x[0-9a-fA-F]{64}$/);

  const {
    uploadFile,
    isUploading,
    uploadProgress,
    error,
    clearError,
    isInitializing,
  } = useSimpleUpload({
    privateKey,
    onUploadStart: (file) => {
      console.log("Upload started forx:", file.name);
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
      // Check if private key is valid before attempting upload
      if (!isValidPrivateKey) {
        console.error("Invalid or missing private key");
        return;
      }
      await uploadFile(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {!isValidPrivateKey && (
        <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
          ⚠️ Invalid or missing private key. Please set NEXT_PUBLIC_PRIVATE_KEY
          in your environment variables.
        </div>
      )}

      <Input
        id="picture"
        type="file"
        onChange={handleFileChange}
        disabled={isUploading || isInitializing || !isValidPrivateKey}
      />

      {isInitializing && (
        <div className="text-sm text-blue-600">Initializing Synapse SDK...</div>
      )}

      {isUploading && (
        <div className="text-sm text-gray-600">
          Uploading... {uploadProgress}%
          {uploadProgress < 30 && " (Setting up payments...)"}
          {uploadProgress >= 50 &&
            uploadProgress < 90 &&
            " (Uploading file...)"}
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
