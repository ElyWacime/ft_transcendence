import React from "react";
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
import { PublicRoute } from "./components/PublicRoute";
import Register from "./pages/Register";
import MatchMacking from "./pages/MatchMacking";
import Chat from "./pages/Chat";
import ProfileSettings from "./pages/ProfileSettings_ayoub";
import ChangeEmail from "./pages/Change_email_page";
import ChangePassword from "./pages/ChangePassword";
import ChangePicture from "./pages/change-picture";
import Dashboard_ayoub from "./pages/Dashboard_ayoub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="page-wrapper min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:id"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tournament"
                element={
                  <ProtectedRoute>
                    <Tournament />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/change-email"
                element={
                  <ProtectedRoute>
                    <ChangeEmail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/change-picture"
                element={
                  <ProtectedRoute>
                    <ChangePicture />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/:identifier?"
                element={
                  <ProtectedRoute>
                    <Dashboard_ayoub />
                  </ProtectedRoute>
                }
              />
              <Route path="/loading" element={<MatchMacking />} />
              <Route path="/game" element={<Game />} />
              <Route path="/game-online" element={<GameOnline />} />
              <Route path="/game-ai" element={<GameAI />} />
              <Route path="/result" element={<Result />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

