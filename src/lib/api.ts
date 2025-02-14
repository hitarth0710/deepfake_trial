export const api = {
  async analyzeVideo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/ml_app/api/analyze/`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      return {
        result: data.result as "REAL" | "FAKE",
        confidence: parseFloat(data.confidence.toFixed(2)),
        video_url: data.video_url,
        filename: data.filename,
        frame_predictions: data.frame_predictions,
        faces_detected: data.faces_detected,
        total_frames: data.total_frames,
        frames_with_faces: data.frames_with_faces,
      };
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze video",
      );
    }
  },
};
