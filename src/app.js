import Fastify from "fastify";

import { requestLogger } from "./logger.js";

import healthRoutes from "./routes/healthRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";

export let globalRequestCounter = 1;

const app = Fastify();

app.addHook("onRequest", (request, reply, done) => {
  requestLogger.info(
    `Incoming request | #${globalRequestCounter} | resource: ${request.raw.url} | HTTP Verb ${request.raw.method}`
  );

  done();
});

app.addHook("onResponse", (request, reply, done) => {
  requestLogger.debug(
    `request #${globalRequestCounter} duration: ${reply.getResponseTime()}ms`
  );

  globalRequestCounter++;

  done();
});

app.register(healthRoutes, { prefix: "/todo" });
app.register(todoRoutes, { prefix: "/todo" });
app.register(logsRoutes, { prefix: "/logs" });

export default app;
