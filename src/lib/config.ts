export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  endpoints: {
    video: "/ml_app/api/analyze/",
    audio: "/ml_app/api/analyze-audio/",
  },
};
