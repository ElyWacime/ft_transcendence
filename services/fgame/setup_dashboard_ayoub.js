import cors from "@fastify/cors";
import { registerDashboardRoutes_ayoub } from "./dashboard_ayoub.js";

export async function setupDashboard_ayoub(fastify, dbcnx) {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true
    });
  } catch (error) {
  }

  await registerDashboardRoutes_ayoub(fastify, dbcnx);
}

