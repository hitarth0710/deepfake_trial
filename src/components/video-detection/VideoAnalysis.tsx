import { useState } from "react";
import { api } from "@/lib/api";
import UploadSection from "./UploadSection";
import AnalysisSection from "./AnalysisSection";

export function VideoAnalysis() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    result?: "REAL" | "FAKE";
    confidence?: number;
    video_url?: string;
    filename?: string;
  }>({});

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsAnalyzing(true);

      // Call the API to analyze the video
      const results = await api.analyzeVideo(file);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Error analyzing video:", error);
      alert(error instanceof Error ? error.message : "Failed to analyze video");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Deepfake Detection
          </h1>
          <p className="text-gray-600">
            Upload a video to analyze it for potential deepfake manipulation
          </p>
        </div>

        <UploadSection onFileSelect={handleFileSelect} />

        {(videoUrl || isAnalyzing) && (
          <AnalysisSection
            videoUrl={videoUrl || undefined}
            isAnalyzing={isAnalyzing}
            confidenceScore={analysisResults.confidence}
            detectionResult={
              analysisResults.result?.toLowerCase() as "real" | "fake"
            }
          />
        )}
      </div>
    </div>
  );
}
