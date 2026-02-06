
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import Home from "./pages/Home";
import LocalTournament from "./pages/LocalTournament";
import GameAI from "./pages/GameAI";
import Game from "./pages/Game";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "sonner"
import GameOnline from "./pages/GameOnline";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Register from "./pages/Register";
import MatchMacking from "./pages/MatchMacking";
import Dashboard_ayoub from "./pages/Dashboard_ayoub";
import ProfileSettings from "./pages/ProfileSettings_ayoub";
import ChangeEmail from "./pages/Change_email_page";
import ChangePassword from "./pages/ChangePassword";
import ChangePicture from "./pages/change-picture";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const RootLayout = () => (
  <div className="page-wrapper">
    <Navigation />
    <Outlet />
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "tournament", element: <LocalTournament /> },
        {
          path: "chat",
          element: (
            <ProtectedRoute children={undefined}>
              <Chat />
            </ProtectedRoute>
          ),
        },
        {
          path: "chat/:id",
          element: (
            <ProtectedRoute children={undefined}>
              <Chat />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          ),
        },
        { path: "profile/change-email", element: <ChangeEmail /> },
        { path: "profile/change-password", element: <ChangePassword /> },
        { path: "profile/change-picture", element: <ChangePicture /> },
        {
          path: "dashboard/:identifier?",
          element: (
            <ProtectedRoute>
              <Dashboard_ayoub />
            </ProtectedRoute>
          ),
        },
        {
          path: "loading",
          element: (
            <ProtectedRoute children={undefined}>
              <MatchMacking />
            </ProtectedRoute>
          ),
        },
        { path: "game", element: <Game /> },
        { path: "game-online", element: <GameOnline /> },
        { path: "game-ai", element: <GameAI /> },
        // { path: "result", element: <Result /> },
        {
          path: "login",
          element: (
            <PublicRoute>
              <Login />
            </PublicRoute>
          ),
        },
        {
          path: "register",
          element: (
            <PublicRoute>
              <Register />
            </PublicRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  { future: { v7_relativeSplatPath: true, v7_startTransition: true } }
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
      <Toaster />
      {/* <Sonner /> */}
      <AuthProvider children={undefined}>
        <RouterProvider router={router} />
      </AuthProvider>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
