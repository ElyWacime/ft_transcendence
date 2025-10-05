import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUser } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: "/ route hit" });
  });

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
    async (req, reply) => {
      // temporary stub until you add real login logic
      return reply.code(201).send({ accessToken: "fake-token" });
    },
  );

  app.delete("/logout", () => {});

  app.log.info("user routes registered");
}
