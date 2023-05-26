import { getCurrentLevel, setLevel } from "../controllers/logsController";

const logsRoutes = async (app) => {
  app.get("/level", getCurrentLevel);
  app.put("/level", setLevel);
};

export default logsRoutes;
