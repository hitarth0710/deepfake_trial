import { config } from "./config";

export const api = {
  async analyzeVideo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${config.apiUrl}${config.endpoints.video}`,
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

  async analyzeAudio(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Start progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 2;
        if (progress <= 100) {
          onProgress?.(progress);
        }
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);

      const response = await fetch(
        `${config.apiUrl}${config.endpoints.audio}`,
        {
          method: "POST",
          body: formData,
        },
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Analysis failed");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      return {
        result: data.result as "REAL" | "FAKE",
        confidence: parseFloat(data.confidence.toFixed(2)),
        audio_url: data.audio_url,
        filename: data.filename,
        waveform_data: data.waveform_data,
        spectral_features: data.spectral_features,
        segments_analyzed: data.segments_analyzed,
      };
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to analyze audio",
      );
    }
  },
};
