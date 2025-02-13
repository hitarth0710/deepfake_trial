export const api = {
  async analyzeVideo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/ml_app/api/analyze/`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      return {
        result: data.result as "REAL" | "FAKE",
        confidence: parseFloat(data.confidence.toFixed(2)),
        video_url: data.video_url,
        filename: data.filename,
      };
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw error;
    }
  },
};
