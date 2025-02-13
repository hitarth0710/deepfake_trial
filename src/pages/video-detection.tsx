import React, { useState } from "react";
import UploadSection from "@/components/video-detection/UploadSection";
import AnalysisSection from "@/components/video-detection/AnalysisSection";

const VideoDetectionPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("sequence_length", "20");

      const response = await fetch(config.modelEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setIsAnalyzing(false);

      // Update UI with results
      setAnalysisResults({
        result: data.result,
        confidence: data.confidence,
        frames: data.frames || [],
      });
    } catch (error) {
      console.error("Error analyzing video:", error);
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
            confidenceScore={85}
            detectionResult="fake"
          />
        )}
      </div>
    </div>
  );
};

export default VideoDetectionPage;
