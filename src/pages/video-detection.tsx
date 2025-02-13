import React, { useState } from "react";
import UploadSection from "@/components/video-detection/UploadSection";
import AnalysisSection from "@/components/video-detection/AnalysisSection";
import { api } from "@/lib/api";

const VideoDetectionPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<{
    result?: "REAL" | "FAKE";
    confidence?: number;
    frames?: string[];
    video_url?: string;
    filename?: string;
  }>({});

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsAnalyzing(true);

      // Use the api function to analyze the video
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
            detectionResult={analysisResults.result}
          />
        )}
      </div>
    </div>
  );
};

export default VideoDetectionPage;
