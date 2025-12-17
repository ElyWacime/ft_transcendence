import { FastifyInstance } from "fastify";
import { createUser, login, logout, update_email, update_password } from "./user.controller";
import prisma from "../../utils/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [app.authenticate] }, async () => {
    return { message: "ok" };
  });

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

  app.put("/update_email", {
    schema: {
      body: {
        type: "object",
        required: ["new_email", "password"],
        properties: {
          new_email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            accessToken: { type: "string" },
          },
        },
      },
    },
    handler: update_email,
  });

  app.put("/update_password", {
    preHandler: app.authenticate,
    schema: {
      body: {
        type: "object",
        required: ["current_password", "new_password"],
        properties: {
          current_password: { type: "string", minLength: 6 },
          new_password: { type: "string", minLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            accessToken: { type: "string" },
          },
        },
      },
    },
    handler: update_password,
  });

  app.post("/validate_token", {
    schema: {
      body: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" }
        }
      }
    }
  }, async (req, reply) => {
    const { token } = req.body;
    
    try {
      const decoded = req.jwt.verify(token);
      const current_user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
      return reply.send({
        valid: true,
        user_name: current_user.name,
        user_id: current_user.id,
        user_email: current_user.email,
      });
    } catch (err) {
      return reply.status(401).send({
        valid: false,
        error: "Invalid or expired token"
      });
    }
  });
}
