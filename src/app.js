import Fastify from "fastify";

import { requestsLogger } from "./logger.js";

import healthRoutes from "./routes/healthRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

export let globalRequestCounter = 1;

const app = Fastify();

app.addHook("onRequest", (request, reply, done) => {
  requestsLogger.info(
    `Incoming request | #${globalRequestCounter} | resource: ${request.raw.url} | HTTP Verb ${request.raw.method}`
  );

  done();
});

app.addHook("onResponse", (request, reply, done) => {
  requestsLogger.debug(
    `request #${globalRequestCounter} duration: ${reply.getResponseTime()}ms`
  );

  globalRequestCounter++;

  done();
});

app.register(healthRoutes, { prefix: "/todo" });
app.register(todoRoutes, { prefix: "/todo" });

export default app;
