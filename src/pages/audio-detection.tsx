import { useState } from "react";
import Navbar from "@/components/navbar";
import { BackButton } from "@/components/ui/back-button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/lib/use-toast";
import { useNavigate } from "react-router-dom";
import { AudioUpload } from "@/components/audio-detection/AudioUpload";
import { AudioAnalysis } from "@/components/audio-detection/AudioAnalysis";

export default function AudioDetection() {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to analyze audio",
        variant: "default",
      });
      navigate("/sign-in");
      return;
    }
    setFile(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <div className="container max-w-3xl pt-32 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Audio Deepfake Detection</h1>
          <p className="text-muted-foreground">
            Upload an audio file to analyze it for potential AI-generated voices
          </p>
        </div>

        <div className="space-y-6">
          <AudioUpload onFileSelect={handleFileSelect} />
          {file && <AudioAnalysis file={file} />}
        </div>
      </div>
    </div>
  );
}
