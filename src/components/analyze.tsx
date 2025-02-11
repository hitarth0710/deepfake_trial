import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { FileUploadZone } from "@/components/upload/FileUploadZone";
import { videoAnalyzer } from "@/lib/ai/video-analysis";
import { VideoAnalysisResult } from "./analysis/VideoAnalysisResult";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setAnalyzing(true);
      setProgress(0);

      const analysisResult = await videoAnalyzer.analyzeVideo(
        file,
        (progress) => {
          setProgress(progress);
        },
      );

      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Show error to user
    } finally {
      setAnalyzing(false);
    }
    if (!file) return;
    setAnalyzing(true);

    try {
      const analysisResult = await videoAnalyzer.analyzeVideo(
        file,
        (progress) => {
          setProgress(progress);
        },
      );
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
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
              className="w-full md:w-auto mt-8"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Start Analysis"
              )}
            </Button>
          )}

          {result && <VideoAnalysisResult result={result} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
