import { Routes, Route, useRoutes } from "react-router-dom";
import VideoDetection from "./pages/video-detection";
import routes from "tempo-routes";

function App() {
  return (
    <>
      {/* Tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<VideoDetection />} />
        {/* Add this before any catchall routes */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </>
  );
}

export default App;
