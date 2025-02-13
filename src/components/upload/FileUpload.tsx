import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function FileUpload() {
  return (
    <Card className="p-6 bg-background">
      <div className="flex flex-col items-center gap-4">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <Button>Upload File</Button>
      </div>
    </Card>
  );
}
