export const config = {
  apiUrl:
    import.meta.env.VITE_API_URL ||
    "https://dazzling-chaplygin1-j6rbl.dev-2.tempolabs.ai",
  endpoints: {
    video: "/api/analyze/",
    audio: "/api/analyze-audio/",
  },
};
