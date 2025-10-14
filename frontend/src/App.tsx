
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import Home from "./pages/Home";
import Tournament from "./pages/Tournament";
import Game from "./pages/Game";
import Result from "./pages/Result";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Register from "./pages/Register";
// import { PrismaClient } from "/home/lhwask02/Desktop/trance/services/auth-service/generated/prisma"
// import { PrismaClient } from "../../services/auth-service/generated/prisma"
// const cl = new PrismaClient();
// const users = await cl.user.create({
//   data:
//   {
//     email: "test1@aaa.com",
//     name: "aaa",
//     password: "aaa",
//     loggedIn: false,
//     isOnline: false,
//   }
// });

// console.log(users);
const queryClient = new QueryClient();
// idfn

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
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
              <Route path="/game" element={<Game />} />
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

