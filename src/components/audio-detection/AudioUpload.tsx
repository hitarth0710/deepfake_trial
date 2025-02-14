import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio } from "lucide-react";

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  maxSize?: number;
}

export function AudioUpload({
  onFileSelect,
  maxSize = 50 * 1024 * 1024, // 50MB default
}: AudioUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a", ".aac"],
    },
    maxSize,
    multiple: false,
  });

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12
          flex flex-col items-center justify-center
          cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-200"}
        `}
      >
        <input {...getInputProps()} />
        <FileAudio className="h-10 w-10 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-1">
          Drag & drop your audio file here
        </p>
        <p className="text-gray-500 mb-4">or</p>
        <Button variant="outline" className="mb-4">
          Select Audio
        </Button>
        <div className="text-center text-sm text-gray-500">
          <p>Supported formats: MP3, WAV, M4A, AAC</p>
          <p>Maximum file size: {Math.floor(maxSize / 1024 / 1024)}MB</p>
        </div>
      </div>
    </Card>
  );
}
