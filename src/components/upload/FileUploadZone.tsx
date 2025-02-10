import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, FileText, FileVideo, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type FileType = "video" | "audio" | "text";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: FileType[];
  maxSize?: number;
  className?: string;
  uploading?: boolean;
  progress?: number;
}

export function FileUploadZone({
  onFileSelect,
  acceptedTypes = ["video"],
  maxSize = 100 * 1024 * 1024, // 100MB default
  className,
  uploading = false,
  progress = 0,
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const getAcceptedFiles = useCallback(() => {
    const accepted: Record<string, string[]> = {};
    acceptedTypes.forEach((type) => {
      switch (type) {
        case "video":
          accepted["video/*"] = [];
          break;
        case "audio":
          accepted["audio/*"] = [];
          break;
        case "text":
          accepted["text/*"] = [".txt", ".doc", ".docx", ".pdf"];
          break;
      }
    });
    return accepted;
  }, [acceptedTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: getAcceptedFiles(),
    maxSize,
    multiple: false,
  });

  const getIcon = (type: FileType) => {
    switch (type) {
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      case "text":
        return FileText;
      default:
        return Upload;
    }
  };

  const Icon = acceptedTypes.length === 1 ? getIcon(acceptedTypes[0]) : Upload;

  return (
    <div
      {...getRootProps()}
      className={cn(
        "p-8 border-2 border-dashed rounded-xl transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-border",
        className,
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <Icon className="h-8 w-8 mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          {isDragActive
            ? "Drop your file here"
            : "Drag & drop your file here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground">
          {acceptedTypes
            .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
            .join(", ")}{" "}
          files up to {Math.round(maxSize / 1024 / 1024)}MB
        </p>
        {uploading && (
          <div className="w-full mt-4 space-y-2">
            <Progress value={progress} />
            <div className="flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
