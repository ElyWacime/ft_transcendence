import { FastifyInstance } from "fastify";
import { createUser, login, logout, update_email, update_password, update_username, update_image, refreshToken} from "./user.controller";
import prisma from "../../utils/prisma";

export async function userRoutes(app: FastifyInstance) {

  app.get("/get-user/:userId",{ preHandler: [app.authenticate] }, async (req:any, reply:any) => {

    try {
      const { userId } = req.params as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true
        }
      });
      
      if (!user) {
        return reply.status(404).send({
          error: "User not found"
        });
      }

      return reply.send(user);
    } catch (err) {
      return reply.status(500).send({
        error: "My Internal server error"
      });
    }
  });


  app.get("/", { preHandler: [app.authenticate] }, async () => {
    return { message: "ok" };
  });

  app.post("/register", {
    schema: {
      body: {
        type: "object",
        required: ["email", "password", "name"],
        properties: {
          email: { type: "string", format: "email", maxLength: 50 },
          password: { type: "string", minLength: 6 },
          name: { type: "string", maxLength: 50, minLength: 3 },
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
    preHandler: app.authenticate,
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: logout,
  });

  app.post("/refresh", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: {
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
    },
    handler: refreshToken,
  });

  app.put("/update_email", {
    preHandler: app.authenticate,
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

  app.put("/update_username", {
    preHandler: app.authenticate,
    schema: {
      body: {
        type: "object",
        required: ["current_password", "new_username"],
        properties: {
          current_password: { type: "string", minLength: 6 },
          new_username: { type: "string", minLength: 3 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            newUsername: { type: "string" },
          },
        },
        401: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        409: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    handler: update_username,
  });

  app.put("/update_image", {
    preHandler: app.authenticate,
    schema: {
      body: {
        type: "object",
        required: ["image", "image_name"],
        properties: {
          image: { 
            type: "string",
          },
          image_name: { 
            type: "string",
            minLength: 1,
            maxLength: 255
          }
        }
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            avatar_url: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
                avatar: { type: "string" }
              }
            }
          }
        },
        401: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          }
        },
        404: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          }
        },
        500: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          }
        }
      }
    },
    handler: update_image
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

  app.post("/search-this-name", {
    preHandler: app.authenticate,
    schema: {
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        }
      }
    }
  }, async (req: any, reply) => {
    try {
      const current_user = await prisma.user.findFirst({
        where: { name: req.body.name }
      });
      if (!current_user) {
        return reply.status(404).send({
          valid: false,
          error: "User not found"
        });
      }  
      return reply.send({
        valid: true,
        user_name: current_user.name,
        user_id: current_user.id,
        user_email: current_user.email,
      });
    } catch (err) {
      return reply.status(500).send({
        valid: false,
        error: "Internal server error"
      });
    }
  });

  app.get("/user-info/:userId", {
    preHandler: app.authenticate,
  }, async (req, reply) => {
    try {
      const { userId } = req.params as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          loggedIn: true,
          Auto_Match: true,
          CreatedAt: true
        }
      });

      if (!user) {
        return reply.status(404).send({
          error: "User not found"
        });
      }

      return reply.send(user);
    } catch (err) {
      console.error('[user-info] Error:', err);
      return reply.status(500).send({
        error: "Internal server error"
      });
    }
  });
  
}
