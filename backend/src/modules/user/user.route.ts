import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUser } from "./user.controller";
import { login, logout } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: [app.authenticate],
    },
    (req: FastifyRequest, reply: FastifyReply) => {
      reply.send({ message: "/ route hit" });
    },
  );

  app.post(
    "/register",
    {
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
    },
    createUser,
  );

  app.post(
    "/login",
    {
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
    },
    login,
  );

  app.delete("/logout", { preHandler: [app.authenticate] }, logout);

  app.log.info("user routes registered");
}
