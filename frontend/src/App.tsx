
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
import Profile from "./pages/Profile";
import Dashboard_ayoub from "./pages/Dashboard_ayoub";
import ProfileSettings from "./pages/ProfileSettings_ayoub";
import ChangeEmail from "./pages/Change_email_page";
import ChangePassword from "./pages/ChangePassword";
import ChangePicture from "./pages/change-picture";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="page-wrapper">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/tournament"
                element={
                  <ProtectedRoute>
                    <Tournament />
                  </ProtectedRoute>
                }
              />

              <Route path="/profile"
              element={
                <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }/>
              <Route path="/profile/change-email" element={<ChangeEmail />} />
              <Route path="/profile/change-password" element={<ChangePassword />} />
              <Route path="/profile/change-picture" element={<ChangePicture />} />

              <Route
                path="/dashboard/:id?"
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
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

