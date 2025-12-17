// Setup file for dashboard routes
// This file shows how to register the dashboard routes in your Fastify server
// You can import this setup in your main index.js file

import cors from "@fastify/cors";
import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";

export async function setupDashboard_ayoub(fastify, dbcnx) {
  // Register CORS if not already registered
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true
    });
  } catch (error) {
    // CORS might already be registered, ignore the error
    console.log("CORS registration skipped (might already be registered)");
  }

  // Register dashboard routes
  await registerDashboardRoutes_ayoub(fastify, dbcnx);
  console.log("Dashboard routes registered successfully!");
}

