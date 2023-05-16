import Fastify from "fastify";

import healthRoutes from "./routes/healthRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

app.register(healthRoutes, { prefix: "/todo" });
app.register(todoRoutes, { prefix: "/todo" });

export default app;
