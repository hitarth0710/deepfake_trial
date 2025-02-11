// Video analysis using PyTorch model through API

interface FrameAnalysisResult {
  isFake: boolean;
  confidence: number;
  timestamp: number;
}

interface VideoAnalysisResult {
  overall: {
    isFake: boolean;
    confidence: number;
  };
  frames: FrameAnalysisResult[];
}

export class VideoAnalyzer {
  constructor() {
    // Initialize any required resources
  }

  private async extractFrames(
    videoFile: File,
    fps: number = 1,
  ): Promise<HTMLCanvasElement[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const frames: HTMLCanvasElement[] = [];

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const frameCount = Math.floor(duration * fps);
        let currentFrame = 0;

        const processFrame = () => {
          if (currentFrame >= frameCount) {
            resolve(frames);
            return;
          }

          const canvas = document.createElement("canvas");
          canvas.width = 224; // Model input size
          canvas.height = 224;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas);
          }

          video.currentTime = currentFrame++ / fps;
        };

        video.onseeked = processFrame;
        processFrame();
      };

      video.onerror = reject;
      video.src = URL.createObjectURL(videoFile);
    });
  }

  private async sendVideoForAnalysis(file: File): Promise<VideoAnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    return response.json();
  }

  public async analyzeVideo(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<VideoAnalysisResult> {
    if (!file) {
      throw new Error("No file provided");
    }

    try {
      // Start progress indication
      onProgress?.(0);

      // Send video to server for analysis
      const result = await this.sendVideoForAnalysis(file);

      // Complete progress
      onProgress?.(100);

      return result;
    } catch (error) {
      console.error("Video analysis failed:", error);
      throw error;
    }
  }
}

// Create singleton instance
export const videoAnalyzer = new VideoAnalyzer();
