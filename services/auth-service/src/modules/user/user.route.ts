import { FastifyInstance } from "fastify";
import { createUser, login, logout, update_email } from "./user.controller";
import { FastifyInstance } from "fastify";

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

  // ---- UPDATE EMAIL ----
  app.put('/api/profile/email', update_email);

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
      return reply.send({
        valid: true,
        user: decoded, 
      });
    } catch (err) {
      return reply.status(401).send({
        valid: false,
        error: "Invalid or expired token"
      });
    }
  });

  //app.post("/logout", { preHandler: [app.authenticate] }, logout);
}
