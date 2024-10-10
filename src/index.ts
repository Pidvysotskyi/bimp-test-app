import Fastify, { FastifyInstance } from "fastify";

const app: FastifyInstance = Fastify({
  logger: true,
});

app.get("/", (req, res) => {
  return "Hello world";
});

const start = async () => {
  try {
    // Connect to DB (Connection happens just before server starts)
    // await connectDB();

    // Start the server after DB connection
    await app.listen({ port: 10000 });
    console.log("Server is running on http://localhost:10000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
