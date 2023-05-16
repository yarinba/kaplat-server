let todos = [];
let latestId = 0;

function getNewID() {
  return ++latestId;
}

function getAll() {
  return todos;
}

function create(todo) {
  todos.push(todo);
  return todo;
}

function getById(id) {
  return todos.find((todo) => todo.id === id);
}

function updateById(id, updatedTodo) {
  let todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
    return todos[todoIndex];
  }
  return null;
}

function deleteById(id) {
  let todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    return true;
  }
  return false;
}

export default { getNewID, getAll, create, getById, updateById, deleteById };
