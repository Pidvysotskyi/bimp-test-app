import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { Unauthorized } from "http-errors";

export const basicAuth = async (req: FastifyRequest, reply: FastifyReply) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new Unauthorized();
  }

  const credentials = authorization.split(" ")[1];
  const decoded = Buffer.from(credentials, "base64").toString("utf-8");
  const [login, password] = decoded.split(":");

  const user = await User.unscoped().findOne({ where: { login } });
  if (!user) {
    throw new Unauthorized(`The user with login: '${login}' Not Found`);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Unauthorized(`The Wrong password`);
  }
  req.user = user;
};
