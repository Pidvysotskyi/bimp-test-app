import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { User } from "../models/user";

export const accountController: FastifyPluginCallback = (fastify, options, done) => {
  const registerSchema = {
    type: "object",
    properties: {
      login: { type: "string" },
      password: { type: "string" },
    },
    required: ["login", "password"],
  };

  interface RegisterBody {
    login: string;
    password: string;
  }

  fastify.post("/register", { schema: { body: registerSchema } }, async (req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    const { login, password } = req.body;
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      reply.code(409).send({ error: `The User with login: '${login}' Already exists` });
    }

    const user = await User.create({ login, password });
    await user.reload();
    reply.code(201).send(user);
  });
  done();
};
