import {
  createTodo,
  getTodosCount,
  getTodosData,
  updateTodoStatus,
  deleteTodo,
} from "../controllers/todoController";

const todoRoutes = async (app) => {
  app.post("/", createTodo);
  app.get("/size", getTodosCount);
  app.get("/content", getTodosData);
  app.put("/", updateTodoStatus);
  app.delete("/", deleteTodo);
};

export default todoRoutes;
