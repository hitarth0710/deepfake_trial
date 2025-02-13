import { config } from "./config";

export const api = {
  async analyzeVideo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("sequence_length", "20");

    try {
      const response = await fetch(`${config.apiUrl}/ml_app/api/analyze/`, {
        method: "POST",
        body: formData,
        // Important: Don't set Content-Type header, let the browser set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      return {
        result: data.result as "REAL" | "FAKE",
        confidence: parseFloat(data.confidence.toFixed(2)),
        frames: data.frames || [],
        video_url: data.video_url,
        filename: data.filename,
      };
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw error;
    }
  },

  async analyzeText(text: string) {
    // Simulate text analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plagiarism_score: Math.random() * 100,
          matches: [],
        });
      }, 1000);
    });
  },
};
