import { healthCheck } from "../controllers/healthController";

const healthRoutes = async (app) => {
  app.get("/health", healthCheck);
};

export default healthRoutes;
