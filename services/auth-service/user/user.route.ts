import { FastifyInstance } from "../node_modules/fastify";
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
        required: ["email", "password", "name"],
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
        required: ["email", "password"],
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

  app.post("/logout", {
    schema: {
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
    },
    handler: logout,
  });

  //app.post("/logout", { preHandler: [app.authenticate] }, logout);
}
