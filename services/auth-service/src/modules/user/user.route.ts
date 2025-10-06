import { FastifyInstance } from "fastify";
import { createUser, login, logout } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [app.authenticate] }, async () => {
    return { message: "ok" };
  });

  // --- REGISTER ---
  app.post("/register", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password", "name"], // ✅ must be an array
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          name: { type: "string" },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    handler: createUser,
  });

  // --- LOGIN ---
  app.post("/login", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"], // ✅ also array
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
          },
        },
      },
    },
    handler: login,
  });

  app.delete("/logout", { preHandler: [app.authenticate] }, logout);
}
