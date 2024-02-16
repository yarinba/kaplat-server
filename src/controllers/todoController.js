import todoModel from "../models/todos";
import { todoLogger } from "../logger";

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

    const todos = await todoModel.getAll();

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

    todoLogger.info(`Creating new TODO with Title [${title}]`);
    todoLogger.debug(
      `Currently there are ${todos.length} TODOs in the system. New TODO will be assigned with id ${id}`
    );

    const newTodo = await todoModel.create({
      id,
      title,
      content,
      dueDate,
      status: STATUS.PENDING,
    });

    return reply.send({ result: newTodo.id });
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    todoLogger.error(errorMessage);
    return reply.status(409).send({ errorMessage });
  }
};

export const getTodosCount = async (req, reply) => {
  const { status, persistenceMethod } = req.query;

  // Check if status parameter is valid
  if (status && !(status in STATUS)) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todos = await todoModel.getAll(persistenceMethod);

  // Get the count of todos with the requested status
  const count =
    status === STATUS.ALL
      ? todos.length
      : todos.filter((todo) => todo.status === status).length;

  todoLogger.info(`Total TODOs count for state ${status} is ${count}`);

  return reply.send({ result: count });
};

export const getTodosData = async (req, reply) => {
  const { status, sortBy, persistenceMethod } = req.query;

  todoLogger.info(
    `Extracting todos content. Filter: ${status} | Sorting by: ${sortBy}`
  );

  // Check if status and sortBy parameters are valid
  if ((status && !(status in STATUS)) || (sortBy && !(sortBy in SORT_BY))) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todos = await todoModel.getAll(persistenceMethod);

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

  todoLogger.debug(
    `There are a total of ${todos.length} todos in the system. The result holds ${filteredTodos.length} todos`
  );

  return reply.send({ result: sortedTodos });
};

export const updateTodoStatus = async (req, reply) => {
  const { id, status } = req.query;

  todoLogger.info(`Update TODO id [${id}] state to ${status}`);

  // Check if status is valid
  if (status === STATUS.ALL || !(status in STATUS)) {
    return reply.status(400).send({ errorMessage: "Bad request" });
  }

  const todo = await todoModel.getById(parseInt(id));

  // Check if no such TODO with that id can be found
  if (!todo) {
    const errorMessage = `Error: no such TODO with id ${id}`;
    todoLogger.error(errorMessage);
    return reply.code(404).send({ errorMessage });
  }

  // Save the old status to return as a response
  const oldStatus = todo.status;

  // Update TODO status
  await todoModel.updateById(todo.id, { status });

  todoLogger.debug(`Todo id [${id}] state change: ${oldStatus} --> ${status}`);

  return reply.send({ result: oldStatus });
};

export const deleteTodo = async (req, reply) => {
  const { id } = req.query;

  if (!(await todoModel.deleteById(parseInt(id)))) {
    const errorMessage = `Error: no such TODO with id ${id}`;
    todoLogger.error(errorMessage);
    return reply.code(404).send({ errorMessage });
  }

  const result = (await todoModel.getAll()).length;

  todoLogger.info(`Removing todo id ${id}`);
  todoLogger.debug(
    `After removing todo id [${id}] there are ${result} TODOs in the system`
  );

  return reply.send({ result });
};
