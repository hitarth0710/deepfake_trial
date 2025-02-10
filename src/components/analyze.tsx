import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, FileAudio, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/ui/back-button";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "text">(
    "video",
  );

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);

    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setAnalyzing(false);
      }
    }, 500);
  };

  return (
    <div className="w-screen min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <div className="container pt-32 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Content Analysis</h1>
          <p className="text-muted-foreground mb-8">
            Detect AI-generated content across multiple media types
          </p>

          <FileUploadZone
            acceptedTypes={["video"]}
            onFileSelect={setFile}
            uploading={analyzing}
            progress={progress}
          />

          {file && !analyzing && (
            <Button
              size="lg"
              onClick={handleAnalyze}
              className="w-full md:w-auto"
            >
              Start Analysis
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
