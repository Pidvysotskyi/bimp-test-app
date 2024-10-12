import Fastify, { FastifyInstance } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import { messageController } from "./controllers/messageController";
import { accountController } from "./controllers/accountController";
import path from "path";
import { User } from "./models/user";
const UPLOAD_DIR = path.join(__dirname, "../", "upload");

const app: FastifyInstance = Fastify({
  logger: true,
});

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}

app.setErrorHandler((error, request, reply) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = !error.message ? "Internal Server Error" : error.message;

  reply.status(statusCode).send({ error: message });
});

app.register(require("@fastify/static"), {
  root: UPLOAD_DIR,
  prefix: "/upload/",
});

app.register(fastifyMultipart);
app.register(accountController, { prefix: "/account" });
app.register(messageController, { prefix: "/message" });

export default app;
