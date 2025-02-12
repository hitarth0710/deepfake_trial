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
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      return {
        result: data.result,
        confidence: data.confidence,
        frames: data.frames || [],
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
