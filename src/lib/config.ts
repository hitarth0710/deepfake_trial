export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  endpoints: {
    videoAnalysis: "http://127.0.0.1:8000/ml_app/api/analyze/video/",
    audioAnalysis: "http://127.0.0.1:8000/ml_app/api/analyze/audio/",
    imageAnalysis: "http://127.0.0.1:8000/ml_app/api/analyze/image/",
  },
};
