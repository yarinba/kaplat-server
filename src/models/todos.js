import pgClient from "../db/pg-client";
import mongoTodoModel from "../db/mongo-client";
import { deserializeTodo } from "./utils";

let latestId = 2;

function getNewID() {
  return ++latestId;
}

/**
 * @param {"POSTGRES" | "MONGO"} persistenceMethod
 */
async function getAll(persistenceMethod) {
  // mongo implementation
  if (persistenceMethod === "MONGO") {
    const mongoResult = await mongoTodoModel.find();

    return mongoResult.map(deserializeTodo);
  }

  // pg implementation
  const pgResult = await pgClient.query("SELECT * FROM todos");

  return pgResult.rows.map(deserializeTodo);
}

async function create(todo) {
  // pg implementation
  const pgPromise = pgClient.query(
    "INSERT INTO todos(rawid, title, content, duedate, state) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [todo.id, todo.title, todo.content, todo.dueDate, todo.status]
  );

  // mongo implementation
  const mongoPromise = mongoTodoModel.create({
    rawid: todo.id,
    title: todo.title,
    content: todo.content,
    duedate: todo.dueDate,
    state: todo.status,
  });

  const [pgResult, mongoResult] = await Promise.all([pgPromise, mongoPromise]);

  return pgResult.rows.map(deserializeTodo)[0];
}

async function getById(id) {
  // pg implementation
  const pgPromise = pgClient.query("SELECT * FROM todos WHERE rawid = $1", [
    id,
  ]);

  // mongo implementation
  const mongoPromise = mongoTodoModel.findOne({ rawid: id });

  const [pgResult, mongoResult] = await Promise.all([pgPromise, mongoPromise]);

  return pgResult.rows.map(deserializeTodo)[0];
}

async function updateById(id, updatedTodo) {
  // pg implementation
  const pgPromise = pgClient.query(
    "UPDATE todos SET state = $1 WHERE rawid = $2 RETURNING *",
    [updatedTodo.status, id]
  );

  // mongo implementation
  const mongoPromise = mongoTodoModel.findOneAndUpdate(
    { rawid: id },
    { $set: { state: updatedTodo.status } }
  );

  const [pgResult, mongoResult] = await Promise.all([pgPromise, mongoPromise]);

  return pgResult.rows.map(deserializeTodo)[0];
}

async function deleteById(id) {
  // pg implementation
  const { rowCount: pgTodosCount } = await pgClient.query(
    "SELECT * FROM todos WHERE rawid = $1",
    [id]
  );

  // mongo implementation
  const mongoResult = await mongoTodoModel.deleteOne({ rawid: id });

  if (pgTodosCount === 0 || mongoResult.deletedCount === 0) {
    return false;
  }

  await pgClient.query("DELETE FROM todos WHERE rawid = $1", [id]);

  return true;
}

export default { getNewID, getAll, create, getById, updateById, deleteById };
