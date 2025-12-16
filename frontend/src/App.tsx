
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import Home from "./pages/Home";
import Tournament from "./pages/Tournament";
import GameAI from "./pages/GameAI";
import Game from "./pages/Game";
import GameOnline from "./pages/GameOnline";
import Result from "./pages/Result";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Register from "./pages/Register";
import MatchMacking from "./pages/MatchMacking";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider children={undefined}>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/tournament"
                element={
                  <ProtectedRoute children={undefined}>
                    <Tournament />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute children={undefined}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/loading" element={<MatchMacking />} />
              <Route path="/game" element={<Game />} />
              <Route path="/game-online" element={<GameOnline />} />
              <Route path="/game-ai" element={<GameAI />} />
              <Route path="/result" element={<Result />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

