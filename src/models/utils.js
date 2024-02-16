/**
 * the todo object in db will have the following structure:
 * {
 *  rawid: number,
 *  title: string,
 *  content: string,
 *  duedate: Date,
 *  state: string
 * }
 *
 * the function should return
 * {
 *  id: number,
 *  title: string,
 *  content: string,
 *  dueDate: Date,
 *  status: string
 * }
 *  */
export function deserializeTodo(todo) {
  return {
    id: todo.rawid,
    title: todo.title,
    content: todo.content,
    dueDate: todo.duedate,
    status: todo.state,
  };
}
