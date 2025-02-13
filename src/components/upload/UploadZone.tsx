import React from "react";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

export function UploadZone() {
  return (
    <Card className="p-8 border-2 border-dashed">
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          Drag & drop files here or click to browse
        </p>
      </div>
    </Card>
  );
}
