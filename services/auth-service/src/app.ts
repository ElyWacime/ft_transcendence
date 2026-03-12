import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { userRoutes } from "./modules/user/user.route";
import fjwt, { FastifyJWT } from "@fastify/jwt";
import fCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as fs from "fs";

const httpsOptions = process.env.USE_HTTPS === "true" ? {
  https: {
    key: fs.readFileSync("/app/certs/private.key"),
    cert: fs.readFileSync("/app/certs/certificate.crt"),
  }
} : {};

const app = Fastify({ 
  logger: true,
  bodyLimit: 7 * 1024 * 1024,
  ...httpsOptions
}).withTypeProvider<ZodTypeProvider>();

const parsedRateLimitMax = Number.parseInt(
  process.env.AUTH_RATE_LIMIT_MAX ?? "120",
  10,
);
const parsedRateLimitWindowMs = Number.parseInt(
  process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? "60000",
  10,
);

const authRateLimitMax = Number.isFinite(parsedRateLimitMax) && parsedRateLimitMax > 0
  ? parsedRateLimitMax
  : 120;
const authRateLimitWindowMs = Number.isFinite(parsedRateLimitWindowMs) && parsedRateLimitWindowMs > 0
  ? parsedRateLimitWindowMs
  : 60_000;

type RateLimitCounter = {
  count: number;
  windowStart: number;
  lastSeen: number;
};

const rateLimitByIp = new Map<string, RateLimitCounter>();

app.addHook("onRequest", (req, reply, done) => {
  const now = Date.now();
  const forwardedFor = req.headers["x-forwarded-for"];

  const clientIp = typeof forwardedFor === "string" && forwardedFor.trim().length > 0
    ? forwardedFor.split(",")[0].trim()
    : Array.isArray(forwardedFor) && forwardedFor.length > 0
      ? forwardedFor[0].split(",")[0].trim()
      : req.ip;

  for (const [ip, counter] of rateLimitByIp.entries()) {
    if (now - counter.lastSeen > authRateLimitWindowMs) {
      rateLimitByIp.delete(ip);
    }
  }

  const current = rateLimitByIp.get(clientIp);

  if (!current || now - current.windowStart >= authRateLimitWindowMs) {
    rateLimitByIp.set(clientIp, {
      count: 1,
      windowStart: now,
      lastSeen: now,
    });
    done();
    return;
  }

  current.count += 1;
  current.lastSeen = now;

  if (current.count > authRateLimitMax) {
    const retryAfterSeconds = Math.ceil(
      (current.windowStart + authRateLimitWindowMs - now) / 1000,
    );

    reply
      .header("Retry-After", String(Math.max(1, retryAfterSeconds)))
      .status(429)
      .send({ message: "Too many requests. Please try again later." });
    return;
  }

  done();
});

app.register(cors, {
  origin: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fjwt, { secret: process.env.JWT_ACCESS_SECRET });
app.addHook("preHandler", (req, _res, next) => {
  req.jwt = app.jwt;
  next();
});

app.register(fCookie, {
  secret: process.env.COOKIE_SECRET,
  hook: "preHandler",
});

app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      token = req.cookies.access_token;
    }
    
    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }

    try {
      const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
      req.user = decoded;
    } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
    }
  },
);

app.get("/healthcheck", async () => ({ message: "Success" }));

app.register(userRoutes);

app.addHook("onClose", async () => {
  rateLimitByIp.clear();
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing Fastify...`);
    await app.close();
    process.exit(0);
  });
}

async function main() {
  try {
    const port = 8000;
    const useHttps = process.env.USE_HTTPS === "true";

    await app.listen({ port, host: "0.0.0.0" });
    
    app.log.info(`Auth service running on port 8000 (${useHttps ? 'HTTPS' : 'HTTP'})`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
