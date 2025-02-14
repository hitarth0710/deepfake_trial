import { config } from "./config";

const mockAnalysis = (type: "video" | "audio" | "image") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        result: Math.random() > 0.5 ? "FAKE" : "REAL",
        confidence: 85 + Math.random() * 10,
        ...(type === "video"
          ? {
              frame_predictions: Array(10)
                .fill(null)
                .map(() => [Math.random() > 0.5, 75 + Math.random() * 20]),
              faces_detected: Array(10).fill(true),
              total_frames: 100,
              frames_with_faces: 80,
            }
          : {}),
      });
    }, 2000);
  });
};

export const api = {
  async analyzeVideo(file: File, onProgress?: (progress: number) => void) {
    try {
      // For demo, use mock data
      if (!config.apiUrl) {
        // Simulate progress updates
        if (onProgress) {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 5;
            onProgress(Math.min(progress, 100));
            if (progress >= 100) clearInterval(interval);
          }, 200);
        }

        const result = await mockAnalysis("video");
        return result;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiUrl}/analyze/video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Video analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze video",
      );
    }
  },

  async analyzeAudio(file: File) {
    try {
      // For demo, use mock data
      if (!config.apiUrl) {
        return await mockAnalysis("audio");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiUrl}/analyze/audio`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Audio analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze audio",
      );
    }
  },

  async analyzeImage(file: File) {
    try {
      // For demo, use mock data
      if (!config.apiUrl) {
        return await mockAnalysis("image");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${config.apiUrl}/analyze/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image analysis failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze image",
      );
    }
  },
};
