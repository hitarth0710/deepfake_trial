import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./components/dashboard";
import ErrorPage from "./pages/error";
import Profile from "./components/profile";
import Home from "./components/home";
import Analyze from "./components/analyze";
import AnalyzeAudio from "./components/analyze-audio";
import AnalyzeText from "./components/analyze-text";
import Transform from "./components/transform";
import SignIn from "./components/auth/sign-in";
import Register from "./components/auth/register";
import Docs from "./components/docs";
import Pricing from "./components/pricing";
import routes from "tempo-routes";

import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze-audio"
            element={
              <ProtectedRoute>
                <AnalyzeAudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analyze-text"
            element={
              <ProtectedRoute>
                <AnalyzeText />
              </ProtectedRoute>
            }
          />
          <Route path="/transform" element={<Transform />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/error" element={<ErrorPage />} />
          {/* Add catch-all route for 404s */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        {/* Tempo routes will be handled by the platform */}
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
