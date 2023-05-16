import todoModel from "../models/todos";

const STATUS = {
  ALL: "ALL",
  PENDING: "PENDING",
  LATE: "LATE",
  DONE: "DONE",
};

const SORT_BY = {
  ID: "ID",
  DUE_DATE: "dueDate",
  TITLE: "title",
};

export const createTodo = async (req, reply) => {
  try {
    const { title, content, dueDate } = req.body;

    const todos = todoModel.getAll();

    // Check if a TODO with this title already exists
    const existingTodo = todos.find((todo) => todo.title === title);

    if (existingTodo) {
      throw new Error(
        `TODO with the title [${title}] already exists in the system`
      );
    }

    // Check if the dueDate is in the future
    const now = new Date().getTime();
    if (new Date(dueDate) < now) {
      throw new Error("Can't create new TODO that its due date is in the past");
    }

    const id = todoModel.getNewID();

    const newTodo = todoModel.create({
      id,
      title,
      content,
      dueDate,
      status: STATUS.PENDING,
    });

    return reply.send({ result: newTodo.id });
  } catch (error) {
    return reply.status(409).send({ errorMessage: `Error: ${error.message}` });
  }
};

export const getTodosCount = async (req, reply) => {
  const { status } = req.query;

  // Check if status parameter is valid
  if (status && !(status in STATUS)) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todos = todoModel.getAll();

  // Get the count of todos with the requested status
  const count =
    status === STATUS.ALL
      ? todos.length
      : todos.filter((todo) => todo.status === status).length;

  return reply.send({ result: count });
};

export const getTodosData = async (req, reply) => {
  const { status, sortBy } = req.query;

  // Check if status and sortBy parameters are valid
  if ((status && !(status in STATUS)) || (sortBy && !(sortBy in SORT_BY))) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todos = todoModel.getAll();

  // Filter todos by status
  const filteredTodos =
    status === STATUS.ALL
      ? todos
      : todos.filter((todo) => todo.status === status);

  // Sort todos by sortBy parameter
  const sortedTodos =
    !sortBy || sortBy === SORT_BY.ID
      ? filteredTodos.sort((a, b) => a.id - b.id)
      : filteredTodos.sort((a, b) =>
          a[SORT_BY[sortBy]].localeCompare(b[SORT_BY[sortBy]])
        );

  return reply.send({ result: sortedTodos });
};

export const updateTodoStatus = async (req, reply) => {
  const { id, status } = req.query;

  // Check if status is valid
  if (status === STATUS.ALL || !(status in STATUS)) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todo = todoModel.getById(parseInt(id));

  // Check if no such TODO with that id can be found
  if (!todo) {
    return reply
      .code(404)
      .send({ errorMessage: `Error: no such TODO with id ${id}` });
  }

  // Save the old status to return as a response
  const oldStatus = todo.status;

  // Update TODO status
  todoModel.updateById(todo.id, { status });

  return reply.send({ result: oldStatus });
};

export const deleteTodo = async (req, reply) => {
  const { id } = req.query;

  if (!todoModel.deleteById(parseInt(id))) {
    return reply
      .code(404)
      .send({ errorMessage: `Error: no such TODO with id ${id}` });
  }

  const result = todoModel.getAll().length;

  return reply.send({ result });
};
