import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/todos");

const todoSchema = new mongoose.Schema({
  rawid: Number,
  title: String,
  content: String,
  duedate: Date,
  state: String,
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
