import { JWT } from "../node_modules/@fastify/jwt";
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

// adding jwt property to req
// authenticate property to FastifyInstance
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}
type UserPayload = {
  id: string;
  email: string;
  name: string;
};
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: UserPayload;
  }
}
