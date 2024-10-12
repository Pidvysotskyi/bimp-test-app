import { FastifyReply, FastifyRequest, FastifyPluginCallback } from "fastify";
import { Message } from "../models/message";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { basicAuth } from "../preHandlers/basicAuth";
import { NotFound, Conflict, BadRequest } from "http-errors";
import { sanitizeFileName } from "../modifiers/sanitizeFileName";
const UPLOAD_DIR = path.join(__dirname, "../", "../", "upload");

export const messageController: FastifyPluginCallback = (fastify, options, done) => {
  //Perform an POST endpoints fro messages

  // Define the Schema for request for file message
  const fileMessageSchema = {
    consumes: ["multipart/form-data"],
    body: {},
  };

  // Implement the POST controller for file message
  fastify.post("/file", { schema: fileMessageSchema, preHandler: basicAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.user!;
    const data = await req.file();

    if (!data) {
      throw new BadRequest(`No file uploaded`);
    }
    const message = await Message.create({ messageType: "FILE", mimeType: data?.mimetype, senderId: id });
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    const fileName = [message.id, sanitizeFileName(data.filename)].join("_");

    const resultUpload = path.join(UPLOAD_DIR, fileName);

    await pipeline(data.file, fs.createWriteStream(resultUpload));

    await message.update({ fileName });
    await message.reload();

    reply.code(201).send(message);
  });

  // Define the Schema for request for text message

  const textMessageSchema = {
    body: {
      type: "object",
      properties: {
        content: { type: "string" },
      },
      required: ["content"],
    },
  };

  // Define the types for request body for text message

  interface TextMessageBody {
    content: string;
  }

  // Implement the POST controller for file message

  fastify.post("/text", { schema: textMessageSchema, preHandler: basicAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.user!;
    const { content } = req.body as TextMessageBody;
    const message = await Message.create({ content, messageType: "TEXT", mimeType: "text/plain", senderId: id });

    reply.code(201).send(message);
  });

  //Perform an GET endpoints for messages

  // Define the types for request query params for text message

  interface MessageQueryParams {
    page?: string;
  }

  // Implement the GET controller for All messages

  fastify.get("/list", { preHandler: basicAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const PAGE_SIZE = 30;
    const { page = "1" } = req.query as MessageQueryParams;

    const pageNumber = Number(page);
    const validPage = !isNaN(pageNumber) && pageNumber > 0 ? pageNumber : 1;

    const totalCount = await Message.count();
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const messages = await Message.findAll({
      limit: PAGE_SIZE,
      offset: (validPage - 1) * PAGE_SIZE,
    });

    reply.code(200).send({ messages, totalPages, currentPage: validPage });
  });

  // Define the types for request string params for any message to GET

  interface MessageStringParams {
    id: string;
  }

  // Implement the GET controller for Exact message

  fastify.get("/content/:id", { preHandler: basicAuth }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as MessageStringParams;

    const message = await Message.findByPk(id);
    if (!message) {
      throw new NotFound(`The message with ID: '${id}' Not Found`);
    }

    reply.header("Content-Type", message.mimeType);

    if (message.messageType === "TEXT") {
      reply.code(200).send(message.content);
    } else if (message.messageType === "FILE") {
      const filePath = path.join(UPLOAD_DIR, message.fileName!);

      if (!fs.existsSync(filePath)) {
        throw new NotFound(`The file for message ID: '${id}' Not Found`);
      }

      reply.header("content-disposition", `attachment; filename="${message.fileName}"`);

      return reply.code(200).send(fs.createReadStream(filePath));
    } else {
      throw new Conflict(`The ${message.messageType} type is not acceptable`);
    }
  });

  done();
};
