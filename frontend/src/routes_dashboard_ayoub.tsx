// Route configuration for Dashboard_ayoub
// To use this, import Dashboard_ayoub and add the route in your App.tsx:
// import Dashboard_ayoub from "./pages/Dashboard_ayoub";
// 
// Routes support both:
// - /dashboard (uses ID from JWT token - requires login)
// - /dashboard/:id (uses ID from URL parameter - no login required)

import Dashboard_ayoub from "./pages/Dashboard_ayoub";

export { Dashboard_ayoub };

// Example route configuration (supports both with and without ID):
// <Route
//   path="/dashboard/:id?"
//   element={
//     <ProtectedRoute children={undefined}>
//       <Dashboard_ayoub />
//     </ProtectedRoute>
//   }
// />

