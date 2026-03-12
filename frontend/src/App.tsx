
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Navigation } from "@/components/navigation";
import Home from "./pages/Home";
import GameAI from "./pages/GameAI";
import Game from "./pages/Game";
import { Toaster } from "sonner"
import GameOnline from "./pages/GameOnline";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import TournamentOnline from "./pages/TournamentOnline";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Register from "./pages/Register";
import MatchHistory from "./pages/MatchHistory";
import MatchMacking from "./pages/MatchMacking";
import Dashboard_ayoub from "./pages/Dashboard_ayoub";
import ProfileSettings from "./pages/ProfileSettings_ayoub";
import ChangeEmail from "./pages/Change_email_page";
import ChangePassword from "./pages/ChangePassword";
import ChangePicture from "./pages/change-picture";
import Chat from "./pages/Chat";
import Result from "./pages/Result";
import ChangeUsername from "./pages/Change_username_page";
import { WebSocketProvider } from "./context/WebSocketContext";
import { ChatSocketProvider } from "./context/ChatSocketContext";

const RootLayout = () => (
  <ChatSocketProvider>
    <div className="page-wrapper">
      <Navigation />
      <Outlet />
    </div>
  </ChatSocketProvider>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
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
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <MatchHistory />
            </ProtectedRoute>
          ),
        },
        { path: "profile/change-email", element: <ChangeEmail /> },
        { path: "profile/change-password", element: <ChangePassword /> },
        { path: "profile/change-picture", element: <ChangePicture /> },
        { path: "profile/change-username", element: <ChangeUsername /> },
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
        { path: "result", element: <ProtectedRoute><Result /></ProtectedRoute> },
        { path: "game-online", element: <ProtectedRoute><GameOnline /></ProtectedRoute>
      
      },
        {
          path: "online-tournament",
          element: (
            <ProtectedRoute>
              <TournamentOnline />
            </ProtectedRoute>
          ),
        },
        { path: "game-ai", element: <GameAI /> },
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
  <>
    <Toaster
      theme="dark"
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast: "site-toast",
          title: "site-toast-title",
          description: "site-toast-description",
          actionButton: "site-toast-action",
          cancelButton: "site-toast-cancel",
          closeButton: "site-toast-close",
          success: "site-toast-success",
          error: "site-toast-error",
          info: "site-toast-info",
          warning: "site-toast-warning",
        },
      }}
    />
    <AuthProvider children={undefined}>
      <WebSocketProvider>
        <RouterProvider router={router} />
        </WebSocketProvider>
    </AuthProvider>    
  </>
);

export default App;
